#!/usr/bin/env python3
"""Build the release overview for the check-release skill.

    python3 skills/check-release/scripts/overview.py mg-v3.15.0
    python3 skills/check-release/scripts/overview.py mg-v3.15.0 --apply
    python3 skills/check-release/scripts/overview.py mg-v3.15.0 --json findings.json

Collects everything from GitHub with `gh` (signed in, with read access to
memgraph/memgraph and memgraph/documentation): the PRs in the Memgraph
milestone, the docs PRs in the docs milestone or into the release branch, and
the release notes section on the release branch. Prints the overview block
(steps 1-4 and 8 of SKILL.md) and a short summary of what needs attention.

--apply writes the block into the release PR description, between the
check-release markers, and leaves the rest of the description as it is. It
needs write access to memgraph/documentation.
--json writes the findings (to-do lists, labels to check, noticed items) for
the report.
"""
import argparse, datetime, json, re, subprocess, sys, tempfile

MG, DOCS = 'memgraph/memgraph', 'memgraph/documentation'
DOCS_LABELS = ('Docs needed', 'Docs - changelog only', 'Docs unnecessary')
START, END = '<!-- check-release:start -->', '<!-- check-release:end -->'
PRODUCT_REF = re.compile(r'memgraph/memgraph(?:#|/pull/)(\d+)')
NOTE_LINK = re.compile(r'\(https://github\.com/memgraph/memgraph/pull/(\d+)\)')

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('milestone', help='Memgraph milestone title, such as mg-v3.15.0')
ap.add_argument('--apply', action='store_true', help='write the block into the release PR description')
ap.add_argument('--json', metavar='FILE', help='also write the findings to this file')
args = ap.parse_args()


def gh(*cmd, json_out=True):
    out = subprocess.run(['gh', *cmd], capture_output=True, text=True)
    if out.returncode:
        sys.exit(f'gh {" ".join(cmd)} failed:\n{out.stderr}')
    return json.loads(out.stdout) if json_out else out.stdout


def paginate(path):
    # --slurp turns the pages into one JSON array of pages
    return [item for page in gh('api', '--paginate', '--slurp', path) for item in page]


# 1. Find the release
full = args.milestone.removeprefix('mg-v')
version = full.removesuffix('.0') if full.count('.') == 2 and full.endswith('.0') else full
branch = f'release/{version}'
milestones = paginate(f'repos/{MG}/milestones?state=all&per_page=100')
milestone = next((m for m in milestones if m['title'] == args.milestone), None)
if not milestone:
    sys.exit(f'No Memgraph milestone titled {args.milestone}')
m = re.search(r'DOCS\s*->\s*\S*?/pull/(\d+)', milestone.get('description') or '')
release_pr = int(m.group(1)) if m else None
if not release_pr:
    found = gh('pr', 'list', '--repo', DOCS, '--state', 'all', '--search', f'"Memgraph v{full}" in:title', '--json', 'number,title')
    release_pr = next((p['number'] for p in found if p['title'].startswith(f'Memgraph v{full}')), None)
if not release_pr:
    sys.exit(f'No release PR: link it as "DOCS -> <PR URL>" in the {args.milestone} milestone description')

issues = paginate(f'repos/{MG}/issues?milestone={milestone["number"]}&state=all&per_page=100')
prs = {}
for i in issues:
    if 'pull_request' not in i:
        continue
    if i['pull_request'].get('merged_at'):
        status = 'merged'
    elif i['state'] == 'open':
        status = 'draft' if i.get('draft') else 'open'
    else:
        continue  # closed without merging
    prs[i['number']] = dict(title=i['title'], author=i['user']['login'],
                            labels=[l['name'] for l in i['labels']], status=status)
merged = {n for n, p in prs.items() if p['status'] == 'merged'}
has = lambda n, label: label in prs[n]['labels']

# Release notes section on the release branch
raw = gh('api', f'repos/{DOCS}/contents/pages/release-notes.mdx?ref={branch}',
         '-H', 'Accept: application/vnd.github.raw', json_out=False)
heading = f'### Memgraph v{full}'
if heading not in raw:
    sys.exit(f'No "{heading}" section in pages/release-notes.mdx on {branch}')
section = raw[raw.index(heading):]
nxt = re.search(r'\n### ', section[len(heading):])
section = section[:len(heading) + nxt.start()] if nxt else section
noted = {int(n) for n in NOTE_LINK.findall(section)}
in_breaking = set()
b = re.search(r'Breaking changes.*?\n(.*?)(?=\{<h4|\Z)', section, re.S)
if b:
    in_breaking = {int(n) for n in NOTE_LINK.findall(b.group(1))}

# 4. Docs PRs: in the docs milestone or into the release branch
fields = 'number,title,state,baseRefName,body,author,milestone'
docs = {}
for extra in (['--search', f'milestone:"{version}"'], ['--base', branch]):
    for d in gh('pr', 'list', '--repo', DOCS, '--state', 'all', '--limit', '500', *extra, '--json', fields):
        docs[d['number']] = d
docs_info, covers = {}, {}
for n, d in sorted(docs.items()):
    if d['state'] == 'CLOSED' or n == release_pr or d['title'].startswith('Memgraph v'):
        continue
    body = d['body'] or ''
    note = ('note' if re.search(r'(?m)^### Release note\s*$', body)
            else 'corrections' if re.search(r'(?m)^### Release note corrections\s*$', body) else None)
    noticed = []
    sec = re.search(r'(?ms)^### Noticed, not fixed\s*\n(.*?)(?=^### |\Z)', body)
    if sec:
        noticed = [l.strip()[2:] for l in sec.group(1).splitlines() if l.strip().startswith('- ')]
    products = sorted({int(x) for x in PRODUCT_REF.findall(body)})
    docs_info[n] = dict(state=d['state'], base=d['baseRefName'], products=products, note=note, noticed=noticed,
                        milestone=(d.get('milestone') or {}).get('title'))
    for p in products:
        covers.setdefault(p, []).append(n)


def docs_merged(n):
    ds = covers.get(n, [])
    return bool(ds) and all(docs_info[d]['state'] == 'MERGED' for d in ds)


# Progress
needed = sorted(n for n in prs if has(n, 'Docs needed'))
notes_all = sorted(n for n in prs if has(n, 'Docs needed') or has(n, 'Docs - changelog only'))
notes_merged = [n for n in notes_all if n in merged]
notes_done = [n for n in notes_merged if n in noted]
notes_due = [n for n in notes_merged if has(n, 'Docs - changelog only') or docs_merged(n)]
notes_todo = [n for n in notes_due if n not in noted]
notes_early = [n for n in notes_merged if n in noted and n not in notes_due]
docs_merged_prs = [n for n in needed if n in merged]
docs_done = [n for n in docs_merged_prs if docs_merged(n)]
docs_todo = [n for n in docs_merged_prs if not docs_merged(n)]
no_docs_pr = [n for n in needed if not covers.get(n)]
waiting = [(d, i['products']) for d, i in sorted(docs_info.items())
           if i['state'] == 'OPEN' and any(p in prs and prs[p]['status'] != 'merged' for p in i['products'])]
outside = [(d, p) for d, i in sorted(docs_info.items()) for p in i['products'] if p not in prs]


def pct(a, b):  # halves round down, so the numbers match earlier runs
    x = a * 100 / b if b else 0
    return int(x) + (1 if x - int(x) > 0.5 else 0)


def bar(a, b):
    cells = round(a * 10 / b) if b else 0
    return '▓' * cells + '░' * (10 - cells)


# 2. Docs labels
missing_label = sorted(n for n in merged if not any(l in DOCS_LABELS for l in prs[n]['labels']))
several_labels = sorted(n for n in merged if sum(l in DOCS_LABELS for l in prs[n]['labels']) > 1)
questionable = []
for n in sorted(merged):
    p = prs[n]
    if 'feature' in p['labels'] and 'Docs unnecessary' in p['labels']:
        questionable.append((n, 'feature labeled Docs unnecessary'))
    elif (re.match(r'(test|testing|tests|ci|infra|refactor)(\(.*?\))?!?:', p['title'].lower())
          and {l for l in p['labels'] if not l.startswith(('CI ', 'Capability'))} - set(DOCS_LABELS)
              <= {'infrastructure', 'tests', 'benchmarking', 'Code improvements'}
          and not has(n, 'Docs unnecessary') and n not in missing_label):
        questionable.append((n, 'test, CI or refactor PR with a docs label'))

U = lambda n: f'https://github.com/{MG}/pull/{n}'
D = lambda n: f'https://github.com/{DOCS}/pull/{n}'
box = lambda done: '[x]' if done else '[ ]'
L = [START, '### Docs Integration Tracking', '',
     f'Rebuilt by the `check-release` skill on {datetime.date.today()}; edits here are',
     "overwritten. To change what is listed, fix the product PR's docs label.", '',
     '#### Progress', '', '```',
     f'Memgraph    {bar(len(merged), len(prs))}  {len(merged):>3} of {len(prs)} PRs merged ({pct(len(merged), len(prs))}%)',
     f'Notes       {bar(len(notes_done), len(notes_all))}  {len(notes_done):>3} of {len(notes_all)} written ({pct(len(notes_done), len(notes_all))}%)',
     f'Docs pages  {bar(len(docs_done), len(needed))}  {len(docs_done):>3} of {len(needed)} merged ({pct(len(docs_done), len(needed))}%)',
     '```', '',
     '| Docs work | Total | Product merged | Docs done | To do now |', '| --- | --- | --- | --- | --- |',
     f'| Release notes | {len(notes_all)} | {len(notes_merged)} | {len(notes_done)} | {len(notes_todo)} |',
     f'| Docs pages | {len(needed)} | {len(docs_merged_prs)} | {len(docs_done)} | {len(docs_todo)} |', '']
if waiting:
    L.append('Docs PRs open, waiting on their product PR: '
             + ', '.join(f'#{d} (' + ', '.join(f'{MG}#{p}' for p in ps) + ')' for d, ps in waiting) + '.')
L += [f'{len(no_docs_pr)} `Docs needed` PRs have no docs PR yet.', '']
L += ['#### Breaking changes PRs', '']
L += [f'- {box(n in in_breaking)} {U(n)} — {prs[n]["title"]} @{prs[n]["author"]}'
      for n in sorted(merged) if has(n, 'breaking')] or ['None merged yet.']
L += ['', '#### Docs needed (Memgraph PR → Docs PR)', '']
L += [f'- {box(docs_merged(n))} {U(n)} → ' + (', '.join(D(d) for d in covers[n]) if covers.get(n) else 'no doc PR yet')
      + f' @{prs[n]["author"]}' for n in docs_merged_prs] or ['None merged yet.']
L += ['', '#### Changelog (all PRs requiring a changelog entry)', '']
for n in notes_merged:
    line = f'- {box(n in noted)} {U(n)} @{prs[n]["author"]}'
    for d in covers.get(n, []):
        if docs_info[d]['note'] == 'note':
            line += f' note in {DOCS}#{d}'
        elif docs_info[d]['note'] == 'corrections' and n not in noted:
            line += f' ⚠ corrections in {DOCS}#{d}'
    L.append(line)
if not notes_merged:
    L.append('None merged yet.')
if missing_label:
    L += ['', '#### Missing docs labels', ''] + [f'- [ ] {U(n)} @{prs[n]["author"]}' for n in missing_label]
noticed = [(d, item) for d, i in sorted(docs_info.items()) for item in i['noticed']]
if noticed:
    L += ['', '#### Noticed, not fixed', ''] + [f'- [ ] {item} — from {DOCS}#{d}' for d, item in noticed]
L.append(END)
block = '\n'.join(L)
print(block)

findings = dict(
    milestone=args.milestone, version=version, branch=branch, release_pr=release_pr,
    notes_to_write=notes_todo, notes_written_before_docs_merged=notes_early,
    breaking_outside_breaking_section=sorted(n for n in merged if has(n, 'breaking') and n in noted and n not in in_breaking),
    not_breaking_in_breaking_section=sorted(n for n in in_breaking if n in prs and not has(n, 'breaking')),
    notes_for_prs_outside_milestone=sorted(n for n in noted if n not in prs),
    docs_to_merge=docs_todo, docs_needed_without_docs_pr=no_docs_pr,
    docs_prs_waiting=[dict(docs_pr=d, products=p) for d, p in waiting],
    docs_prs_naming_prs_outside_milestone=[dict(docs_pr=d, product=p) for d, p in outside],
    docs_prs_without_milestone=sorted(d for d, i in docs_info.items() if i['base'] == branch and i['milestone'] != version),
    docs_prs_with_wrong_base=sorted(d for d, i in docs_info.items() if i['milestone'] == version and i['base'] != branch),
    missing_label=missing_label, several_labels=several_labels,
    questionable_labels=[dict(pr=n, reason=r, title=prs[n]['title'], labels=prs[n]['labels']) for n, r in questionable],
    noticed=[dict(docs_pr=d, item=i) for d, i in noticed],
)
if args.json:
    with open(args.json, 'w') as f:
        json.dump(findings, f, indent=2)

summary = [f'\nRelease PR: {D(release_pr)}']
for key, value in findings.items():
    if isinstance(value, list) and value and key != 'noticed':
        summary.append(f'{key}: {value}')
summary.append(f'noticed items: {len(noticed)}')
print('\n'.join(summary), file=sys.stderr)

if args.apply:
    body = gh('api', f'repos/{DOCS}/pulls/{release_pr}', '--jq', '.body', json_out=False).rstrip('\n')
    if START in body and END in body:
        body = body[:body.index(START)] + block + body[body.index(END) + len(END):]
    else:
        body = body + '\n\n' + block
    with tempfile.NamedTemporaryFile('w', suffix='.md', delete=False) as f:
        f.write(body + '\n')
    gh('api', f'repos/{DOCS}/pulls/{release_pr}', '-X', 'PATCH', '-F', f'body=@{f.name}', '--jq', '.number', json_out=False)
    print(f'Updated the overview in {D(release_pr)}', file=sys.stderr)
