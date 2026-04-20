// --- GLOBAL AUTHENTICATION CHECK ---
(function() {
  const isLoginPage = window.location.pathname.endsWith('login.html');
  const userStr = localStorage.getItem('currentUser');
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (!user && !isLoginPage) {
    if(window.location.pathname.includes('/html/')) {
      window.location.href = './login.html';
    } else {
      window.location.href = './html/login.html';
    }
    return;
  }
  
  window.isAdmin = user && user.role === 'admin';
})();
// -----------------------------------

// Sidebar toggle logic
document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  if (!sidebar || !menuBtn) return;

  // Inject Overlay dynamically for reliable "click outside" tracking
  let overlay = document.getElementById('sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 9998; display: none; opacity: 0; transition: opacity 0.3s; backdrop-filter: blur(2px);';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
      closeSidebar();
    });
  }

  // Bind the native HTML Mobile Close Button
  const closeBtn = document.getElementById('mobileCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSidebar();
    });

    window.addEventListener('resize', () => {
      closeBtn.style.display = window.innerWidth < 768 ? 'block' : 'none';
      if (window.innerWidth >= 768) {
        closeSidebar(); // Reset correctly when flipping to desktop
      }
    });
    closeBtn.style.display = window.innerWidth < 768 ? 'block' : 'none';
  }

  function closeSidebar() {
    sidebar.classList.remove('show');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.classList.remove('active-btn');
    menuBtn.innerHTML = '<i class="ph ph-list"></i>';
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.style.display = 'none', 300);
    }
  }

  function openSidebar() {
    sidebar.classList.add('show');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.classList.add('active-btn');
    menuBtn.innerHTML = '<i class="ph ph-x"></i>';
    if (window.innerWidth < 768 && overlay) {
      overlay.style.display = 'block';
      setTimeout(() => overlay.style.opacity = '1', 10);
    }
  }

  function toggleSidebar(e) {
    if(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isVisible = sidebar.classList.contains('show');
    if (isVisible) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  menuBtn.addEventListener('click', toggleSidebar);

  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        closeSidebar();
      }
    });
  });

});

// Data loading functions for inner pages
document.addEventListener('DOMContentLoaded', function () {
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    const user = JSON.parse(userStr);
    document.querySelectorAll('.user-name').forEach(el => el.textContent = user.name);
    document.querySelectorAll('.user-flat').forEach(el => el.textContent = user.house);
  }

  // Handle Sign Out everywhere
  document.querySelectorAll('.sign-out').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      const prefix = window.location.pathname.includes('/html/') ? './' : './html/';
      window.location.href = prefix + 'login.html';
    });
  });

  loadAllData();
});

function loadAllData() {
  loadDashboardData();
  loadAmenities();
  loadComplaints();
  loadEvents();
  loadMaintenance();
  loadNotices();
  loadReports();
}

function loadDashboardData() {
  const maintenanceCount = document.getElementById('maintenanceCount');
  const complaintsCount = document.getElementById('complaintsCount');
  const eventsCount = document.getElementById('eventsCount');
  const noticesCount = document.getElementById('noticesCount');

  if (maintenanceCount) {
    const maintenances = JSON.parse(localStorage.getItem('maintenances') || '[]');
    maintenanceCount.textContent = maintenances.length;
  }
  if (complaintsCount) {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    complaintsCount.textContent = complaints.length;
  }
  if (eventsCount) {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    eventsCount.textContent = events.length;
  }
  if (noticesCount) {
    const notices = JSON.parse(localStorage.getItem('notices') || '[]');
    noticesCount.textContent = notices.length;
  }

  const eventsList = document.getElementById('eventsList');
  if (eventsList) {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    if (events.length === 0) {
      eventsList.innerHTML = 'No upcoming events at the moment';
      eventsList.className = 'empty-state';
    } else {
      eventsList.innerHTML = '';
      eventsList.className = 'events-grid';
      events.slice(0, 3).forEach(item => {
        const div = document.createElement('div');
        div.className = 'event-card';
        div.innerHTML = `
          <h5>${item.title || item.name || 'Event'}</h5>
          <p><strong>Detail:</strong> ${item.status || item.type || item.date || 'Upcoming'}</p>
        `;
        eventsList.appendChild(div);
      });
    }
  }
}


function loadAmenities() {
  const container = document.getElementById('amenitiesContainer');
  if (!container) return;

  let data = JSON.parse(localStorage.getItem('amenities'));
  if (!data || data.length === 0) {
    data = [
      { id: 1, title: 'Swimming Pool', timing: '6:00 AM - 10:00 PM', status: 'Available' },
      { id: 2, title: 'Tennis Court', timing: '8:00 AM - 8:00 PM', status: 'Booked' },
      { id: 3, title: 'Community Gym', timing: '24/7 Access', status: 'Available' },
      { id: 4, title: 'Spa & Sauna', timing: 'Temporarily Closed', status: 'Maintenance' }
    ];
    localStorage.setItem('amenities', JSON.stringify(data));
  }

  container.innerHTML = '';
  data.forEach(item => {
    let statusColor, statusBg;
    if (item.status === 'Available') { statusColor = '#10b981'; statusBg = '#10b98115'; }
    else if (item.status === 'Booked') { statusColor = '#f59e0b'; statusBg = '#f59e0b15'; }
    else { statusColor = '#6b7280'; statusBg = '#f3f4f6'; } // Maintenance

    const isAvailable = item.status === 'Available';

    const div = document.createElement('div');
    div.className = 'amenity-card';
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <div>
          <h5 style="margin: 0 0 0.35rem 0; font-size: 1.1rem; color: var(--text-main); font-weight: 600;">${item.title || 'Amenity'}</h5>
          <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="ph ph-clock" style="vertical-align: middle;"></i> ${item.timing || 'Standard Hours'}</span>
        </div>
        <span style="background: ${statusBg}; color: ${statusColor}; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${item.status || 'Available'}</span>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <div style="height: 60px; background-color: #f8fafc; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px dashed #cbd5e1;">
           <i class="ph ph-image" style="font-size: 2rem; color: #cbd5e1;"></i>
        </div>
      </div>
      <div style="display: flex; gap: 0.75rem; border-top: 1px solid var(--card-border); padding-top: 1.25rem;">
        ${isAvailable 
          ? `<button class="btn-pay" style="background-color: #10b981;" onmouseover="this.style.backgroundColor='#059669'" onmouseout="this.style.backgroundColor='#10b981'" onclick="window.bookAmenity(${item.id})">Book Slot</button>`
          : (window.isAdmin 
              ? `<button class="btn-pay" style="background-color: #ef4444; transition: all 0.2s;" onclick="window.resetAmenity(${item.id})"><i class="ph ph-arrows-counter-clockwise"></i> Clear Booking</button>`
              : `<button class="btn-receipt">View Schedule</button>`
            )
        }
      </div>
    `;
    container.appendChild(div);
  });
}

function loadComplaints() {
  const container = document.getElementById('complaintsContainer');
  if (!container) return;

  let data = JSON.parse(localStorage.getItem('complaints'));
  if (!data || data.length === 0) {
    data = [
      { id: 1, title: 'Water Leakage in Parking A', category: 'Plumbing', status: 'In Progress', date: '15th Apr 2026' },
      { id: 2, title: 'Left Elevator Not Working', category: 'Electrical', status: 'Pending', date: '16th Apr 2026' },
      { id: 3, title: 'Lobby AC Maintenance', category: 'HVAC', status: 'Resolved', date: '10th Apr 2026' }
    ];
    localStorage.setItem('complaints', JSON.stringify(data));
  }

  container.innerHTML = '';

  // Add Header button for new complaint
  const headerDiv = document.createElement('div');
  headerDiv.style.gridColumn = '1 / -1';
  headerDiv.style.display = 'flex';
  headerDiv.style.justifyContent = 'flex-end';
  headerDiv.style.marginBottom = '0.5rem';
  if(!window.isAdmin) {
    headerDiv.innerHTML = `<button class="btn-pay" style="width: auto; padding: 0.65rem 1.25rem; display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); transition: all 0.2s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='none'" onclick="window.openComplaintModal()"><i class="ph ph-plus-circle" style="font-size: 1.25rem;"></i> New Complaint</button>`;
  } else {
    headerDiv.innerHTML = `<span style="padding: 0.65rem 1.25rem; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 0.5rem; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem;"><i class="ph ph-shield-check"></i> Admin Mode</span>`;
  }
  container.appendChild(headerDiv);
  data.forEach(item => {
    let statusColor, statusBg;
    if (item.status === 'Resolved') { statusColor = '#10b981'; statusBg = '#10b98115'; }
    else if (item.status === 'In Progress') { statusColor = '#0ea5e9'; statusBg = '#0ea5e915'; }
    else { statusColor = '#f59e0b'; statusBg = '#f59e0b15'; } // Pending

    const div = document.createElement('div');
    div.className = 'complaint-card';
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <div>
          <h5 style="margin: 0 0 0.35rem 0; font-size: 1.1rem; color: var(--text-main); font-weight: 600;">${item.title || 'Complaint'}</h5>
          <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="ph ph-tag" style="vertical-align: middle;"></i> ${item.category || 'General'}</span>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span style="background: ${statusBg}; color: ${statusColor}; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;">${item.status || 'Pending'}</span>
          ${window.isAdmin ? `<button onclick="window.deleteItem('complaints', ${item.id}, 'loadComplaints')" style="background: #fee2e2; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ef4444; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='none'" title="Delete Ticket"><i class="ph ph-trash"></i></button>` : ''}
        </div>
      </div>
      <div style="margin-bottom: 1.5rem;">
        ${item.description ? `<p style="margin: 0 0 0.75rem 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;" title="${item.description.replace(/"/g, '&quot;')}">${item.description}</p>` : ''}
        <p style="margin: 0; font-size: 0.85rem; color: var(--text-main); font-weight: 500;">
          <i class="ph ph-calendar-blank" style="vertical-align: middle;"></i> Submitted: ${item.date || 'Recently'}
        </p>
      </div>
      <div style="display: flex; gap: 0.75rem; border-top: 1px solid var(--card-border); padding-top: 1.25rem;">
        ${item.status === 'Resolved' 
          ? `<button class="btn-receipt">View Closing Report</button>`
          : (window.isAdmin 
              ? `<button class="btn-pay" style="background-color: #10b981; width: 100%; transition: all 0.2s;" onclick="window.resolveComplaint(${item.id})"><i class="ph ph-check-circle"></i> Resolve Ticket</button>`
              : `<button class="btn-pay" style="background-color: #ef4444;" onmouseover="this.style.backgroundColor='#dc2626'" onmouseout="this.style.backgroundColor='#ef4444'">Escalate</button><button class="btn-receipt" style="flex: 1;">Add Note</button>`
            )
        }
      </div>
    `;
    container.appendChild(div);
  });
}

function loadEvents() {
  const container = document.getElementById('eventsContainer');
  if (!container) return;

  let data = JSON.parse(localStorage.getItem('events'));
  if (!data || data.length === 0) {
    data = [
      { id: 1, title: 'Summer Pool Party', location: 'Clubhouse Pool', status: 'Upcoming', date: '25th Apr 2026, 4:00 PM', isRsvpd: false, participants: 12 },
      { id: 2, title: 'Society General Meeting', location: 'Community Hall', status: 'Upcoming', date: '30th Apr 2026, 10:00 AM', isRsvpd: false, participants: 45 },
      { id: 3, title: 'Holi Celebration 2026', location: 'Main Garden', status: 'Completed', date: '25th Mar 2026, 9:00 AM', isRsvpd: true, participants: 120 }
    ];
    localStorage.setItem('events', JSON.stringify(data));
  }

  container.innerHTML = '';
  if (window.isAdmin) {
    const adminHeader = document.createElement('div');
    adminHeader.style.gridColumn = '1 / -1';
    adminHeader.style.display = 'flex';
    adminHeader.style.justifyContent = 'flex-end';
    adminHeader.style.marginBottom = '0.5rem';
    adminHeader.innerHTML = `<button class="btn-pay" style="width: auto; padding: 0.65rem 1.25rem; display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #10b981 0%, #059669 100%); transition: all 0.2s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='none'" onclick="window.openAddEventModal()"><i class="ph ph-plus-circle" style="font-size: 1.25rem;"></i> Create Event</button>`;
    container.appendChild(adminHeader);
  }
  data.forEach(item => {
    const isUpcoming = item.status === 'Upcoming';
    const statusColor = isUpcoming ? '#8b5cf6' : '#6b7280'; 
    const statusBg = isUpcoming ? '#8b5cf615' : '#f3f4f6';

    const div = document.createElement('div');
    div.className = 'event-card';
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <div>
          <h5 style="margin: 0 0 0.35rem 0; font-size: 1.1rem; color: var(--text-main); font-weight: 600;">${item.title || 'Event'}</h5>
          <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="ph ph-map-pin" style="vertical-align: middle;"></i> ${item.location || 'Society Premises'}</span>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span style="background: ${statusBg}; color: ${statusColor}; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${item.status || 'Upcoming'}</span>
          ${window.isAdmin ? `<button onclick="window.deleteItem('events', ${item.id}, 'loadEvents')" style="background: #fee2e2; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ef4444; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='none'" title="Delete Event"><i class="ph ph-trash"></i></button>` : ''}
        </div>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <p style="margin: 0; font-size: 0.85rem; color: var(--text-main); font-weight: 500;">
          <i class="ph ph-clock" style="vertical-align: middle;"></i> ${item.date || 'TBD'}
        </p>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--card-border); padding-top: 1.25rem;">
        <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-muted);"><i class="ph ph-users" style="vertical-align: middle;"></i> ${item.participants || 0} attending</span>
        ${isUpcoming 
          ? (item.isRsvpd 
              ? `<button class="btn-pay" style="background-color: #10b981; width: auto; padding: 0.5rem 1rem; cursor: default;"><i class="ph ph-check-circle"></i> Going</button>`
              : `<button class="btn-pay" style="background-color: #8b5cf6; width: auto; padding: 0.5rem 1rem; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#7c3aed'" onmouseout="this.style.backgroundColor='#8b5cf6'" onclick="window.participateEvent(${item.id})">RSVP Now</button>`
            )
          : `<button class="btn-receipt" style="width: auto; padding: 0.5rem 1rem;"><i class="ph ph-images" style="font-size: 1.1rem;"></i> Gallery</button>`
        }
      </div>
    `;
    container.appendChild(div);
  });
}

function loadMaintenance() {
  const container = document.getElementById('maintenanceContainer');
  if (!container) return;

  // Make loadMaintenance globally accessible for the toggle and pay actions
  window.payMaintenance = function(id) {
    let data = JSON.parse(localStorage.getItem('maintenances') || '[]');
    let item = data.find(d => d.id === id);
    if (item) {
      const btn = document.getElementById(`pay-btn-${id}`);
      if(btn) {
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processing...';
        btn.style.opacity = '0.7';
        btn.disabled = true;
      }
      
      setTimeout(() => {
        item.status = 'Paid';
        
        // Update datePaid to today
        const today = new Date();
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        item.datePaid = today.toLocaleDateString('en-GB', options).replace(/ /g, 'th ').replace('th th', 'th '); // basic format
        
        localStorage.setItem('maintenances', JSON.stringify(data));
        loadMaintenance(); // Re-render
        
        if(window.showToast) {
          window.showToast(`Payment of ${item.amount} for ${item.title} successful!`, 'success');
        } else {
          alert(`Payment for ${item.title} successful!`);
        }
      }, 1000); // simulate network delay
    }
  };

  window.downloadReceipt = function(id) {
    let data = JSON.parse(localStorage.getItem('maintenances') || '[]');
    let item = data.find(d => d.id === id);
    if (item) {
      if(window.showToast) {
        window.showToast(`Generating receipt for ${item.title}...`, 'info');
        setTimeout(() => {
          window.showToast('Receipt downloaded successfully!', 'success');
        }, 1500);
      }
    }
  };

  window.toggleBreakdown = function(id) {
    const el = document.getElementById(`breakdown-${id}`);
    const icon = document.getElementById(`breakdown-icon-${id}`);
    if (el.style.display === 'none') {
      el.style.display = 'block';
      if(icon) icon.classList.replace('ph-caret-down', 'ph-caret-up');
    } else {
      el.style.display = 'none';
      if(icon) icon.classList.replace('ph-caret-up', 'ph-caret-down');
    }
  };

  // Seed or load data
  let data = JSON.parse(localStorage.getItem('maintenances'));
  if (!data || data.length === 0) {
    data = [
      { id: 1, title: 'April 2026', amount: '₹2,500', status: 'Pending', dueDate: '10th Apr 2026', base: '₹1,500', sinking: '₹500', parking: '₹500' },
      { id: 2, title: 'March 2026', amount: '₹2,500', status: 'Paid', datePaid: '05th Mar 2026', base: '₹1,500', sinking: '₹500', parking: '₹500' },
      { id: 3, title: 'February 2026', amount: '₹2,500', status: 'Paid', datePaid: '08th Feb 2026', base: '₹1,500', sinking: '₹500', parking: '₹500' },
      { id: 4, title: 'January 2026', amount: '₹2,500', status: 'Paid', datePaid: '05th Jan 2026', base: '₹1,500', sinking: '₹500', parking: '₹500' }
    ];
    localStorage.setItem('maintenances', JSON.stringify(data));
  }

  container.innerHTML = '';

  // Calculate Summary
  let totalPending = 0;
  data.forEach(d => {
    if (d.status === 'Pending') {
      let val = (d.amount || "").toString().replace(/[^0-9.-]+/g, "");
      totalPending += parseInt(val) || 0;
    }
  });

  // Inject Summary Header inside container (spanning all columns)
  const summaryDiv = document.createElement('div');
  summaryDiv.style.gridColumn = '1 / -1'; // Spans full width of the grid
  summaryDiv.style.display = 'flex';
  summaryDiv.style.gap = '1.5rem';
  summaryDiv.style.marginBottom = '0.5rem';
  summaryDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 1.25rem 1.5rem; border-radius: 0.75rem; flex: 1; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2);">
      <div>
        <h4 style="margin: 0 0 0.5rem 0; font-weight: 500; font-size: 0.95rem; opacity: 0.9;">Total Outstanding Dues</h4>
        <div style="font-size: 2rem; font-weight: 700;">₹${totalPending.toLocaleString('en-IN')}</div>
      </div>
      <i class="ph ph-wallet" style="font-size: 3rem; opacity: 0.8;"></i>
    </div>
    <div style="background: white; border: 1px solid var(--card-border); padding: 1.25rem 1.5rem; border-radius: 0.75rem; flex: 1; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h4 style="margin: 0 0 0.5rem 0; font-weight: 500; font-size: 0.95rem; color: var(--text-muted);">${window.isAdmin ? 'Admin Actions' : 'Payment Methods'}</h4>
        <div style="display: flex; gap: 0.5rem; color: var(--text-main); align-items: center;">
          ${window.isAdmin 
            ? `<button class="btn-pay" style="padding: 0.5rem 1rem; width: auto; background: #0ea5e9; border: none; font-size: 0.85rem; font-weight: 600; font-family: inherit; color: white; cursor: pointer; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.4rem; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='none'" onclick="window.addMaintenanceModal()"><i class="ph ph-plus-circle" style="font-size: 1.1rem;"></i> Generate Society Bill</button>`
            : `<i class="ph ph-credit-card" style="font-size: 1.8rem;"></i><i class="ph ph-bank" style="font-size: 1.8rem;"></i><i class="ph ph-qr-code" style="font-size: 1.8rem;"></i>`
          }
        </div>
      </div>
      <i class="ph ${window.isAdmin ? 'ph-gear' : 'ph-shield-check'}" style="font-size: 2rem; color: #10b981;"></i>
    </div>
  `;
  container.appendChild(summaryDiv);

  data.forEach(item => {
    const isPending = item.status === 'Pending';
    const statusColor = isPending ? '#ef4444' : '#10b981';

    const div = document.createElement('div');
    div.className = 'maintenance-card';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h5 style="margin: 0; font-size: 1.1rem; color: var(--text-main); font-weight: 600;">${item.title || 'Maintenance'}</h5>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span style="background: ${statusColor}15; color: ${statusColor}; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${item.status || 'Pending'}</span>
          ${window.isAdmin ? `<button onclick="window.deleteItem('maintenances', ${item.id}, 'loadMaintenance')" style="background: #fee2e2; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ef4444; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='none'" title="Delete Bill"><i class="ph ph-trash"></i></button>` : ''}
        </div>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <p style="margin: 0; font-size: 1.75rem; font-weight: 700; color: var(--text-main);">${item.amount || '₹2,500'}</p>
        <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem; color: var(--text-muted);">
          <i class="ph ${isPending ? 'ph-clock' : 'ph-check-circle'}" style="vertical-align: middle;"></i>
          ${isPending ? `Due: ${item.dueDate || 'Immediate'}` : `Paid on: ${item.datePaid || 'Recently'}`}
        </p>
      </div>

      <div style="margin-bottom: 1.5rem; flex-grow: 1;">
        <button onclick="toggleBreakdown(${item.id})" style="background: none; border: none; color: #0ea5e9; font-size: 0.85rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; padding: 0;">
          View Breakdown <i id="breakdown-icon-${item.id}" class="ph ph-caret-down"></i>
        </button>
        
        <div id="breakdown-${item.id}" style="display: none; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed #e2e8f0;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.4rem;">
            <span>Common Maintenance</span>
            <span style="color: var(--text-main); font-weight: 500;">${item.base || '₹1,500'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.4rem;">
            <span>Sinking Fund</span>
            <span style="color: var(--text-main); font-weight: 500;">${item.sinking || '₹500'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted);">
            <span>Parking Charges</span>
            <span style="color: var(--text-main); font-weight: 500;">${item.parking || '₹500'}</span>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; border-top: 1px solid var(--card-border); padding-top: 1.25rem; margin-top: auto;">
        ${isPending
          ? `<button id="pay-btn-${item.id}" class="btn-pay" onclick="payMaintenance(${item.id})" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; transition: all 0.2s;"><i class="ph ph-credit-card" style="font-size: 1.1rem;"></i> Pay Now</button>`
          : `<button class="btn-receipt" onclick="downloadReceipt(${item.id})" style="flex: 1; transition: all 0.2s;"><i class="ph ph-file-pdf" style="font-size: 1.1rem; color: #ef4444;"></i> Download Receipt</button>`
        }
      </div>
    `;
    container.appendChild(div);
  });
}

function loadNotices() {
  const container = document.getElementById('notice-boardContainer');
  if (!container) return;

  // Force seed elegant grid layout
  let data = [
    { id: 1, title: 'Annual Fire Drill 2026', type: 'Alert', date: '18th Apr 2026', preview: 'Mandatory fire evacuation drill for all residents. Please gather at the main assembly area.' },
    { id: 2, title: 'Water Box Interruption', type: 'Update', date: '12th Apr 2026', preview: 'Water supply will be paused from 2 PM to 5 PM for scheduled tank maintenance.' },
    { id: 3, title: 'New Visitor Parking Policy', type: 'Guideline', date: '1st Apr 2026', preview: 'All visitors must register their vehicles at the front gate using the new automated kiosk.' }
  ];
  localStorage.setItem('notices', JSON.stringify(data));

  container.innerHTML = '';
  if (window.isAdmin) {
    const adminHeader = document.createElement('div');
    adminHeader.style.gridColumn = '1 / -1';
    adminHeader.style.display = 'flex';
    adminHeader.style.justifyContent = 'flex-end';
    adminHeader.style.marginBottom = '0.5rem';
    adminHeader.innerHTML = `<button class="btn-pay" style="width: auto; padding: 0.65rem 1.25rem; display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #10b981 0%, #059669 100%); transition: all 0.2s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='none'" onclick="window.openAddNoticeModal()"><i class="ph ph-megaphone" style="font-size: 1.25rem;"></i> Publish Notice</button>`;
    container.appendChild(adminHeader);
  }
  data.forEach(item => {
    let typeColor, typeBg, icon;
    if (item.type === 'Alert') { typeColor = '#ef4444'; typeBg = '#ef444415'; icon = 'ph-warning-octagon'; }
    else if (item.type === 'Update') { typeColor = '#0ea5e9'; typeBg = '#0ea5e915'; icon = 'ph-info'; }
    else { typeColor = '#8b5cf6'; typeBg = '#8b5cf615'; icon = 'ph-book-open'; }

    const div = document.createElement('div');
    div.className = 'notice-card';
    div.innerHTML = `
      <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem;">
        <div style="background-color: ${typeBg}; color: ${typeColor}; width: 44px; height: 44px; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <i class="ph ${icon}" style="font-size: 1.5rem;"></i>
        </div>
        <div style="flex-grow: 1;">
          <h5 style="margin: 0 0 0.35rem 0; font-size: 1.05rem; color: var(--text-main); font-weight: 600; line-height: 1.3;">${item.title || 'Notice'}</h5>
          <span style="font-size: 0.75rem; color: var(--text-muted);"><i class="ph ph-calendar-blank"></i> ${item.date || 'Recent'}</span>
        </div>
        ${window.isAdmin ? `<button onclick="window.deleteItem('notices', ${item.id}, 'loadNotices')" style="background: #fee2e2; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ef4444; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='none'" title="Delete Notice"><i class="ph ph-trash"></i></button>` : ''}
      </div>
      <div style="margin-bottom: 1.5rem;">
        <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
          ${item.preview || 'No additional details available for this notice.'}
        </p>
      </div>
      <div style="display: flex; gap: 0.75rem; border-top: 1px solid var(--card-border); padding-top: 1.25rem;">
        <button class="btn-receipt" style="flex: 1;"><i class="ph ph-file-pdf" style="font-size: 1.1rem; color: #ef4444;"></i> Download PDF</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function loadReports() {
  const container = document.getElementById('reportContainer');
  if (!container) return;

  // Force seed elegant grid layout for Society Reports
  let data = [
    { id: 1, title: 'Society Audit FY 2025-26', type: 'Yearly Report', date: '31st Mar 2026', format: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'Monthly Maintenance Ledger', type: 'Monthly Report', date: '1st Apr 2026', format: 'Excel', size: '156 KB' },
    { id: 3, title: 'Water & Electricity Usage', type: 'Monthly Report', date: '5th Apr 2026', format: 'PDF', size: '840 KB' },
    { id: 4, title: 'Annual General Meeting', type: 'Yearly Report', date: '10th Jan 2026', format: 'PDF', size: '1.1 MB' }
  ];
  localStorage.setItem('reports', JSON.stringify(data));

  container.innerHTML = '';
  if (window.isAdmin) {
    const adminHeader = document.createElement('div');
    adminHeader.style.gridColumn = '1 / -1';
    adminHeader.style.display = 'flex';
    adminHeader.style.justifyContent = 'flex-end';
    adminHeader.style.marginBottom = '0.5rem';
    adminHeader.innerHTML = `<button class="btn-pay" style="width: auto; padding: 0.65rem 1.25rem; display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #10b981 0%, #059669 100%); transition: all 0.2s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='none'" onclick="window.openAddReportModal()"><i class="ph ph-upload-simple" style="font-size: 1.25rem;"></i> Upload Report</button>`;
    container.appendChild(adminHeader);
  }
  data.forEach(item => {
    let typeColor, typeBg, icon;
    if (item.type === 'Yearly Report') { typeColor = '#8b5cf6'; typeBg = '#8b5cf615'; icon = 'ph-folder-star'; }
    else if (item.type === 'Quarterly Report') { typeColor = '#f59e0b'; typeBg = '#f59e0b15'; icon = 'ph-folder-notch'; }
    else { typeColor = '#0ea5e9'; typeBg = '#0ea5e915'; icon = 'ph-folder'; } // Monthly Default

    const isExcel = item.format === 'Excel';
    const formatColor = isExcel ? '#10b981' : '#ef4444'; // Green for Excel, Red for PDF
    const formatIcon = isExcel ? 'ph-file-xls' : 'ph-file-pdf';

    const div = document.createElement('div');
    div.className = 'report-card';
    div.innerHTML = `
      <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem;">
        <div style="background-color: ${typeBg}; color: ${typeColor}; width: 44px; height: 44px; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <i class="ph ${icon}" style="font-size: 1.5rem;"></i>
        </div>
        <div style="flex-grow: 1;">
          <h5 style="margin: 0 0 0.35rem 0; font-size: 1.05rem; color: var(--text-main); font-weight: 600; line-height: 1.3;">${item.title || 'Financial Report'}</h5>
          <span style="font-size: 0.75rem; color: var(--text-muted);"><i class="ph ph-calendar-blank"></i> Published: ${item.date || 'Recent'}</span>
        </div>
        ${window.isAdmin ? `<button onclick="window.deleteItem('reports', ${item.id}, 'loadReports')" style="background: #fee2e2; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ef4444; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='none'" title="Delete Report"><i class="ph ph-trash"></i></button>` : ''}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; background-color: var(--bg-main); border: 1px dashed var(--card-border); padding: 0.6rem 0.85rem; border-radius: 0.5rem;">
        <span style="font-size: 0.8rem; font-weight: 600; color: ${typeColor};">${item.type}</span>
        <div style="display: flex; align-items: center; gap: 0.35rem;">
          <i class="ph ${formatIcon}" style="color: ${formatColor}; font-size: 1.15rem;"></i>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">${item.format} • ${item.size || 'N/A'}</span>
        </div>
      </div>
      <div style="display: flex; gap: 0.75rem; border-top: 1px solid var(--card-border); padding-top: 1.25rem;">
        <button class="btn-pay" style="background-color: #111827;" onmouseover="this.style.backgroundColor='#1f2937'" onmouseout="this.style.backgroundColor='#111827'">View Online</button>
        <button class="btn-receipt"><i class="ph ph-download-simple" style="font-size: 1.1rem;"></i> Download</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Global Toast Notification System
window.showToast = function(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '2rem';
    toastContainer.style.right = '2rem';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '0.75rem';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#10b981' : type === 'info' ? '#0ea5e9' : '#ef4444';
  const icon = type === 'success' ? 'ph-check-circle' : type === 'info' ? 'ph-info' : 'ph-warning-circle';
  
  toast.style.background = bgColor;
  toast.style.color = 'white';
  toast.style.padding = '1rem 1.5rem';
  toast.style.borderRadius = '0.5rem';
  toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '0.75rem';
  toast.style.fontSize = '0.95rem';
  toast.style.fontWeight = '500';
  toast.style.transform = 'translateY(100px)';
  toast.style.opacity = '0';
  toast.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  
  toast.innerHTML = `<i class="ph ${icon}" style="font-size: 1.5rem;"></i> ${message}`;
  
  toastContainer.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Global Modal System
window.openModal = function(title, contentHtml, onConfirm, confirmText = 'Submit') {
  if(document.getElementById('custom-modal-overlay')) {
    document.getElementById('custom-modal-overlay').remove();
  }
  
  const overlay = document.createElement('div');
  overlay.id = 'custom-modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  overlay.style.backdropFilter = 'blur(4px)';
  overlay.style.zIndex = '9998';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)';

  const modal = document.createElement('div');
  modal.style.background = '#fff';
  modal.style.borderRadius = '1rem';
  modal.style.width = '100%';
  modal.style.maxWidth = '450px';
  modal.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
  modal.style.transform = 'scale(0.95)';
  modal.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
  modal.style.overflow = 'hidden';

  modal.innerHTML = `
    <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--card-border); display: flex; justify-content: space-between; align-items: center; background: white;">
      <h3 style="margin: 0; font-size: 1.15rem; color: var(--text-main); font-weight: 600;">${title}</h3>
      <button onclick="window.closeModal()" style="background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 1.25rem; display: flex; transition: color 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#9ca3af'"><i class="ph ph-x"></i></button>
    </div>
    <div style="padding: 1.5rem; background: white;">
      ${contentHtml}
    </div>
    <div style="padding: 1rem 1.5rem; border-top: 1px solid var(--card-border); background: #f8fafc; display: flex; justify-content: flex-end; gap: 0.75rem;">
      <button onclick="window.closeModal()" style="padding: 0.6rem 1rem; border: 1px solid var(--card-border); border-radius: 0.5rem; background: white; cursor: pointer; font-weight: 500; color: var(--text-main); font-size: 0.9rem; transition: background 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='white'">Cancel</button>
      <button id="modal-confirm-btn" style="padding: 0.6rem 1.25rem; border: none; border-radius: 0.5rem; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; cursor: pointer; font-weight: 500; font-size: 0.9rem; transition: opacity 0.2s; box-shadow: 0 4px 6px rgba(14,165,233,0.2);" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">${confirmText}</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById('modal-confirm-btn').addEventListener('click', onConfirm);

  // Animate in
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    modal.style.transform = 'scale(1)';
  });
};

window.closeModal = function() {
  const overlay = document.getElementById('custom-modal-overlay');
  if(overlay) {
    overlay.style.opacity = '0';
    overlay.children[0].style.transform = 'scale(0.95)';
    setTimeout(() => overlay.remove(), 250);
  }
};

window.openComplaintModal = function() {
  const content = `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Complaint Title</label>
        <input type="text" id="comp-title" placeholder="e.g. Broken pipe in lobby" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='var(--card-border)'">
      </div>
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Description</label>
        <textarea id="comp-desc" placeholder="Please provide more details..." rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s; resize: vertical;" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='var(--card-border)'"></textarea>
      </div>
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Category</label>
        <select id="comp-cat" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; background: white; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='var(--card-border)'">
          <option>Plumbing</option>
          <option>Electrical</option>
          <option>HVAC</option>
          <option>General</option>
        </select>
      </div>
    </div>
  `;
  window.openModal('Lodge New Complaint', content, () => {
    const title = document.getElementById('comp-title').value;
    const desc = document.getElementById('comp-desc').value;
    const cat = document.getElementById('comp-cat').value;
    if(!title.trim()) {
      if(window.showToast) window.showToast('Please enter a complaint title', 'error');
      return;
    }

    const btn = document.getElementById('modal-confirm-btn');
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Submitting...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      let data = JSON.parse(localStorage.getItem('complaints') || '[]');
      data.unshift({
        id: Date.now(),
        title: title,
        description: desc,
        category: cat,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}).replace(/ /g, 'th ').replace('th th', 'th ')
      });
      localStorage.setItem('complaints', JSON.stringify(data));
      loadComplaints();
      if(window.showToast) window.showToast('Complaint submitted successfully!', 'success');
      window.closeModal();
    }, 600);
  }, 'Submit Complaint');
};

window.bookAmenity = function(id) {
  let data = JSON.parse(localStorage.getItem('amenities') || '[]');
  let item = data.find(d => d.id === id);
  if(!item) return;

  const content = `
    <div style="background: var(--bg-main); padding: 1rem; border-radius: 0.5rem; border: 1px dashed var(--card-border); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem;">
      <div style="background: white; padding: 0.5rem; border-radius: 0.35rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        <i class="ph ph-calendar-check" style="font-size: 1.5rem; color: #10b981;"></i>
      </div>
      <div>
        <p style="margin:0; font-weight: 600; font-size: 0.95rem; color: var(--text-main);">${item.title}</p>
        <p style="margin:0; font-size: 0.8rem; color: var(--text-muted);">Standard Hours: ${item.timing}</p>
      </div>
    </div>
    <div>
      <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Available Time Slots</label>
      <select id="am-slot" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; background: white; font-size: 0.95rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='var(--card-border)'">
        <option>Morning Slot (8:00 AM - 10:00 AM)</option>
        <option>Afternoon Slot (2:00 PM - 4:00 PM)</option>
        <option>Evening Slot (6:00 PM - 8:00 PM)</option>
      </select>
    </div>
  `;
  
  window.openModal('Book Amenity Slot', content, () => {
    const slot = document.getElementById('am-slot').value;
    
    const btn = document.getElementById('modal-confirm-btn');
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Confirming...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      item.status = 'Booked';
      localStorage.setItem('amenities', JSON.stringify(data));
      loadAmenities();
      if(window.showToast) window.showToast(`${item.title} booked for ${slot.split(' ')[0]}!`, 'success');
      window.closeModal();
    }, 800);
  }, 'Confirm Booking');
};

window.participateEvent = function(id) {
  let data = JSON.parse(localStorage.getItem('events') || '[]');
  let item = data.find(d => d.id === id);
  if(!item) return;

  const content = `
    <div style="text-align: center; margin-bottom: 0.5rem;">
      <div style="background: #8b5cf615; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto;">
        <i class="ph ph-calendar-star" style="font-size: 2rem; color: #8b5cf6;"></i>
      </div>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 0;">
        You are about to RSVP for <strong style="color: var(--text-main);">${item.title}</strong>.<br>
        Will you be bringing any guests?
      </p>
    </div>
    <div style="margin-top: 1.5rem;">
      <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Number of Guests (Optional)</label>
      <input type="number" id="ev-guests" min="0" max="5" value="0" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#8b5cf6'" onblur="this.style.borderColor='var(--card-border)'">
    </div>
  `;
  
  window.openModal('RSVP to Event', content, () => {
    const guestsInput = document.getElementById('ev-guests').value;
    const guests = parseInt(guestsInput) || 0;
    const btn = document.getElementById('modal-confirm-btn');
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Confirming...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      item.isRsvpd = true;
      item.participants = (item.participants || 0) + 1 + guests;
      localStorage.setItem('events', JSON.stringify(data));
      loadEvents();
      if(window.showToast) window.showToast(`Successfully RSVP'd to ${item.title}!`, 'success');
      window.closeModal();
    }, 800);
  }, 'Confirm RSVP');
};

window.resolveComplaint = function(id) {
  let data = JSON.parse(localStorage.getItem('complaints') || '[]');
  let item = data.find(d => d.id === id);
  if(item) {
    item.status = 'Resolved';
    localStorage.setItem('complaints', JSON.stringify(data));
    loadComplaints();
    if(window.showToast) window.showToast(`Issue marked as Resolved.`, 'success');
  }
};

window.addMaintenanceModal = function() {
  const content = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Bill Month & Year</label>
        <input type="text" id="bill-title" placeholder="e.g. May 2026" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='var(--card-border)'">
      </div>
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Amount (₹) per flat</label>
        <input type="number" id="bill-amount" placeholder="e.g. 2500" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='var(--card-border)'">
      </div>
    </div>
  `;
  window.openModal('Generate Society Bill', content, () => {
    const title = document.getElementById('bill-title').value;
    const amt = document.getElementById('bill-amount').value;
    if(!title || !amt) {
      if(window.showToast) window.showToast('Please fill all fields', 'error');
      return;
    }
    
    const btn = document.getElementById('modal-confirm-btn');
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Generating...';
    btn.disabled = true;
    
    setTimeout(() => {
      let data = JSON.parse(localStorage.getItem('maintenances') || '[]');
      const amtInt = parseInt(amt);
      data.unshift({
        id: Date.now(),
        title: title,
        amount: '₹' + amtInt.toLocaleString('en-IN'),
        status: 'Pending',
        dueDate: '10th ' + title.split(' ')[0],
        base: '₹' + parseInt(amtInt*0.6).toLocaleString('en-IN'),
        sinking: '₹' + parseInt(amtInt*0.2).toLocaleString('en-IN'),
        parking: '₹' + parseInt(amtInt*0.2).toLocaleString('en-IN')
      });
      localStorage.setItem('maintenances', JSON.stringify(data));
      loadMaintenance();
      if(window.showToast) window.showToast('Maintenance bill generated for all flats!', 'success');
      window.closeModal();
    }, 600);
  }, 'Generate Bills');
};

window.openAddEventModal = function() {
  const content = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Event Name</label>
        <input type="text" id="ev-title" placeholder="e.g. Diwali Celebration" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s;">
      </div>
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Location</label>
        <input type="text" id="ev-loc" placeholder="e.g. Main Garden" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s;">
      </div>
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Date & Time</label>
        <input type="text" id="ev-date" placeholder="e.g. 1st Nov 2026, 6:00 PM" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s;">
      </div>
    </div>
  `;
  window.openModal('Create New Event', content, () => {
    const title = document.getElementById('ev-title').value;
    const loc = document.getElementById('ev-loc').value;
    const dt = document.getElementById('ev-date').value;
    if(!title || !loc || !dt) {
      if(window.showToast) window.showToast('Please fill all fields', 'error');
      return;
    }
    
    const btn = document.getElementById('modal-confirm-btn');
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Creating...';
    btn.disabled = true;

    setTimeout(() => {
      let data = JSON.parse(localStorage.getItem('events') || '[]');
      data.unshift({
        id: Date.now(),
        title: title,
        location: loc,
        status: 'Upcoming',
        date: dt,
        isRsvpd: false,
        participants: 0
      });
      localStorage.setItem('events', JSON.stringify(data));
      loadEvents();
      if(window.showToast) window.showToast('Event created successfully!', 'success');
      window.closeModal();
    }, 600);
  }, 'Create Event');
};

window.deleteItem = function(storageKey, id, reloadFuncName) {
  if (confirm('Are you certain you want to permanently delete this item?')) {
    let data = JSON.parse(localStorage.getItem(storageKey) || '[]');
    data = data.filter(d => d.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(data));
    if(window[reloadFuncName]) {
      window[reloadFuncName]();
    }
    if(window.showToast) window.showToast('Item successfully deleted', 'success');
  }
};

window.resetAmenity = function(id) {
  if (confirm('Clear the current booking for this amenity?')) {
    let data = JSON.parse(localStorage.getItem('amenities') || '[]');
    let item = data.find(d => d.id === id);
    if(item) {
      item.status = 'Available';
      localStorage.setItem('amenities', JSON.stringify(data));
      if(window.loadAmenities) window.loadAmenities();
      if(window.showToast) window.showToast('Booking cleared successfully', 'success');
    }
  }
};

window.openAddNoticeModal = function() {
  const content = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Notice Title</label>
        <input type="text" id="nt-title" placeholder="e.g. Scheduled Power Outage" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s;">
      </div>
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Category</label>
        <select id="nt-type" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; background: white;">
          <option value="Update">General Update</option>
          <option value="Alert">Urgent Alert</option>
          <option value="Guideline">New Guideline</option>
        </select>
      </div>
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Details / Preview</label>
        <textarea id="nt-preview" placeholder="Enter the notice details here..." rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; resize: vertical; transition: border-color 0.2s;"></textarea>
      </div>
    </div>
  `;
  window.openModal('Broadcast Notice', content, () => {
    const title = document.getElementById('nt-title').value;
    const type = document.getElementById('nt-type').value;
    const preview = document.getElementById('nt-preview').value;
    if(!title || !preview) return window.showToast && window.showToast('Please fill all fields', 'error');
    
    const btn = document.getElementById('modal-confirm-btn');
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Broadcasting...';
    btn.disabled = true;

    setTimeout(() => {
      let data = JSON.parse(localStorage.getItem('notices') || '[]');
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      data.unshift({
        id: Date.now(),
        title: title,
        type: type,
        date: dateStr,
        preview: preview
      });
      localStorage.setItem('notices', JSON.stringify(data));
      loadNotices();
      if(window.showToast) window.showToast('Notice published successfully!', 'success');
      window.closeModal();
    }, 600);
  }, 'Publish');
};

window.openAddReportModal = function() {
  const content = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Report Title</label>
        <input type="text" id="rp-title" placeholder="e.g. Audit Report 2026" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none;">
      </div>
      <div style="display: flex; gap: 1rem;">
        <div style="flex: 1;">
          <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Format</label>
          <select id="rp-fmt" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; background: white;">
            <option value="PDF">PDF Document</option>
            <option value="Excel">Excel Spreadsheet</option>
          </select>
        </div>
        <div style="flex: 1;">
          <label style="display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-muted);">Frequency</label>
          <select id="rp-type" style="width: 100%; padding: 0.75rem; border: 1px solid var(--card-border); border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; outline: none; background: white;">
            <option value="Monthly Report">Monthly</option>
            <option value="Quarterly Report">Quarterly</option>
            <option value="Yearly Report">Yearly</option>
          </select>
        </div>
      </div>
    </div>
  `;
  window.openModal('Upload Society Report', content, () => {
    const title = document.getElementById('rp-title').value;
    const type = document.getElementById('rp-type').value;
    const fmt = document.getElementById('rp-fmt').value;
    if(!title) return window.showToast && window.showToast('Please enter a title', 'error');
    
    const btn = document.getElementById('modal-confirm-btn');
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Uploading...';
    btn.disabled = true;

    setTimeout(() => {
      let data = JSON.parse(localStorage.getItem('reports') || '[]');
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const sizeStr = (Math.random() * 2 + 0.1).toFixed(1) + ' MB';
      data.unshift({
        id: Date.now(),
        title: title,
        type: type,
        date: dateStr,
        format: fmt,
        size: sizeStr
      });
      localStorage.setItem('reports', JSON.stringify(data));
      loadReports();
      if(window.showToast) window.showToast('Report uploaded & published!', 'success');
      window.closeModal();
    }, 800);
  }, 'Upload');
};