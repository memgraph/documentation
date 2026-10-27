"""Generate the AI Toolkit packages diagram (light and dark SVG)."""
import re
import sys

OUT = sys.argv[1]

MONO = "'Ubuntu Mono', Consolas, monospace"

# Every package in the toolkit, with what it's for. Listed only, no dependencies.
PACKAGES = [
    ('Context Graph', False, 'AI memory for coding agents'),
    ('unstructured2graph', True, 'Documents to a graph'),
    ('structured2graph', True, 'SQL databases to a graph'),
    ('hygm', True, 'Graph schema and validation'),
    ('mcp-memgraph', True, 'MCP server for Memgraph'),
    ('langchain-memgraph', True, 'LangChain integration'),
    ('lightrag-memgraph', True, 'LightRAG graph storage'),
    ('memgraph-toolbox', True, 'Python tools for Memgraph'),
]

cols = 4
card_w = 220
card_h = 76
gap = 16
pad = 24
top = 76
rows = (len(PACKAGES) + cols - 1) // cols
frame_w = cols * card_w + (cols - 1) * gap + 2 * pad
frame_h = top + rows * card_h + (rows - 1) * gap + pad
W = frame_w + 48
H = frame_h + 48


def card(x, y, name, mono, purpose):
    font = f' font-family="{MONO}" font-size="16"' if mono else ' font-size="16" font-weight="600"'
    return (f'  <rect x="{x}" y="{y}" width="{card_w}" height="{card_h}" rx="6" fill="#FFFFFF" stroke="#E6E6E6"/>\n'
            f'  <text x="{x + 16}" y="{y + 32}"{font} fill="#231F20">{name}</text>\n'
            f'  <text x="{x + 16}" y="{y + 56}" font-size="13" fill="#646265">{purpose}</text>\n')


s = []
a = s.append
a(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="\'Inter Tight\', Inter, Arial, sans-serif" role="img" aria-labelledby="title desc">\n')
a('  <title id="title">Memgraph AI Toolkit packages</title>\n')
desc = '; '.join(f'{n} ({p})' for n, _, p in PACKAGES)
a(f'  <desc id="desc">The packages in the Memgraph AI Toolkit and what each is for. {desc}.</desc>\n')
a(f'  <rect x="0" y="0" width="{W}" height="{H}" rx="8" fill="#F9F9F9"/>\n')
a(f'  <rect x="24" y="24" width="{frame_w}" height="{frame_h}" rx="8" fill="none" stroke="#BAB8BB" stroke-dasharray="6 4"/>\n')
a(f'  <text x="{24 + pad}" y="{24 + 42}" font-size="12" font-weight="600" letter-spacing="0.72" fill="#646265">MEMGRAPH AI TOOLKIT</text>\n')
for i, (name, mono, purpose) in enumerate(PACKAGES):
    x = 24 + pad + (i % cols) * (card_w + gap)
    y = 24 + top + (i // cols) * (card_h + gap)
    a(card(x, y, name, mono, purpose))
a('</svg>\n')
svg = ''.join(s)

open(f'{OUT}/ai-toolkit-packages.svg', 'w').write(svg)
DARK = {'#F9F9F9': '#1A1718', '#FFFFFF': '#231F20', '#E6E6E6': '#3E3A3C', '#BAB8BB': '#646265',
        '#231F20': '#F9F9F9', '#646265': '#BAB8BB'}
open(f'{OUT}/ai-toolkit-packages-dark.svg', 'w').write(
    re.sub(r'#[0-9A-F]{6}', lambda m: DARK.get(m.group(0), m.group(0)), svg))
print('size', W, H)
