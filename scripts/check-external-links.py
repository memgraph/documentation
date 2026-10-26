#!/usr/bin/env python3
"""Do the docs' links to other sites still work?

    python3 scripts/check-external-links.py
    python3 scripts/check-external-links.py --out results/

Reads the links from this checkout (pages, components and theme.config.tsx, not
code blocks) and requests each one. Links within the docs are checked on every
PR by check-docs.mjs; this covers what that can't: other sites. Links to GitHub
PRs and issues are checked once per repository. It takes a few minutes and
runs by hand ("Run workflow" in the Actions tab, check:
external-links), for example once a quarter.

Each link ends up as one of:
  gone           404 or 410: the page is gone, fix or remove the link (fails the check)
  blocks checks  401, 403 or 429: the site refuses automated requests, check by hand
  no answer      no response, a redirect loop or a 5xx, often temporary: check by hand

Every request's user agent ends in "memgraph-docs-checks". Exits 1 if any link is gone.
"""
import argparse, concurrent.futures as cf, json, os, re, sys, time, urllib.error, urllib.request
from collections import defaultdict
from pathlib import Path
from urllib.parse import urljoin, urlparse

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('--out', help='also write external-links.json and external-links.md to this folder')
a = ap.parse_args()

ROOT = Path(__file__).resolve().parent.parent
UA = 'Mozilla/5.0 (compatible) memgraph-docs-checks'
LINK = re.compile(r'\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)|\bhref=\{?["\'`]([^"\'`]+)["\'`]\}?')
DOCS_URL = re.compile(r'^https?://(www\.)?memgraph\.com/docs(/|$|#)')
SKIP_HOSTS = {'localhost', '127.0.0.1', '0.0.0.0', 'example.com', 'www.example.com'}


def prose_lines(text):
    """The lines outside fenced code blocks, with inline code removed (same rules as check-docs.mjs)."""
    fence = None
    for i, line in enumerate(text.split('\n'), 1):
        if fence is None:
            m = re.match(r'^\s*(`{3,}(?=[^`]*$)|~{3,})', line)
            if m:
                fence = m.group(1)
                continue
            yield i, re.sub(r'`[^`]*`', '', line)
        else:
            m = re.match(r'^\s*(`{3,}|~{3,})\s*$', line)
            if m and m.group(1)[0] == fence[0] and len(m.group(1)) >= len(fence):
                fence = None


# links ---------------------------------------------------------------------
uses = defaultdict(set)   # url -> file:line that link to it
files = [p for p in (ROOT / 'pages').rglob('*') if p.suffix in ('.md', '.mdx')]
files += [p for p in (ROOT / 'components').rglob('*') if p.suffix in ('.js', '.jsx', '.ts', '.tsx')]
files += [ROOT / 'theme.config.tsx']
for f in files:
    if not f.exists():
        continue
    text = f.read_text(encoding='utf-8').replace('\r\n', '\n')
    lines = prose_lines(text) if f.suffix in ('.md', '.mdx') else enumerate(text.split('\n'), 1)
    for i, line in lines:
        for m in LINK.finditer(line):
            url = (m.group(1) or m.group(2)).split('#')[0]
            host = urlparse(url).hostname
            if urlparse(url).scheme in ('http', 'https') and host and host not in SKIP_HOSTS and not DOCS_URL.match(url):
                uses[url].add(f'{f.relative_to(ROOT)}:{i}')


# requests ------------------------------------------------------------------
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kw):
        return None


def status(url, accept='text/html,*/*'):
    """HTTP status after following redirects; 0 for no answer, 'loop' after ten redirects."""
    for _ in range(10):
        req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': accept})
        try:
            with urllib.request.build_opener(NoRedirect).open(req, timeout=30) as r:
                return r.status
        except urllib.error.HTTPError as e:
            if e.code in (301, 302, 303, 307, 308) and e.headers.get('Location'):
                url = urljoin(url, e.headers['Location'])
                continue
            return e.code
        except Exception:
            return 0
    return 'loop'


def with_retry(url):
    s = status(url)
    if s == 0:   # a time-out is usually the network, not the link: try once more
        time.sleep(2)
        s = status(url)
    return s


targets = sorted(uses)
# PRs and issues aren't deleted, so a link to one only breaks if its repository is gone or
# private: check each repository once instead of about 1,300 release-note links.
ISSUE = re.compile(r'^(https://github\.com/[^/]+/[^/]+)/(pull|issues)/\d+/?$')
repo_of = {t: ISSUE.match(t).group(1) for t in targets if ISSUE.match(t)}
github = sorted({t for t in targets if urlparse(t).hostname == 'github.com' and t not in repo_of} | set(repo_of.values()))
crates = [t for t in targets if urlparse(t).hostname == 'crates.io' and '/crates/' in t]
rest = [t for t in targets if urlparse(t).hostname != 'github.com' and t not in crates]
print(f'{len(targets)} external links in {len(files)} files; {len(rest) + len(github) + len(crates)} requests', file=sys.stderr)
got = {}
with cf.ThreadPoolExecutor(16) as ex:
    got.update(zip(rest, ex.map(with_retry, rest)))
with cf.ThreadPoolExecutor(4) as ex:   # GitHub throttles: go slowly
    got.update(zip(github, ex.map(with_retry, github)))
for t in crates:   # crates.io answers 404 to plain page requests, so ask its API
    name = t.rstrip('/').split('/crates/')[1].split('/')[0]
    got[t] = status(f'https://crates.io/api/v1/crates/{name}', accept='application/json')
    time.sleep(1)
for t, repo in repo_of.items():
    got[t] = got[repo]

groups = {'gone': [], 'blocks checks': [], 'no answer': []}
for t, s in sorted(got.items()):
    row = {'url': t, 'status': s, 'from': sorted(uses[t])}
    if s in (404, 410):
        groups['gone'].append(row)
    elif s in (401, 403, 429):
        groups['blocks checks'].append(row)
    elif s in (0, 'loop') or (isinstance(s, int) and s >= 500):
        groups['no answer'].append(row)


# output --------------------------------------------------------------------
L = ['# External links\n', f'{len(targets)} links to other sites: '
     + ', '.join(f'{len(v)} {k}' for k, v in groups.items()) + '.\n']
for k, rows in groups.items():
    if rows:
        L += [f'## {k.capitalize()}\n', '| Status | Link | Linked from |', '|---|---|---|']
        L += [f"| {r['status']} | {r['url']} | {', '.join(r['from'][:5])}{' …' if len(r['from']) > 5 else ''} |" for r in rows]
        L.append('')
report = '\n'.join(L) + '\n'
print(report)
if a.out:
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / 'external-links.json').write_text(json.dumps({'links': len(targets), **groups}, indent=1))
    (out / 'external-links.md').write_text(report)
if os.environ.get('GITHUB_STEP_SUMMARY'):
    with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as f:
        f.write(report)
sys.exit(1 if groups['gone'] else 0)
