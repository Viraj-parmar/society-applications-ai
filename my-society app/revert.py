import os

with open('login.html', 'r', encoding='utf-8') as f:
    html = f.read()

css_path = 'asset/css/login.css'
if os.path.exists(css_path):
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()
    html = html.replace('<link rel="stylesheet" href="asset/css/login.css">', f'<style>\n{css}\n  </style>')

js_path = 'asset/javascript/login.js'
if os.path.exists(js_path):
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()
    html = html.replace('<script src="asset/javascript/login.js"></script>', f'<script>\n{js}\n  </script>')

# Only write back if it's not already moved
try:
    with open('asset/login.html', 'w', encoding='utf-8') as f:
        f.write(html)
    if os.path.exists('login.html'):
        os.remove('login.html')
except Exception as e:
    print(e)

try:
    if os.path.exists(css_path): os.remove(css_path)
    if os.path.exists(js_path): os.remove(js_path)
except Exception as e:
    pass

print("Reverted and moved to asset/login.html")
