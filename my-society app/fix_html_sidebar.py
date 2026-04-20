import os
import glob

base_dir = r"c:\Users\Admin\Desktop\viraj practice\projects\my-society app"
html_files = glob.glob(os.path.join(base_dir, "*.html")) + glob.glob(os.path.join(base_dir, "html", "*.html"))

original_header = """    <div class="sidebar-header">
      <i class="ph-fill ph-buildings logo-icon"></i>
      <span class="logo-text">SocietyHub</span>
    </div>"""

replacement_header = """    <div class="sidebar-header" style="justify-content: space-between; width: 100%;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <i class="ph-fill ph-buildings logo-icon"></i>
        <span class="logo-text">SocietyHub</span>
      </div>
      <button id="mobileCloseBtn" onclick="document.getElementById('sidebar').classList.remove('show'); document.getElementById('sidebar-overlay').style.opacity='0'; setTimeout(()=>document.getElementById('sidebar-overlay').style.display='none',300);" class="mobile-close-btn" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; display: none;"><i class="ph ph-x"></i></button>
    </div>"""

for filepath in html_files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # We also format properly
    if original_header in content:
        content = content.replace(original_header, replacement_header)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated", filepath)

print("Done updating HTML files.")
