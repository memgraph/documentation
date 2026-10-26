"""Generate the AI Toolkit packages diagram (light and dark SVG)."""
import re
import sys

OUT = sys.argv[1]

MONO = "'Ubuntu Mono', Consolas, monospace"

# layout: rows inside the toolkit frame, each package box is built on the ones below it
row_h = 40
gap = 8
r1 = 88
r2 = r1 + row_h + gap
r3 = r2 + row_h + gap
r4 = r3 + row_h + gap
frame_bottom = r4 + row_h + 20
mg_y = frame_bottom + 24
mg_h = 56
H = mg_y + mg_h + 24


def pkg(x, y, w, name, mono=True, stroke='#E6E6E6', bold=False):
    font = f' font-family="{MONO}"' if mono else ''
    size = 15 if bold or not mono else 14
    weight = ' font-weight="700"' if bold else ('' if mono else ' font-weight="600"')
    return (f'  <rect x="{x}" y="{y}" width="{w}" height="{row_h}" rx="4" fill="#FFFFFF" stroke="{stroke}"/>\n'
            f'  <text x="{x + w // 2}" y="{y + 25}" font-size="{size}"{font}{weight} fill="#231F20" text-anchor="middle">{name}</text>\n')


def external(x, y, w, name):
    return (f'  <rect x="{x}" y="{y}" width="{w}" height="{row_h}" rx="4" fill="#FFFFFF" stroke="#BAB8BB" stroke-dasharray="4 3"/>\n'
            f'  <text x="{x + w // 2}" y="{y + 25}" font-size="15" font-weight="600" fill="#646265" text-anchor="middle">{name}</text>\n')


s = []
a = s.append
a(f'<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="{H}" viewBox="0 0 1000 {H}" font-family="\'Inter Tight\', Inter, Arial, sans-serif" role="img" aria-labelledby="title desc">\n')
a('  <title id="title">Memgraph AI Toolkit packages and third-party integrations</title>\n')
a('  <desc id="desc">The Memgraph AI Toolkit packages stacked on Memgraph, each built on the ones below it. Context Graph is built on unstructured2graph, which is built on hygm and lightrag-memgraph. lightrag-memgraph, mcp-memgraph, langchain-memgraph and SQL2Graph are built on memgraph-toolbox, which connects to Memgraph. hygm defines a graph schema and does not connect to Memgraph. LlamaIndex, Cognee and Mem0 are third-party integrations that connect to Memgraph directly.</desc>\n')
a(f'  <rect x="0" y="0" width="1000" height="{H}" rx="8" fill="#F9F9F9"/>\n\n')

# toolkit
a(f'  <rect x="24" y="40" width="684" height="{frame_bottom - 40}" rx="8" fill="none" stroke="#BAB8BB" stroke-dasharray="6 4"/>\n')
a('  <text x="44" y="66" font-size="12" font-weight="600" letter-spacing="0.72" fill="#646265">MEMGRAPH AI TOOLKIT</text>\n')
a('  <text x="688" y="66" font-size="13" fill="#857F87" text-anchor="end">Each package is built on the ones below it</text>\n')
a(pkg(44, r1, 232, 'Context Graph', mono=False))
a(pkg(44, r2, 232, 'unstructured2graph'))
a(pkg(44, r3, 84, 'hygm'))
a(pkg(136, r3, 140, 'lightrag-memgraph'))
a(pkg(284, r3, 116, 'mcp-memgraph'))
a(pkg(408, r3, 148, 'langchain-memgraph'))
a(pkg(564, r3, 124, 'SQL2Graph', mono=False))
a(pkg(136, r4, 552, 'memgraph-toolbox', stroke='#BAB8BB', bold=True))
a('\n')

# third-party integrations
a(f'  <rect x="724" y="40" width="252" height="{frame_bottom - 40}" rx="8" fill="none" stroke="#BAB8BB" stroke-dasharray="6 4"/>\n')
a('  <text x="744" y="66" font-size="12" font-weight="600" letter-spacing="0.72" fill="#646265">THIRD-PARTY INTEGRATIONS</text>\n')
a(f'  <text x="744" y="{r1 + 25}" font-size="13" fill="#857F87">Connect to Memgraph directly</text>\n')
for y, name in ((r2, 'LlamaIndex'), (r3, 'Cognee'), (r4, 'Mem0 1.x')):
    a(external(744, y, 212, name))
a('\n')

# Memgraph
a(f'  <rect x="24" y="{mg_y}" width="952" height="{mg_h}" rx="8" fill="#FFFFFF" stroke="#BAB8BB"/>\n')
a(f'  <rect x="24" y="{mg_y}" width="952" height="4" rx="2" fill="#FB6E00"/>\n')
a(f'  <text x="500" y="{mg_y + 35}" font-size="20" font-weight="700" fill="#231F20" text-anchor="middle">Memgraph</text>\n')
a('</svg>\n')
svg = ''.join(s)

open(f'{OUT}/ai-toolkit-packages.svg', 'w').write(svg)
DARK = {'#F9F9F9': '#1A1718', '#FFFFFF': '#231F20', '#E6E6E6': '#3E3A3C', '#BAB8BB': '#646265',
        '#231F20': '#F9F9F9', '#646265': '#BAB8BB', '#857F87': '#9A949C', '#FFF4EB': '#3A2414'}
open(f'{OUT}/ai-toolkit-packages-dark.svg', 'w').write(
    re.sub(r'#[0-9A-F]{6}', lambda m: DARK.get(m.group(0), m.group(0)), svg))
print('height', H)
