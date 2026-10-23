"""Generate the Context Graph flow diagram (light and dark SVG)."""
import re
import sys

OUT = sys.argv[1]
T = 12.0  # animation cycle, seconds
G = 88    # gap between main boxes
g = 40    # gap between reconciliation steps

MONO = "'Ubuntu Mono', Consolas, monospace"

# vertical layout
agent_y, agent_h = 96, 64
cap_y = agent_y + agent_h + G
cap_h = 244
mg_y = cap_y + cap_h + G
mg_h = 336
rec_y = mg_y + mg_h + G
onto_y = rec_y + 66
onto_h = 72
ext_y = onto_y + onto_h + g
ext_h = 44
sto_y = ext_y + ext_h + g
sto_h = 44
rec_h = sto_y + sto_h + 24 - rec_y
mach_bottom = rec_y + rec_h + 24
sl_y = onto_y + onto_h // 2 - 24
api_y = mach_bottom + 34
H = api_y + 48 + 24

gy = mg_y + 96  # graph: user row


def arrow(pid, d, extra=''):
    return f'  <path id="{pid}" d="{d}" fill="none" stroke="#231F20" stroke-width="1.5" marker-end="url(#arrow)"{extra}/>\n'


def hl_rect(cls, x, y, w, h, rx=4):
    return f'  <rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="none" stroke="#FB6E00" stroke-width="2.5" opacity="0"/>\n'


def hl_path(cls, d, marker=True):
    m = ' marker-end="url(#arrow-accent)"' if marker else ' stroke-linejoin="round"'
    w = 2 if marker else 2.5
    return f'  <path class="{cls}" d="{d}" fill="none" stroke="#FB6E00" stroke-width="{w}"{m} opacity="0"/>\n'


P = {
    'p1': f'M500,{agent_y + agent_h} V{cap_y - 2}',
    'p3': f'M500,{cap_y + cap_h} V{mg_y - 2}',
    'p4': f'M500,{mg_y + mg_h} V{rec_y - 2}',
    'p5': f'M500,{onto_y + onto_h} V{ext_y - 2}',
    'p6': f'M500,{ext_y + ext_h} V{sto_y - 2}',
    'p7': f'M330,{sto_y + sto_h // 2} H210 V{gy + 184} H248',
    'p8': f'M750,{mg_y + 80} H856 V{agent_y + agent_h + 2}',
    'p9': f'M760,{agent_y + agent_h // 2} H712',
}
onto_d = f'M330,{onto_y} H670 L618,{onto_y + onto_h} H382 Z'

s = []
a = s.append
a(f'<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="{H}" viewBox="0 0 1000 {H}" font-family="\'Inter Tight\', Inter, Arial, sans-serif" role="img" aria-labelledby="title desc">\n')
a('  <title id="title">How Context Graph records and recalls agent sessions</title>\n')
a('  <desc id="desc">During a session, the memgraph-context-graph hooks in the agent, a coding agent or an Agent SDK app, drop private text and redact secrets, and the actions-graph, skills-graph and sessions-graph connectors write the session to Memgraph as a graph of users, sessions, actions, skills and memories. The optional resources-graph connector records GitHub resources, and context-graph-spaces adds shared spaces on Memgraph Enterprise. The MCP server reads Memgraph and serves the recall and memory tools to the agent. After a session, reconciliation filters the text through the HyGM ontology, extracts entities and facts with GLiNER2 and stores them in Memgraph with their embeddings. Only optional ontology learning sends session text to an Anthropic or OpenAI API.</desc>\n')
a('STYLE')
a('''  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#231F20"/>
    </marker>
    <marker id="arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#857F87"/>
    </marker>
    <marker id="arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#FB6E00"/>
    </marker>
  </defs>

''')
a(f'  <rect x="0" y="0" width="1000" height="{H}" rx="8" fill="#F9F9F9"/>\n')
a(f'  <rect x="24" y="40" width="952" height="{mach_bottom - 40}" rx="8" fill="none" stroke="#BAB8BB" stroke-dasharray="6 4"/>\n')
a('  <text x="44" y="66" font-size="12" font-weight="600" letter-spacing="0.72" fill="#646265">YOUR MACHINE</text>\n\n')

# phase bands
def band(y1, y2, label, color):
    c = (y1 + y2) // 2
    fill = f' fill="{color}"' if color == '#FB6E00' else ''
    return (f'    <line x1="80" y1="{y1}" x2="80" y2="{y2}" stroke="{color}" stroke-width="2"/>\n'
            f'    <text x="64" y="{c}" transform="rotate(-90 64 {c})"{fill}>{label}</text>\n')
a('  <g font-size="12" font-weight="600" letter-spacing="0.72" fill="#857F87" text-anchor="middle">\n')
a(band(agent_y, cap_y + cap_h, 'DURING A SESSION', '#BAB8BB'))
a(band(mg_y, mg_y + mg_h, 'IN MEMGRAPH', '#FB6E00'))
a(band(rec_y, rec_y + rec_h, 'AFTER A SESSION', '#BAB8BB'))
a('  </g>\n\n')

# coding agent + MCP server
a(f'  <rect x="290" y="{agent_y}" width="420" height="{agent_h}" rx="4" fill="#FFFFFF" stroke="#E6E6E6"/>\n')
a(f'  <text x="500" y="{agent_y + 28}" font-size="18" font-weight="600" fill="#231F20" text-anchor="middle">Agent</text>\n')
a(f'  <text x="500" y="{agent_y + 50}" font-size="14" fill="#646265" text-anchor="middle">Claude Code, Codex, Cursor or an Agent SDK app</text>\n')
a(f'  <rect x="760" y="{agent_y}" width="192" height="{agent_h}" rx="4" fill="#FFFFFF" stroke="#E6E6E6"/>\n')
a(f'  <text x="856" y="{agent_y + 28}" font-size="18" font-weight="600" fill="#231F20" text-anchor="middle">MCP server</text>\n')
a(f'  <text x="856" y="{agent_y + 50}" font-size="14" fill="#646265" text-anchor="middle"><tspan font-family="{MONO}">recall</tspan> and <tspan font-family="{MONO}">memory</tspan> tools</text>\n')
a(arrow('p9', P['p9']))
a(arrow('p1', P['p1']))
a('\n')

# capture
y = cap_y
a(f'  <rect x="290" y="{y}" width="420" height="{cap_h}" rx="4" fill="#FFFFFF" stroke="#E6E6E6"/>\n')
a(f'  <text x="500" y="{y + 28}" font-size="18" font-weight="600" fill="#231F20" text-anchor="middle">Capture</text>\n')
a(f'  <text x="500" y="{y + 50}" font-size="14" fill="#646265" text-anchor="middle">Hooks drop &lt;private&gt; text and redact secrets</text>\n')
a(f'  <rect x="306" y="{y + 66}" width="388" height="46" rx="4" fill="#F9F9F9" stroke="#BAB8BB"/>\n')
a(f'  <text x="500" y="{y + 86}" font-size="15" font-family="{MONO}" font-weight="700" fill="#231F20" text-anchor="middle">memgraph-context-graph</text>\n')
a(f'  <text x="500" y="{y + 104}" font-size="13" fill="#646265" text-anchor="middle">hooks, MCP server, SDK and setup</text>\n')
a(f'  <path d="M500,{y + 112} V{y + 126}" fill="none" stroke="#231F20" stroke-width="1.5" marker-end="url(#arrow)"/>\n')
a(f'  <g font-size="13" font-family="{MONO}" fill="#231F20" text-anchor="middle">\n')
for x, name in ((306, 'actions-graph'), (438, 'skills-graph'), (570, 'sessions-graph')):
    a(f'    <rect x="{x}" y="{y + 128}" width="124" height="40" rx="2" fill="#F9F9F9" stroke="#E6E6E6"/>\n')
    a(f'    <text x="{x + 62}" y="{y + 153}">{name}</text>\n')
a('  </g>\n')
a(f'  <rect x="306" y="{y + 176}" width="190" height="52" rx="2" fill="#F9F9F9" stroke="#BAB8BB" stroke-dasharray="4 3"/>\n')
a(f'  <text x="401" y="{y + 197}" font-size="13" font-family="{MONO}" fill="#646265" text-anchor="middle">resources-graph</text>\n')
a(f'  <text x="401" y="{y + 216}" font-size="12" fill="#857F87" text-anchor="middle">GitHub, off by default</text>\n')
a(f'  <rect x="504" y="{y + 176}" width="190" height="52" rx="2" fill="#F9F9F9" stroke="#E6E6E6"/>\n')
a(f'  <text x="599" y="{y + 197}" font-size="13" font-family="{MONO}" fill="#231F20" text-anchor="middle">context-graph-spaces</text>\n')
a(f'  <rect x="557" y="{y + 205}" width="84" height="17" rx="2" fill="#FFF4EB"/>\n')
a(f'  <text x="599" y="{y + 217}" font-size="11" font-weight="600" letter-spacing="0.66" fill="#FB6E00" text-anchor="middle">ENTERPRISE</text>\n\n')

a(arrow('p3', P['p3']))
a(f'  <text x="510" y="{cap_y + cap_h + G // 2 + 5}" font-size="14" fill="#646265">write</text>\n\n')

# Memgraph
y = mg_y
a(f'  <rect x="250" y="{y}" width="500" height="{mg_h}" rx="8" fill="#FFFFFF" stroke="#BAB8BB"/>\n')
a(f'  <rect x="250" y="{y}" width="500" height="4" rx="2" fill="#FB6E00"/>\n')
a(f'  <text x="500" y="{y + 36}" font-size="20" font-weight="700" fill="#231F20" text-anchor="middle">Memgraph</text>\n')


def gp(x, dy):
    return x, gy + dy


ux, uy = 500, gy
a('  <g font-size="13" fill="#646265" stroke-width="1.5">\n')
a(f'    <line x1="512" y1="{uy}" x2="572" y2="{uy}" stroke="#BAB8BB"/>\n')
for x1, y1, x2, y2 in ((491, 9, 447, 53), (509, 9, 553, 53), (440, 60, 400, 120), (440, 60, 460, 122),
                       (560, 60, 540, 122), (560, 60, 600, 120), (570, 61, 643, 71)):
    a(f'    <line x1="{x1}" y1="{gy + y1}" x2="{x2}" y2="{gy + y2}" stroke="#BAB8BB"/>\n')
a(f'    <circle cx="500" cy="{gy}" r="12" fill="#231F20"/>\n')
a(f'    <text x="480" y="{gy + 5}" text-anchor="end">User</text>\n')
a(f'    <circle cx="580" cy="{gy}" r="8" fill="#FFF4EB" stroke="#FB6E00"/>\n')
a(f'    <text x="596" y="{gy + 5}">Memory</text>\n')
for cx in (440, 560):
    a(f'    <circle cx="{cx}" cy="{gy + 60}" r="10" fill="#FFFFFF" stroke="#231F20"/>\n')
a(f'    <text x="422" y="{gy + 65}" text-anchor="end">Session</text>\n')
for cx, dy in ((400, 120), (460, 122), (540, 122), (600, 120)):
    a(f'    <circle cx="{cx}" cy="{gy + dy}" r="7" fill="#646265"/>\n')
a(f'    <text x="384" y="{gy + 125}" text-anchor="end">Action</text>\n')
a(f'    <circle cx="650" cy="{gy + 72}" r="7" fill="#FFFFFF" stroke="#646265"/>\n')
a(f'    <text x="664" y="{gy + 77}">Skill</text>\n')
a('    <g class="kg">\n')
a('      <g stroke="#BAB8BB" stroke-dasharray="3 3">\n')
for x1, y1, x2, y2 in ((400, 127, 418, 167), (460, 129, 478, 156), (600, 127, 588, 161)):
    a(f'        <line x1="{x1}" y1="{gy + y1}" x2="{x2}" y2="{gy + y2}"/>\n')
a('      </g>\n      <g stroke="#FB6E00" stroke-opacity="0.6">\n')
for x1, y1, x2, y2 in ((420, 176, 482, 164), (482, 164, 530, 198), (530, 198, 586, 170),
                       (420, 176, 472, 216), (472, 216, 530, 198)):
    a(f'        <line x1="{x1}" y1="{gy + y1}" x2="{x2}" y2="{gy + y2}"/>\n')
a('      </g>\n')
for cx, dy, r in ((420, 176, 9), (482, 164, 9), (530, 198, 9), (586, 170, 9), (472, 216, 7)):
    a(f'      <circle cx="{cx}" cy="{gy + dy}" r="{r}" fill="#FB6E00"/>\n')
a(f'      <text x="604" y="{gy + 203}">Knowledge graph</text>\n')
a('    </g>\n  </g>\n\n')

a(arrow('p8', P['p8']))
a(f'  <text x="866" y="{(agent_y + agent_h + mg_y + 80) // 2}" font-size="14" fill="#646265">read</text>\n\n')
a(arrow('p4', P['p4']))
a(f'  <text x="510" y="{mg_y + mg_h + G // 2 + 5}" font-size="14" fill="#646265">pending sessions</text>\n\n')

# reconciliation
y = rec_y
a(f'  <rect x="290" y="{y}" width="420" height="{rec_h}" rx="4" fill="#FFFFFF" stroke="#E6E6E6"/>\n')
a(f'  <text x="500" y="{y + 28}" font-size="18" font-weight="600" fill="#231F20" text-anchor="middle">Reconciliation</text>\n')
a(f'  <text x="500" y="{y + 48}" font-size="14" fill="#646265" text-anchor="middle">Runs locally</text>\n')
a(f'  <path d="{onto_d}" fill="#FFF4EB" stroke="#FB6E00" stroke-width="1.5" stroke-linejoin="round"/>\n')
a(f'  <text x="500" y="{onto_y + 28}" font-size="12" font-weight="600" letter-spacing="0.72" fill="#231F20" text-anchor="middle">ONTOLOGY</text>\n')
a(f'  <text x="500" y="{onto_y + 52}" font-size="14" fill="#231F20" text-anchor="middle">HyGM: entity and fact types</text>\n')
a(arrow('p5', P['p5']))
a(f'  <rect x="330" y="{ext_y}" width="340" height="{ext_h}" rx="4" fill="#FFFFFF" stroke="#BAB8BB"/>\n')
a(f'  <text x="500" y="{ext_y + 27}" font-size="14" fill="#646265" text-anchor="middle"><tspan font-weight="600" fill="#231F20">Extract</tspan> entities and facts with GLiNER2</text>\n')
a(arrow('p6', P['p6']))
a(f'  <rect x="330" y="{sto_y}" width="340" height="{sto_h}" rx="4" fill="#FFFFFF" stroke="#BAB8BB"/>\n')
a(f'  <text x="500" y="{sto_y + 27}" font-size="14" fill="#646265" text-anchor="middle"><tspan font-weight="600" fill="#231F20">Store</tspan> them with their embeddings</text>\n')
a(f'  <path id="p7" d="{P["p7"]}" fill="none" stroke="#FB6E00" stroke-width="1.5" marker-end="url(#arrow-accent)"/>\n\n')

# ontology learning + API
a(f'  <rect x="760" y="{sl_y}" width="192" height="48" rx="4" fill="#FFFFFF" stroke="#857F87" stroke-dasharray="4 3"/>\n')
a(f'  <text x="856" y="{sl_y + 30}" font-size="16" font-weight="600" fill="#646265" text-anchor="middle">Ontology learning</text>\n')
edge_x = 670 - 52 * 0.5
a(f'  <path d="M760,{sl_y + 24} H{edge_x + 2:.0f}" fill="none" stroke="#857F87" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arrow-muted)"/>\n')
a(f'  <path d="M856,{sl_y + 48} V{api_y - 2}" fill="none" stroke="#857F87" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arrow-muted)"/>\n')
a(f'  <text x="844" y="{api_y - 6}" font-size="13" fill="#857F87" text-anchor="end">session text, only with an API key</text>\n')
a(f'  <rect x="746" y="{api_y}" width="220" height="48" rx="4" fill="#FFFFFF" stroke="#BAB8BB" stroke-dasharray="4 3"/>\n')
a(f'  <text x="856" y="{api_y + 29}" font-size="15" font-weight="600" fill="#646265" text-anchor="middle">Anthropic or OpenAI API</text>\n\n')

# animation: step highlights
a('  <!-- animation: step highlights -->\n')
a(hl_rect('h-agent', 290, agent_y, 420, agent_h))
a(hl_rect('h-capture', 290, cap_y, 420, cap_h))
a(hl_rect('h-memgraph', 250, mg_y, 500, mg_h, 8))
a(hl_rect('h-recon', 290, rec_y, 420, rec_h))
a(hl_path('h-onto', onto_d, marker=False))
a(hl_rect('h-extract', 330, ext_y, 340, ext_h))
a(hl_rect('h-store', 330, sto_y, 340, sto_h))
a(hl_rect('h-mcp', 760, agent_y, 192, agent_h))

# animation: dots along the arrows
dots = [('p1', 0.9, 1.7), ('p3', 2.6, 3.4), ('p4', 4.4, 5.2), ('p5', 5.8, 6.4),
        ('p6', 6.8, 7.4), ('p7', 7.8, 8.9), ('p8', 9.0, 10.0), ('p9', 10.5, 11.0)]
a('  <!-- animation: dots along the arrows -->\n  <g class="flow">\n')
for pid, t0, t1 in dots:
    k0, k1, e = t0 / T, t1 / T, 0.004
    a(f'    <circle r="6" fill="#FB6E00" stroke="#FFFFFF" stroke-width="2" opacity="0">\n'
      f'      <animateMotion dur="{T:g}s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;{k0:.4f};{k1:.4f};1"><mpath href="#{pid}"/></animateMotion>\n'
      f'      <animate attributeName="opacity" dur="{T:g}s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;{k0:.4f};{k0 + e:.4f};{k1 - e:.4f};{k1:.4f};1"/>\n'
      f'    </circle>\n')
a('  </g>\n</svg>\n')
svg = ''.join(s)

# CSS keyframes for highlights and the knowledge graph
def pct(t):
    return f'{t / T * 100:.2f}%'


def hl(*wins):
    fr = [(0, 0)]
    for t0, t1 in wins:
        fr += [(t0, 0), (t0 + 0.2, 1), (t1 - 0.2, 1), (t1, 0)]
    return fr + [(T, 0)]


timeline = {
    # lit from the recall at the end of one loop through the capture at the start of the next
    'h-agent': [(0, 1), (1.0, 1), (1.2, 0), (10.8, 0), (11.0, 1), (T, 1)],
'h-capture': hl((1.5, 2.8)), 'h-memgraph': hl((3.2, 4.6)),
    'h-recon': hl((5.0, 8.2)), 'h-onto': hl((5.1, 6.0)), 'h-extract': hl((6.2, 7.0)),
    'h-store': hl((7.2, 8.0)), 'h-mcp': hl((9.8, 10.7)),
    'kg': [(0, 0.3), (8.8, 0.3), (9.2, 1), (11.5, 1), (11.9, 0.3), (T, 0.3)],
}
css = ['  <style>\n    @media (prefers-reduced-motion: no-preference) {\n']
for cls in timeline:
    css.append(f'      .{cls} {{ animation: {cls} {T:g}s linear infinite; }}\n')
css.append('    }\n    @media (prefers-reduced-motion: reduce) {\n      .flow { display: none; }\n    }\n')
for cls, fr in timeline.items():
    steps = ' '.join(f'{pct(t)} {{ opacity: {o}; }}' for t, o in fr)
    css.append(f'    @keyframes {cls} {{ {steps} }}\n')
css.append('  </style>\n')
svg = svg.replace('STYLE', ''.join(css))

open(f'{OUT}/context-graph-flow.svg', 'w').write(svg)
DARK = {'#F9F9F9': '#1A1718', '#FFFFFF': '#231F20', '#E6E6E6': '#3E3A3C', '#BAB8BB': '#646265',
        '#231F20': '#F9F9F9', '#646265': '#BAB8BB', '#857F87': '#9A949C', '#FFF4EB': '#3A2414'}
open(f'{OUT}/context-graph-flow-dark.svg', 'w').write(
    re.sub(r'#[0-9A-F]{6}', lambda m: DARK.get(m.group(0), m.group(0)), svg))
print('height', H)
