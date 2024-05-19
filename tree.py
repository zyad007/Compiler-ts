import json
import json
from graphviz import Digraph
import os
import platform  # To detect the operating system

os.environ["PATH"] += os.pathsep + 'C:/Program Files/Graphviz/bin/'

def add_nodes_edges(tree, dot=None, parent=None, color_map=None, terminal_color='red'):
    if dot is None:
        dot = Digraph(engine='dot')
        dot.attr('node', shape='ellipse', style='filled', fontname='Helvetica-Bold', fontsize='14')
        dot.attr('edge', fontname='Helvetica-Bold', fontsize='12', arrowsize='0.5')
        dot.attr('graph', size='15,15', ratio='auto', pad='0.5', nodesep='0.5', ranksep='1', dpi='300')

    node_label = tree.get('type', 'Unknown')

    node_name = f"{id(tree)}"

    if node_label == 'Terminal':
        node_color = '#FF1493' 
    else:
        node_color = color_map.get(tree['type'], '#66CDAA')  

    if 'value' in tree:
        node_label = tree['value']
    dot.node(node_name, label=node_label, color=node_color)

    if parent is not None:
        dot.edge(parent, node_name)

    if 'childrens' in tree:
        for child in tree['childrens']:
            add_nodes_edges(child, dot, parent=node_name, color_map=color_map, terminal_color=terminal_color)

    return dot

json_tree = ""
with open('ParseTreeRaw.json', 'r') as file:
    json_tree = file.read()
tree_dict = json.loads(json_tree)

color_map = {
}

dot = add_nodes_edges(tree_dict, color_map=color_map)
dot.format = 'png'
file_path = dot.render('ParseTree')

# Automatically open the generated file based on OS
if platform.system() == "Windows":
    os.startfile(file_path)
elif platform.system() == "Darwin":  # macOS
    os.system(f'open {file_path}')
elif platform.system() == "Linux":
    os.system(f'xdg-open {file_path}')