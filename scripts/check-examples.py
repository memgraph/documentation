#!/usr/bin/env python3
"""Run the docs' Cypher examples on Memgraph and check the names they use.

    python3 scripts/check-examples.py --base origin/main      # pages this branch changed
    python3 scripts/check-examples.py --pages querying/clauses/call.mdx
    python3 scripts/check-examples.py --all                   # every page (about an hour)

Needs Docker. Each page runs on a fresh Memgraph MAGE container, its ```cypher blocks
in page order, so an example can use data an earlier one created.

What fails the check, in the blocks a PR changed:
  - a query that doesn't parse, or a stray character in it
  - a procedure or function that doesn't exist, or a YIELD field it doesn't return
  - CALL without YIELD on a procedure that returns fields
  - -- or # comments (Memgraph only accepts //)
  - an Enterprise procedure on a page that doesn't say it needs a licence
  - a flag in the configuration tables that Memgraph doesn't have
Problems in blocks the PR didn't change are shown as warnings.

Blocks that aren't meant to run are marked in the fence: ```cypher template (grammar
such as [IF NOT EXISTS]), ```cypher invalid (shown as wrong on purpose), ```cypher neo4j
(Neo4j syntax), ```cypher output. Examples with <placeholders>, ... or $parameters are
not run, but the names in them are still checked.

The image is the newest Memgraph release in pages/release-notes.mdx. On PRs the check
runs only for PRs into main: docs on a release branch describe a Memgraph that isn't out
yet, so their examples are checked when the release branch is merged into main. If that
version's image isn't published yet, the check fails and says to rerun it once it is.

With MEMGRAPH_ENTERPRISE_LICENSE and MEMGRAPH_ORGANIZATION_NAME set, containers start
with the licence. Docker reads the values from the environment, so they never appear in
a command line; examples that set the licence are skipped, query output is never
printed, and every message is scrubbed of both values before it is printed.
"""
import argparse, concurrent.futures as cf, csv, json, os, re, subprocess, sys, threading, time
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / 'pages'
REPO = 'memgraph/memgraph-mage'

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('--base', help='git ref to compare with; checks the pages changed since it')
ap.add_argument('--pages', nargs='*', default=[], help='pages under pages/ to check in full')
ap.add_argument('--all', action='store_true', help='check every page in full')
ap.add_argument('--image', help='Docker image (default: the newest release in the release notes)')
ap.add_argument('--workers', type=int, default=4)
ap.add_argument('--timeout', type=int, default=20, help='seconds per statement')
a = ap.parse_args()

GH = os.environ.get('GITHUB_ACTIONS') == 'true'
LICENSED = bool(os.environ.get('MEMGRAPH_ENTERPRISE_LICENSE') and os.environ.get('MEMGRAPH_ORGANIZATION_NAME'))
LICENCE_ARGS = ['-e', 'MEMGRAPH_ENTERPRISE_LICENSE', '-e', 'MEMGRAPH_ORGANIZATION_NAME'] if LICENSED else []
SECRETS = [v for v in (os.environ.get('MEMGRAPH_ENTERPRISE_LICENSE'), os.environ.get('MEMGRAPH_ORGANIZATION_NAME')) if v and len(v) >= 4]


def scrub(text):
    """Remove the licence key and organization name from anything this script prints."""
    for v in SECRETS:
        text = text.replace(v, '***')
    return text


def sh(*args, inp=None, timeout=120):
    return subprocess.run(args, input=inp, capture_output=True, text=True, errors='replace', timeout=timeout)


# ---------------------------------------------------------------- what to check

def changed_lines(base):
    """{page path under pages/: set of changed line numbers} for .md/.mdx pages changed since base."""
    diff = sh('git', '-C', str(ROOT), 'diff', '-U0', '--no-color', f'{base}...HEAD', '--', 'pages').stdout
    out, cur = defaultdict(set), None
    for line in diff.splitlines():
        if line.startswith('+++ '):
            p = line[6:] if line.startswith('+++ b/') else None
            cur = p[len('pages/'):] if p and p.endswith(('.md', '.mdx')) else None
        elif line.startswith('@@') and cur:
            m = re.match(r'@@ -\S+ \+(\d+)(?:,(\d+))? @@', line)
            start, n = int(m.group(1)), int(m.group(2) if m.group(2) is not None else 1)
            out[cur].update(range(start, start + n))
    return out


def has_cypher(rel):
    return '```cypher' in (PAGES / rel).read_text(errors='replace')


if a.all:
    targets = {str(p.relative_to(PAGES)): None for p in sorted(PAGES.rglob('*.md*'))}
elif a.pages:
    targets = {p: None for p in a.pages}
elif a.base:
    targets = dict(changed_lines(a.base))
else:
    ap.error('give --base, --pages or --all')
# None means every line of the page counts as changed.
targets = {p: lines for p, lines in targets.items() if (PAGES / p).exists() and not p.startswith('memgraph-zero/')}
CONFIG_PAGE = 'database-management/configuration.mdx'
run_pages = sorted(p for p in targets if has_cypher(p))
check_flags = CONFIG_PAGE in targets
if not run_pages and not check_flags:
    print('No changed page has Cypher examples or configuration flags to check.')
    sys.exit(0)


# ---------------------------------------------------------------- image

def releases():
    """Memgraph versions in the release notes, newest first."""
    text = (PAGES / 'release-notes.mdx').read_text(errors='replace')
    vs = {tuple(map(int, v)) for v in re.findall(r'^#{2,4}\s+Memgraph v(\d+)\.(\d+)\.(\d+)', text, re.M)}
    return ['.'.join(map(str, v)) for v in sorted(vs, reverse=True)]


def image_exists(image):
    return sh('docker', 'manifest', 'inspect', image).returncode == 0


if a.image:
    IMAGE = a.image
else:
    versions = releases()
    IMAGE = f'{REPO}:{versions[0]}' if versions else f'{REPO}:latest'
    if versions and not image_exists(IMAGE):
        print(f'{IMAGE} is not published yet. The examples describe Memgraph {versions[0]}, so they can only be '
              f'checked on it: rerun this check once the image is out.')
        sys.exit(1)
print(f'Image: {IMAGE}{" with an Enterprise licence" if LICENSED else ""}. Pages: {len(run_pages)}.', flush=True)


# ---------------------------------------------------------------- blocks and statements

HIGH = ('syntax', 'bad_character', 'no_procedure', 'no_function', 'yield_field', 'missing_yield', 'comment_style')
EXPLAIN = {
    'syntax': "This example doesn't parse",
    'bad_character': 'This example has a character the parser does not expect (a curly quote, a stray symbol)',
    'no_procedure': "This example calls a procedure that doesn't exist",
    'no_function': "This example calls a function that doesn't exist",
    'yield_field': "This example yields a field the procedure doesn't return",
    'missing_yield': 'This example needs YIELD: the procedure returns fields',
    'comment_style': 'This example uses -- or # comments; Memgraph only accepts //',
    'enterprise_unsaid': 'This example uses an Enterprise procedure, and the page never says it needs a licence',
    'no_flag': "This flag isn't in Memgraph",
}
PLACEHOLDER = re.compile(r'<[A-Za-z_][\w \-]*>|\.\.\.|…')
PARAM = re.compile(r'\$[A-Za-z_]\w*')
MARKS = re.compile(r'\b(invalid|template|neo4j|output|gql)\b', re.I)
SQL_COMMENT = re.compile(r'(?:^\s*|;\s*)(--|#)', re.M)
OUTPUT = re.compile(r'^\s*(\+-|\||>>|memgraph>|->)', re.M)
OTHER_LANGUAGE = re.compile(r'^\s*(ADD CONNECTOR|ADD MAPPING|CONNECT \w+ AS|USE CONNECTION|CYPHER\b|SET SESSION LANGUAGE)', re.I)
TEMPLATE = re.compile(r'\w\?(?=\s|$)|\)\s*\?|\[[A-Za-z][A-Za-z _]*\]|\[[A-Z]{2,} [^\]]*\]|\(\s*[A-Z_]+\s*\|\s*[A-Z_]+|\{[A-Z_]+\|[A-Z_]+\}|\bDATA_TYPE\b|\b(permission|permission_list|privilege_list|edge_type_list|label_list|property_list|user_or_role|role_name|user_name|database_name)\b|\bnum_rows\b|user/role|list of users')
KEYWORD = re.compile(r'^\s*(MATCH|CREATE|MERGE|CALL|RETURN|WITH|UNWIND|LOAD|SHOW|DROP|SET|DELETE|DETACH|OPTIONAL|FOREACH|ALTER|ANALYZE|STORAGE|FREE|ENABLE|DISABLE|GRANT|DENY|REVOKE|USE|EXPLAIN|PROFILE|BEGIN|COMMIT|DUMP|TERMINATE|REGISTER)\b', re.I)
SETS_LICENCE = re.compile(r"SET\s+DATABASE\s+SETTING\s+['\"](enterprise\.license|organization\.name)['\"]", re.I)
CREATE_USER = re.compile(r"CREATE\s+USER\s+(?:IF\s+NOT\s+EXISTS\s+)?[`'\"]?(\w+)[`'\"]?(?:\s+IDENTIFIED\s+BY\s+'([^']*)')?", re.I)
LICENCE = re.compile(r'enterprise|licen[cs]e', re.I)


def blocks(rel):
    """(first line, last line, fence meta, code) for each ```cypher block, in page order."""
    out, lines, i = [], (PAGES / rel).read_text(errors='replace').splitlines(), 0
    while i < len(lines):
        m = re.match(r'^(\s*)```cypher\b(.*)$', lines[i])
        if m:
            indent, start, body = len(m.group(1)), i + 1, []
            i += 1
            while i < len(lines) and not re.match(r'^\s*```\s*$', lines[i]):
                body.append(lines[i][indent:] if lines[i][:indent].strip() == '' else lines[i])
                i += 1
            out.append((start, i + 1, m.group(2).strip(), '\n'.join(body)))
        i += 1
    return out


def strip_comment(line):
    """Drop a trailing // comment, but not // inside a string such as a URL."""
    quote = None
    for i, ch in enumerate(line):
        if quote:
            quote = None if ch == quote else quote
        elif ch in '"\'`':
            quote = ch
        elif line.startswith('//', i):
            return line[:i].rstrip()
    return line


def statements(code):
    code = '\n'.join(strip_comment(l) for l in code.splitlines())
    if ';' in code:
        parts = re.split(r';\s*(?:\n|$)', code)
    else:
        # Several queries separated by blank lines, each starting with a keyword, or one query.
        chunks = [c for c in re.split(r'\n\s*\n', code) if c.strip()]
        parts = chunks if len(chunks) > 1 and all(KEYWORD.match(c) for c in chunks) else [code]
    return [p.strip() for p in parts if p.strip()]


def classify(msg):
    m = msg.lower()
    if 'has no result field named' in m:
        return 'yield_field'
    if 'there is no procedure named' in m:
        return 'no_procedure'
    if re.search(r"function '.*' doesn't exist", m):
        return 'no_function'
    if 'licen' in m or 'enterprise' in m:
        return 'enterprise'
    if 'parsing error' in m or 'error on line' in m:
        return 'syntax'
    if 'call without yield may only be used' in m:
        return 'missing_yield'
    if 'there is a wrong token at position' in m:
        return 'bad_character'
    if 'should either create or update something, or return results' in m:
        return 'incomplete'
    return 'other'


# ---------------------------------------------------------------- Memgraph

class Box:
    def __init__(self, name):
        self.name, self.login = name, []

    def fresh(self):
        self.login = []
        sh('docker', 'rm', '-f', self.name)
        sh('docker', 'run', '-d', '--name', self.name, *LICENCE_ARGS, IMAGE, '--telemetry-enabled=false', timeout=600)
        for _ in range(180):
            r = sh('docker', 'exec', '-i', self.name, 'mgconsole', inp='RETURN 1;\n')
            if r.returncode == 0 and 'Failed' not in r.stdout + r.stderr:
                return
            time.sleep(0.5)
        logs = sh('docker', 'logs', '--tail', '3', self.name)
        raise RuntimeError('Memgraph did not start: ' + (logs.stdout + logs.stderr).strip()[-200:])

    def q(self, stmt, retried=False):
        try:
            r = sh('docker', 'exec', '-i', self.name, 'mgconsole', *self.login, inp=stmt + ';\n', timeout=a.timeout)
        except subprocess.TimeoutExpired:
            self.fresh()  # a runaway query would slow every later example on the page
            return 'timeout', ''
        out = r.stdout + r.stderr
        if 'Authentication failure' in out and not retried:
            self.fresh()
            return self.q(stmt, retried=True)
        if r.returncode == 0 and 'Failed query' not in out and 'exception' not in out.lower():
            m = CREATE_USER.search(stmt)
            if m and not self.login:
                # The first user turns on authentication; carry on as that user so later examples
                # still see the users and roles the page made.
                self.login = ['--username', m.group(1), '--password', m.group(2) or '']
            return 'ok', ''
        msg = next((l.split('exception:', 1)[1].strip() for l in out.splitlines() if 'exception:' in l), out.strip()[-200:])
        return classify(msg), msg[:300]

    def csv(self, query):
        rows = list(csv.reader(sh('docker', 'exec', '-i', self.name, 'mgconsole', '--output-format=csv', inp=query + '\n').stdout.splitlines()))
        return [[c.strip('"') for c in r] for r in rows[1:]]

    def stop(self):
        sh('docker', 'rm', '-f', self.name)


# ---------------------------------------------------------------- rules shared by examples and names

PLACEHOLDER_MODULES = {'module', 'my_module', 'query_module', 'query_module_name'}
TUTORIAL_PAGES = ('custom-query-modules', 'memgraph-lab/features/query-modules')


def module_page(mod):
    return PAGES / 'advanced-algorithms' / 'available-algorithms' / f'{mod}.mdx'


def is_enterprise_module(mod):
    page = module_page(mod)
    return page.exists() and bool(re.search(r'^#\s.*\(Enterprise\)', page.read_text(errors='replace'), re.M))


def says_licence(rel):
    return bool(LICENCE.search((PAGES / rel).read_text(errors='replace')))


def expected_missing(name, rel):
    """Why a name is missing from the image for a reason that isn't a docs bug, or None."""
    mod = name.split('.')[0]
    if mod in PLACEHOLDER_MODULES or rel.startswith(TUTORIAL_PAGES):
        return 'a placeholder or a module the tutorial builds'
    if mod in ('apoc', 'db') and 'neo4j' in rel:
        return 'runs in Neo4j'
    if mod == 'cugraph':
        return 'needs the GPU image'
    if not LICENSED and is_enterprise_module(mod) and says_licence(rel):
        return 'an Enterprise module, and the page says so'
    return None


def own_names(rel):
    """Procedures and functions the page defines in its own query module."""
    text = (PAGES / rel).read_text(errors='replace')
    return set(re.findall(r'(?:def|fn|void)\s+(\w+)\s*\(', text)) if re.search(r'@mgp\.|mgp::|mgp_|rsmgp', text) else set()


CALL = re.compile(r'\bCALL\s+([A-Za-z_]\w*(?:\.\w+)+)\s*\(', re.I)
FUNC = re.compile(r'(?<![\w.$])([A-Za-z_]\w*(?:\.\w+)+)\s*\(')


def names_in(stmt):
    code = re.sub(r"'[^'\n]*'|\"[^\"\n]*\"", "''", stmt)  # names inside strings are data
    procs = set(CALL.findall(code))
    funcs = set(FUNC.findall(CALL.sub('CALL x(', code))) - procs
    return procs, funcs


# ---------------------------------------------------------------- run

def check_page(box, rel):
    box.fresh()
    own, results = own_names(rel), []
    for first, last, meta, code in blocks(rel):
        for stmt in statements(code):
            if MARKS.search(meta):
                kind, msg = 'marked', ''
            elif LICENSED and SETS_LICENCE.search(stmt):
                kind, msg = 'skipped_licence', ''
            elif all(SQL_COMMENT.match(l) or not l.strip() for l in stmt.splitlines()):
                kind, msg = 'comment_style', ''
            elif OUTPUT.search(stmt) or OTHER_LANGUAGE.match(stmt):
                kind, msg = 'not_cypher', ''
            elif PLACEHOLDER.search(stmt):
                kind, msg = 'placeholder', ''
            elif PARAM.search(stmt):
                kind, msg = 'params', ''
            else:
                kind, msg = box.q(stmt)
                if kind in ('syntax', 'bad_character') and SQL_COMMENT.search(stmt):
                    # Is the query fine apart from the comments?
                    k2, m2 = box.q(re.sub(r';\s*--.*$', '', '\n'.join(l for l in stmt.splitlines() if not re.match(r'^\s*--', l)), flags=re.M))
                    kind, msg = ('comment_style', '') if k2 not in ('syntax', 'bad_character') else (k2, m2)
                elif kind in ('syntax', 'bad_character') and (TEMPLATE.search(stmt) or not KEYWORD.match(stmt)):
                    kind = 'template'
                name = re.search(r"named '([\w.]+)'|Function '([\w.]+)'", msg)
                name = name and (name.group(1) or name.group(2))
                if kind in ('no_procedure', 'no_function') and name:
                    if name.split('.')[-1] in own:
                        kind = 'custom_module'
                    elif is_enterprise_module(name.split('.')[0]) and not says_licence(rel):
                        kind, msg = 'enterprise_unsaid', name
                    elif expected_missing(name, rel):
                        kind, msg = 'expected_missing', expected_missing(name, rel)
            results.append({'page': rel, 'first': first, 'last': last, 'stmt': scrub(stmt), 'kind': kind, 'msg': scrub(msg), 'marked': bool(MARKS.search(meta))})
    return results


boxes = [Box(f'docs-examples-{os.getpid()}-{i}') for i in range(max(1, min(a.workers, len(run_pages))))]
free, lock, results = list(boxes), threading.Lock(), []


def work(rel):
    with lock:
        box = free.pop()
    try:
        return check_page(box, rel)
    except Exception as e:  # one broken page shouldn't stop the run
        return [{'page': rel, 'first': 1, 'last': 1, 'stmt': '', 'kind': 'error', 'msg': scrub(f'checker error: {e}')[:300], 'marked': False}]
    finally:
        with lock:
            free.append(box)


try:
    with cf.ThreadPoolExecutor(len(boxes)) as ex:
        for n, res in enumerate(ex.map(work, run_pages), 1):
            results += res
            c = Counter(r['kind'] for r in res)
            print(f'{n:4}/{len(run_pages)} {res[0]["page"] if res else "":70} {len(res):4} statements, {c["ok"]} ran', flush=True)

    # Names the product has, from one container.
    names_box = boxes[0]
    names_box.fresh()
    procs = {r[0] for r in names_box.csv('CALL mg.procedures() YIELD name RETURN name;')}
    funcs = {r[0] for r in names_box.csv('CALL mg.functions() YIELD name RETURN name;')}
    flags = {r[0] for r in names_box.csv('SHOW CONFIG;')}
    help_out = sh('docker', 'run', '--rm', IMAGE, '--help')
    flags |= {f.replace('-', '_') for f in re.findall(r'^\s+--([a-z][a-z0-9_-]*) \(', help_out.stdout + help_out.stderr, re.M)}

    def exists(name, call):
        # Aliases (migrate.*) and built-in namespaced functions (point.distance) aren't listed; ask the parser.
        out = names_box.q(f'CALL {name}()' if call else f'RETURN {name}()')[1]
        return not ('there is no procedure named' in out.lower() or "doesn't exist" in out.lower())

    exist_cache = {}
    names = []
    for r in results:
        if r['marked'] or r['kind'] in ('ok', 'no_procedure', 'no_function', 'custom_module', 'expected_missing', 'comment_style', 'not_cypher', 'enterprise_unsaid'):
            continue
        # Statements that didn't run (placeholders, parameters, errors on data): are their names real?
        own = own_names(r['page'])
        p, f = names_in(r['stmt'])
        for name, call in [(n, True) for n in p] + [(n, False) for n in f - procs]:
            if name.split('.')[-1] in own or expected_missing(name, r['page']) or name in (procs if call else funcs):
                continue
            if name not in exist_cache:
                exist_cache[name] = exists(name, call)
            if not exist_cache[name]:
                names.append({**r, 'kind': 'no_procedure' if call else 'no_function', 'msg': name})
    # An Enterprise procedure on a page that never says it needs a licence (when the run had a licence
    # or the statement didn't run; otherwise the run already reported it).
    for r in results:
        if r['marked'] or r['kind'] == 'enterprise_unsaid':
            continue
        for name in names_in(r['stmt'])[0]:
            if is_enterprise_module(name.split('.')[0]) and not says_licence(r['page']):
                names.append({**r, 'kind': 'enterprise_unsaid', 'msg': name})
    flag_problems = []
    if check_flags:
        lines = (PAGES / CONFIG_PAGE).read_text(errors='replace').splitlines()
        changed = targets[CONFIG_PAGE]
        for i, line in enumerate(lines, 1):
            m = re.match(r'^\|\s*`--([a-z][a-z0-9_\-]+)', line)
            if not m:
                continue
            f = m.group(1).replace('-', '_')
            if f not in flags and f.removeprefix('no') not in flags and f not in {'help', 'help_xml', 'helpfull', 'version', 'flagfile'}:
                flag_problems.append({'page': CONFIG_PAGE, 'first': i, 'last': i, 'stmt': '', 'kind': 'no_flag',
                                      'msg': f'--{m.group(1)}', 'marked': False, 'changed': changed is None or i in changed})
finally:
    for b in boxes:
        b.stop()


# ---------------------------------------------------------------- report

def in_change(r):
    lines = targets.get(r['page'])
    return lines is None or any(n in lines for n in range(r['first'], r['last'] + 1))


problems = [r for r in results if r['kind'] in (*HIGH, 'enterprise_unsaid') and not r['marked']] + names
for r in problems:
    r['changed'] = in_change(r)
problems += flag_problems
problems.sort(key=lambda r: (r['page'], r['first']))
failing = [r for r in problems if r['changed']]
others = [r for r in problems if not r['changed']]

summary = ['## Examples and names', '',
           f'Ran on `{IMAGE}`{" with an Enterprise licence" if LICENSED else ""}. '
           f'{len(run_pages)} pages, {len(results)} statements, {sum(r["kind"] == "ok" for r in results)} ran without errors.', '']


def line_for(r):
    stmt = r['stmt'].replace('\n', ' ')
    return f"pages/{r['page']}:{r['first']}: {message(r)}" + (f"\n    {stmt[:200]}" if stmt else '')


def message(r):
    return EXPLAIN.get(r['kind'], r['kind']) + (f": {r['msg']}" if r['msg'] else '')


for title, rs, level in (('In the blocks this change touches', failing, 'error'),
                         ('Elsewhere on the changed pages (not failing)', others, 'warning')):
    if not rs:
        continue
    print(f'\n{title}:')
    summary += [f'### {title} ({len(rs)})', '']
    for r in rs:
        print(scrub(line_for(r)))
        msg = message(r)
        summary.append(f"- `pages/{r['page']}` line {r['first']}: {msg}")
        if GH:
            msg = scrub(msg).replace('%', '%25').replace('\r', '').replace('\n', '%0A')
            print(f"::{level} file=pages/{r['page']},line={r['first']},endLine={r['last']}::{msg}")
    summary.append('')

if not problems:
    summary.append('No problems.')
summary += ['Blocks that are not meant to run can be marked: ```cypher template, invalid, neo4j or output. See AGENTS.md.']
if os.environ.get('GITHUB_STEP_SUMMARY'):
    with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as f:
        f.write(scrub('\n'.join(summary)) + '\n')

print(f'\n{len(failing)} problem(s) in changed blocks, {len(others)} elsewhere on the changed pages.')
sys.exit(1 if failing else 0)
