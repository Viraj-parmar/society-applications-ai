import os
import shutil
import re

base_dir = r"c:\Users\Admin\Desktop\viraj practice\projects\my-society app"
asset_html = os.path.join(base_dir, "asset", "html")

# 1. Delete redundant asset/html
if os.path.exists(asset_html):
    shutil.rmtree(asset_html)
    print("Deleted asset/html")

# 2. Extract media queries from style.css
style_path = os.path.join(base_dir, "asset", "css", "style.css")
with open(style_path, "r", encoding="utf-8") as f:
    style_content = f.read()

media_css = """/* RESPONSIVE */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .amenity-grid,
  .complaint-grid,
  .event-grid,
  .maintenance-grid,
  .notice-grid,
  .report-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 50;
  }
  
  .sidebar.show {
    transform: translateX(0);
  }

  .mobile-menu-btn {
    display: block;
  }

  .main-content {
    margin-left: 0;
    padding: 1.5rem;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .amenity-grid,
  .complaint-grid,
  .event-grid,
  .maintenance-grid,
  .notice-grid,
  .report-grid {
    grid-template-columns: 1fr;
  }
}
"""

media_dir = os.path.join(base_dir, "asset", "mediaquery")
if not os.path.exists(media_dir):
    os.makedirs(media_dir)

with open(os.path.join(media_dir, "media.css"), "w", encoding="utf-8") as f:
    f.write(media_css)
print("Created media.css")

# Clean up style.css
# Remove block 1: /* RESPONSIVE */ to /* INNER PAGE GRIDS */
style_content = re.sub(r'/\* RESPONSIVE \*/.*?/\* INNER PAGE GRIDS \*/', '/* INNER PAGE GRIDS */', style_content, flags=re.DOTALL)
# Remove block 2: @media (max-width: 1024px) to end of file
style_content = re.sub(r'@media \(max-width: 1024px\).*', '', style_content, flags=re.DOTALL)

with open(style_path, "w", encoding="utf-8") as f:
    f.write(style_content.strip() + '\n')
print("Cleaned up style.css")

# 3. Add link tags to HTML files
def insert_link(filepath, link_str):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    if 'media.css' not in content:
        content = content.replace('</head>', f'  {link_str}\n</head>')
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Added link to {os.path.basename(filepath)}")

insert_link(os.path.join(base_dir, "index.html"), '<link rel="stylesheet" href="asset/mediaquery/media.css">')

html_dir = os.path.join(base_dir, "html")
if os.path.exists(html_dir):
    for file in os.listdir(html_dir):
        if file.endswith(".html"):
            insert_link(os.path.join(html_dir, file), '<link rel="stylesheet" href="../asset/mediaquery/media.css">')

print("DONE")
