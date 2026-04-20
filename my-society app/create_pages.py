import os

base_dir = r"c:\Users\Admin\Desktop\viraj practice\projects\my-society app"
html_dir = os.path.join(base_dir, "html")

if not os.path.exists(html_dir):
    os.makedirs(html_dir)

pages = [
    {"id": "maintenance", "title": "Maintenance", "subtitle": "Track your maintenance dues and history.", "key": "maintenances", "card": "maintenance"},
    {"id": "complaints", "title": "Complaints", "subtitle": "View and lodge new complaints.", "key": "complaints", "card": "complaint"},
    {"id": "events", "title": "Events", "subtitle": "Discover upcoming community events.", "key": "events", "card": "event"},
    {"id": "amenities", "title": "Amenities", "subtitle": "Explore and book society amenities.", "key": "amenities", "card": "amenity"},
    {"id": "notice-board", "title": "Notice Board", "subtitle": "Stay updated with important notices.", "key": "notices", "card": "notice"},
    {"id": "report", "title": "Reports", "subtitle": "View society performance and statistical reports.", "key": "reports", "card": "report"},
]

template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} - SocietyHub</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../asset/css/style.css">
</head>
<body>

<a href="#main-content" class="skip-link">Skip to main content</a>

<nav class="sidebar p-3 hide" id="sidebar" role="navigation" aria-label="Main navigation">
  <h4 class="mb-4 mt-2 ps-5">SocietyHub</h4>
  <div class="mb-3 ms-4">
    <strong>John Doe</strong><br>
    <small>Flat A-101</small>
  </div>
  <div class="nav-links">
    <a href="../index.html">Dashboard</a>
    <a href="./maintenance.html" {maintenance_active}>Maintenance</a>
    <a href="./complaints.html" {complaints_active}>Complaints</a>
    <a href="./events.html" {events_active}>Events</a>
    <a href="./amenities.html" {amenities_active}>Amenities</a>
    <a href="./notice-board.html" {notice_board_active}>Notice Board</a>
    <a href="./report.html" {report_active}>Reports</a>
  </div>
  <div class="mt-auto">
    <a href="#">Sign Out</a>
  </div>
</nav>

<button class="menu-btn" id="toggleMenuBtn" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="sidebar">☰</button>

<main class="content" id="main-content">
  <header class="mb-4">
    <h3>{title}</h3>
    <p class="text-muted mt-2">{subtitle}</p>
  </header>

  <div class="{card}-grid" id="{id}Container">
    <!-- Items loaded dynamically -->
  </div>
</main>

<script src="../asset/javascript/script.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  loadData();
});

function loadData() {
  const data = JSON.parse(localStorage.getItem('{key}') || '[]');
  const container = document.getElementById('{id}Container');
  
  if (data.length === 0) {
    container.innerHTML = '<p class="text-center text-muted" style="grid-column: 1 / -1; padding: 2rem;">No data available at the moment.</p>';
    return;
  }
  
  container.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = '{card}-card';
    
    let displayTitle = item.title || item.name || 'Record';
    let detailText = item.status || item.type || item.date || 'Update logged';
    
    div.innerHTML = `
      <h5>${displayTitle}</h5>
      <p class="mb-3"><strong>Detail:</strong> ${detailText}</p>
      <a href="#" class="btn-soft">View More</a>
    `;
    container.appendChild(div);
  });
}
</script>

</body>
</html>
"""

for page in pages:
    ctx = {
        "title": page["title"],
        "subtitle": page["subtitle"],
        "id": page["id"],
        "card": page["card"],
        "key": page["key"],
        "maintenance_active": 'class="active"' if page["id"] == "maintenance" else "",
        "complaints_active": 'class="active"' if page["id"] == "complaints" else "",
        "events_active": 'class="active"' if page["id"] == "events" else "",
        "amenities_active": 'class="active"' if page["id"] == "amenities" else "",
        "notice_board_active": 'class="active"' if page["id"] == "notice-board" else "",
        "report_active": 'class="active"' if page["id"] == "report" else "",
    }
    
    content = template
    for k, v in ctx.items():
        content = content.replace("{" + k + "}", v)
    file_path = os.path.join(html_dir, f'{page["id"]}.html')
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Created {len(pages)} pages successfully in html folder!")
