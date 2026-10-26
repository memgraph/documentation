#!/usr/bin/env python3
"""Can an AI agent reach and read the published docs?

    python3 scripts/check-agent-access.py
    python3 scripts/check-agent-access.py --site https://memgraph.com --sample 20 --out results/

Checks the live site, not this checkout, so it runs by hand ("Run workflow" in
the Actions tab, check: agent-access) after a deploy, not on pull requests.
Each check is pass, warn or fail:

  llms.txt     the root and docs indexes load, and every page they link to loads as markdown
  robots       AI crawlers may fetch /docs/; content signals are declared; a sitemap is listed
  bot access   docs pages answer AI user agents the same as a browser
  pages        sampled pages: markdown alternate link, content present without JavaScript,
               HTML weight, and a pointer to llms.txt in the page body (what an agent reads)
  mcp          the docs MCP endpoint answers, without a cross-origin redirect
               (some clients, such as Codex, reject those)

Every request's user agent ends in "memgraph-docs-checks", so these requests can
be told apart from real visitors. Exits 1 if anything fails.
"""
import argparse, concurrent.futures as cf, datetime, json, os, re, sys, urllib.error, urllib.request, urllib.robotparser
from pathlib import Path
from urllib.parse import urlparse

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('--site', default='https://memgraph.com')
ap.add_argument('--mcp', default='https://mcp-docs.memgraph.com')
ap.add_argument('--sample', type=int, default=12, help='pages to inspect in detail')
ap.add_argument('--out', help='also write access.json and access.md to this folder')
a = ap.parse_args()

UA_TAG = 'memgraph-docs-checks'
BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
AI_AGENTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'CCBot']
checks = []


def record(area, name, status, detail=''):
    checks.append({'area': area, 'check': name, 'status': status, 'detail': detail})


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kw):
        return None


def fetch(url, ua=BROWSER, follow=True, method='GET'):
    """(status, final url, headers, body) without raising on HTTP errors."""
    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(url, method=method, headers={'User-Agent': f'{ua} {UA_TAG}', 'Accept': '*/*'})
    try:
        with opener.open(req, timeout=30) as r:
            return r.status, r.geturl(), dict(r.headers), r.read().decode('utf-8', 'replace') if method == 'GET' else ''
    except urllib.error.HTTPError as e:
        return e.code, url, dict(e.headers or {}), ''
    except Exception as e:
        return 0, url, {}, str(e)


# llms.txt ------------------------------------------------------------------
docs_index = ''
for path in ('/llms.txt', '/docs/llms.txt'):
    st, _, h, body = fetch(a.site + path)
    ok = st == 200 and not body.lstrip().lower().startswith('<!doctype')
    record('llms.txt', path, 'pass' if ok else 'fail', f'HTTP {st}, {len(body) // 1024} KB, {h.get("Content-Type", "?")}')
    if path == '/docs/llms.txt' and ok:
        docs_index = body
    if path == '/llms.txt' and ok:
        for term, what in (('mcp', 'the MCP servers'), ('/docs/llms.txt', 'the docs index')):
            record('llms.txt', f'root llms.txt links {what}', 'pass' if term in body.lower() else 'warn')

links = sorted(set(re.findall(r'\]\((https?://[^)\s]+)\)', docs_index)))


def check_link(u):
    st, final, h, body = fetch(u)
    if st == 0:  # a dropped connection, not a missing page: try once more
        st, final, h, body = fetch(u)
    md = st == 200 and not body.lstrip().lower().startswith(('<!doctype', '<html'))
    return u, st, md


bad = []
with cf.ThreadPoolExecutor(max_workers=16) as ex:
    for u, st, md in ex.map(check_link, links):
        if st != 200 or not md:
            bad.append(f'{u} (HTTP {st}{", HTML not markdown" if st == 200 else ""})')
record('llms.txt', f'all {len(links)} links in /docs/llms.txt load as markdown', 'pass' if not bad else 'fail',
       '; '.join(bad[:15]) + (f' … and {len(bad) - 15} more' if len(bad) > 15 else ''))

# robots --------------------------------------------------------------------
st, _, _, robots = fetch(a.site + '/robots.txt')
rp = urllib.robotparser.RobotFileParser()
rp.parse(robots.splitlines())
blocked = [ua for ua in AI_AGENTS if not rp.can_fetch(ua, a.site + '/docs/')]
record('robots', 'AI crawlers may fetch /docs/', 'pass' if not blocked else 'fail', ('blocked: ' + ', '.join(blocked)) if blocked else ', '.join(AI_AGENTS))
record('robots', 'content signals declared (Content-Signal:)', 'pass' if re.search(r'^content-signal:', robots, re.I | re.M) else 'warn',
       'none: search / ai-input / ai-train preferences are not stated')
sitemaps = re.findall(r'^sitemap:\s*(\S+)', robots, re.I | re.M)
if sitemaps:
    record('robots', 'sitemap listed and loads', 'pass' if all(fetch(s, method='GET')[0] == 200 for s in sitemaps) else 'fail', ', '.join(sitemaps))
else:
    record('robots', 'sitemap listed', 'warn', 'no Sitemap: line in robots.txt')

# pages ---------------------------------------------------------------------
md_links = [u for u in links if u.endswith('.md')]
step = max(1, len(md_links) // a.sample) if md_links else 1
sample = [u[:-3] for u in md_links[::step][:a.sample]] or [a.site + '/docs']
page_rows = []
for url in sample:
    st, _, _, html = fetch(url)
    if st != 200:
        record('pages', url, 'fail', f'HTTP {st}')
        continue
    _, _, _, md = fetch(url + '.md')
    heading = next((re.sub(r'<[^>]*>.*?</[^>]+>|<[^>]+>', '', l).lstrip('# ').strip() for l in md.splitlines() if l.startswith('# ')), '')
    head, _, body = html.partition('</head>')
    text = re.sub(r'<script.*?</script>|<style.*?</style>', '', body, flags=re.S)
    page_rows.append({
        'url': url, 'kb': len(html) // 1024,
        'md_alternate': 'type="text/markdown"' in head,
        'content_without_js': bool(heading) and heading.lower()[:40] in re.sub(r'<[^>]+>', ' ', text).lower(),
        'llms_pointer_in_body': 'llms.txt' in text,
    })
    # Same page for AI user agents as for a browser?
    for ua in ('ClaudeBot', 'GPTBot'):
        bst, _, _, bhtml = fetch(url, ua=ua)
        if bst != 200 or abs(len(bhtml) - len(html)) > 0.2 * len(html):
            record('bot access', f'{ua} on {urlparse(url).path}', 'fail', f'HTTP {bst}, {len(bhtml) // 1024} KB vs {len(html) // 1024} KB for a browser')

n = len(page_rows)
if n:
    record('bot access', f'AI user agents get the same pages ({n} sampled)', 'pass' if not any(c['area'] == 'bot access' and c['status'] == 'fail' for c in checks) else 'fail')
    for key, label, bad_status in (('md_alternate', 'markdown alternate link in <head>', 'warn'),
                                   ('content_without_js', 'page content present without JavaScript', 'fail'),
                                   ('llms_pointer_in_body', 'pointer to llms.txt in the page body', 'warn')):
        yes = sum(r[key] for r in page_rows)
        record('pages', f'{label}: {yes}/{n}', 'pass' if yes == n else bad_status,
               ', '.join(urlparse(r['url']).path for r in page_rows if not r[key])[:300])
    kbs = sorted(r['kb'] for r in page_rows)
    record('pages', f'HTML weight: median {kbs[n // 2]} KB, max {kbs[-1]} KB', 'pass' if kbs[n // 2] < 200 else 'warn',
           'agents that fetch HTML pay for all of it; the .md version is the light path')

# mcp -----------------------------------------------------------------------
st, _, h, _ = fetch(a.mcp, follow=False)
loc = h.get('Location') or h.get('location') or ''
if st in (301, 302, 303, 307, 308):
    cross = urlparse(loc).netloc and urlparse(loc).netloc != urlparse(a.mcp).netloc
    record('mcp', 'docs MCP endpoint answers without a cross-origin redirect', 'warn' if cross else 'pass',
           f'HTTP {st} → {loc}' + (' (clients that reject cross-origin redirects, such as Codex, cannot connect)' if cross else ''))
else:
    record('mcp', 'docs MCP endpoint answers', 'pass' if st and st < 500 else 'fail', f'HTTP {st}')

# output --------------------------------------------------------------------
icon = {'pass': '✅', 'warn': '⚠️', 'fail': '❌'}
L = [f'# Agent access: {a.site}\n', f'Checked {datetime.datetime.now().isoformat(timespec="minutes")}.\n',
     '| | Area | Check | Detail |', '|---|---|---|---|']
L += [f"| {icon[c['status']]} | {c['area']} | {c['check']} | {c['detail'][:300]} |" for c in checks]
report = '\n'.join(L) + '\n'
print(report)
if a.out:
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / 'access.json').write_text(json.dumps({'site': a.site, 'checks': checks, 'pages': page_rows}, indent=1))
    (out / 'access.md').write_text(report)
if os.environ.get('GITHUB_STEP_SUMMARY'):
    with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as f:
        f.write(report)
sys.exit(1 if any(c['status'] == 'fail' for c in checks) else 0)
