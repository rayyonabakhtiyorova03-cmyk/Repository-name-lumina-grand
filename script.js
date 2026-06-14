const roomPrices = {
    'deluxe-ocean': 450,
    'presidency': 1200,
    'garden-vista': 320,
    'skyline': 580,
    'royal': 2500,
    'heritage': 280
};

const roomDetails = {
    'deluxe-ocean': {
        name: 'Deluxe Ocean Suite',
        price: 450,
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=600'
    },
    'presidency': {
        name: 'Presidency Suite',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600'
    },
    'garden-vista': {
        name: 'Garden Vista Room',
        price: 320,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600'
    },
    'skyline': {
        name: 'Skyline Executive',
        price: 580,
        image: 'https://images.unsplash.com/photo-1560185128-e173042f79dd?q=80&w=600'
    },
    'royal': {
        name: 'Royal Penthouse',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=600'
    },
    'heritage': {
        name: 'Heritage Studio',
        price: 280,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600'
    }
};

// ── API helpers ────────────────────────────────────────────────
const API_BASE = 'http://localhost:3000';

async function getBookings() {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
}

async function createBooking(booking) {
    const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
    });
    if (!res.ok) throw new Error('Failed to create booking');
    return res.json();
}

async function updateBooking(id, changes) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes)
    });
    if (!res.ok) throw new Error('Failed to update booking');
    return res.json();
}

async function deleteBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete booking');
    return res.json();
}

function injectCustomModal() {
    if (document.getElementById('custom-alert-modal')) return;
    const modalHTML = `
        <div id="custom-alert-modal" class="custom-modal-overlay">
            <div class="custom-modal-container">
                <div class="custom-modal-header">
                    <span class="custom-modal-title">Lumina Grand</span>
                    <button class="custom-modal-close" onclick="closeCustomModal()">&times;</button>
                </div>
                <div class="custom-modal-body" id="custom-alert-message"></div>
                <div class="custom-modal-footer">
                    <button class="btn btn-primary" onclick="closeCustomModal()">OK</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add overlay click listener to close modal
    const modal = document.getElementById('custom-alert-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCustomModal();
        }
    });

    // Add Escape key listener to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCustomModal();
        }
    });
}

function showModal(message) {
    injectCustomModal();
    const modal = document.getElementById('custom-alert-modal');
    const msgEl = document.getElementById('custom-alert-message');
    if (!modal || !msgEl) return;

    msgEl.textContent = message;
    modal.style.display = 'flex';
    // Force reflow
    modal.offsetHeight;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Make globally accessible
window.showModal = showModal;

function closeCustomModal() {
    const modal = document.getElementById('custom-alert-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    setTimeout(() => {
        if (!modal.classList.contains('active')) {
            modal.style.display = 'none';
        }
    }, 300);
}

// Make globally accessible
window.closeCustomModal = closeCustomModal;

function getDeactivatedRooms() {
    let deactivated = [];
    const deactivatedStr = localStorage.getItem('deactivatedRooms');
    if (deactivatedStr) {
        try {
            deactivated = JSON.parse(deactivatedStr);
        } catch (e) {
            deactivated = [];
        }
    }
    return deactivated;
}

function saveDeactivatedRooms(deactivated) {
    localStorage.setItem('deactivatedRooms', JSON.stringify(deactivated));
}


function hideDeactivatedRoomsOnBooking() {
    const roomSelect = document.getElementById('room-type');
    if (!roomSelect) return;
    const deactivated = getDeactivatedRooms();
    Array.from(roomSelect.options).forEach(option => {
        if (deactivated.includes(option.value)) {
            option.remove();
        }
    });
}

// Date parsing and formatting utilities
function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseLocalDate(dateStr) {
    return new Date(dateStr + 'T00:00:00');
}

function formatDate(dateStr) {
    const date = parseLocalDate(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatPeriod(checkInStr, checkOutStr) {
    const start = parseLocalDate(checkInStr);
    const end = parseLocalDate(checkOutStr);
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const endDay = end.getDate();
    const year = start.getFullYear();

    if (startMonth === endMonth) {
        return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    } else {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
}

function getBookingDisplayStatus(booking) {
    if (booking.status === 'Pending') {
        return { text: 'Pending', cssClass: 'pending-status' };
    }
    if (booking.status === 'Cancelled') {
        return { text: 'Cancelled', cssClass: 'cancelled-status' };
    }
    if (booking.status === 'Rejected') {
        return { text: 'Rejected', cssClass: 'cancelled-status' };
    }

    const todayStr = getLocalDateString();
    const today = parseLocalDate(todayStr);
    const checkIn = parseLocalDate(booking.checkIn);
    const checkOut = parseLocalDate(booking.checkOut);

    if (today >= checkIn && today <= checkOut) {
        return { text: 'Active', cssClass: 'active-status' };
    } else if (today < checkIn) {
        return { text: 'Upcoming', cssClass: 'upcoming-status' };
    } else {
        return { text: 'Completed', cssClass: 'completed-status' };
    }
}

// Navigation scroll styling logic
window.addEventListener('scroll', function () {
    const header = document.getElementById('main-nav');
    if (!header) return;

    const isIndexPage = !document.body.classList.contains('bg-beige') &&
                        !window.location.pathname.includes('booking') &&
                        !window.location.pathname.includes('dashboard') &&
                        !window.location.pathname.includes('admin');

    if (isIndexPage) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    } else {
        header.classList.add('scrolled');
    }
});

// Run header init style immediately
const initHeader = () => {
    const header = document.getElementById('main-nav');
    if (!header) return;
    const isIndexPage = !document.body.classList.contains('bg-beige') &&
                        !window.location.pathname.includes('booking') &&
                        !window.location.pathname.includes('dashboard') &&
                        !window.location.pathname.includes('admin');
    if (!isIndexPage) {
        header.classList.add('scrolled');
    }
};
document.addEventListener('DOMContentLoaded', initHeader);
initHeader();

// Room Key mapping helper
function getRoomKeyFromTitle(title) {
    const t = title.toLowerCase();
    if (t.includes('ocean')) return 'deluxe-ocean';
    if (t.includes('presidency')) return 'presidency';
    if (t.includes('garden')) return 'garden-vista';
    if (t.includes('skyline')) return 'skyline';
    if (t.includes('royal')) return 'royal';
    if (t.includes('heritage')) return 'heritage';
    return '';
}

// Modal Popup Details Logic (index.html)
const modal = document.getElementById('room-modal');
const modalCloseBtns = document.querySelectorAll('.modal-close, .close-modal');
const viewDetailsBtns = document.querySelectorAll('.room-card .btn-outline');

if (modal) {
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.room-card');
            const title = card.querySelector('h3').textContent;
            const img = card.querySelector('img').src;
            const desc = card.querySelector('.room-desc').textContent;
            const price = card.querySelector('.price').innerHTML;

            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-img').src = img;
            document.getElementById('modal-description').textContent = desc;
            document.getElementById('modal-price').innerHTML = price;

            // Set specific room views
            const viewLi = document.getElementById('modal-view');
            if (title.toLowerCase().includes('ocean')) {
                viewLi.textContent = 'Panoramic Ocean View';
            } else if (title.toLowerCase().includes('garden')) {
                viewLi.textContent = 'Serene Garden View';
            } else {
                viewLi.textContent = 'Stunning City View';
            }

            // Update modal book now link with room parameter
            const roomKey = getRoomKeyFromTitle(title);
            const bookNowBtn = modal.querySelector('.modal-actions a.btn-primary');
            if (bookNowBtn) {
                bookNowBtn.href = `booking.html?room=${roomKey}`;
                bookNowBtn.onclick = () => {
                    localStorage.setItem('selectedRoom', roomKey);
                };
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Live Pricing Summary (booking.html)
function updateSummary() {
    const roomSelect = document.getElementById('room-type');
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const summaryRoom = document.getElementById('summary-room');
    const summaryNights = document.getElementById('summary-nights');
    const summaryTotal = document.getElementById('summary-total');

    if (!roomSelect || !checkInInput || !checkOutInput) return;

    const roomValue = roomSelect.value;
    const checkInVal = checkInInput.value;
    const checkOutVal = checkOutInput.value;

    if (!roomValue) {
        summaryRoom.textContent = "-";
    } else {
        summaryRoom.textContent = roomDetails[roomValue] ? roomDetails[roomValue].name : "-";
    }

    if (!checkInVal || !checkOutVal) {
        summaryNights.textContent = "0";
        summaryTotal.textContent = "$0";
        return;
    }

    const checkIn = parseLocalDate(checkInVal);
    const checkOut = parseLocalDate(checkOutVal);

    if (checkOut <= checkIn) {
        summaryNights.textContent = "0";
        summaryTotal.textContent = "$0";
        return;
    }

    const timeDiff = checkOut - checkIn;
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    summaryNights.textContent = nights;

    if (roomValue && roomPrices[roomValue]) {
        const total = roomPrices[roomValue] * nights;
        summaryTotal.textContent = `$${total.toLocaleString()}`;
    }
}

// Booking Page Logic (booking.html)
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    // Disable HTML5 validation tooltips to let our custom JS alert validation run instead
    bookingForm.setAttribute('novalidate', '');

    const roomSelect = document.getElementById('room-type');
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const errorDiv = document.getElementById('error-message');

    // Attach summary listeners
    roomSelect.addEventListener('change', updateSummary);
    checkInInput.addEventListener('change', updateSummary);
    checkOutInput.addEventListener('change', updateSummary);

    // Set check-in date rules dynamically
    const todayStr = getLocalDateString();
    checkInInput.min = todayStr;
    checkOutInput.min = todayStr;

    checkInInput.addEventListener('change', () => {
        if (checkInInput.value) {
            checkOutInput.min = checkInInput.value;
            if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
                checkOutInput.value = '';
            }
        }
        updateSummary();
    });

    // Check query parameters to pre-fill room
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room') || localStorage.getItem('selectedRoom');
    if (roomParam && roomSelect) {
        roomSelect.value = roomParam;
        updateSummary();
        localStorage.removeItem('selectedRoom');
    }

    // Submit handler
    bookingForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const room = roomSelect.value;
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;

        // Custom validation error displaying for empty fields
        if (!name) {
            showError("Full Name is required. Please enter your name.");
            return;
        }
        if (!checkIn) {
            showError("Check-in Date is required. Please select a date.");
            return;
        }
        if (!checkOut) {
            showError("Check-out Date is required. Please select a date.");
            return;
        }
        if (!room) {
            showError("Please choose a room or suite.");
            return;
        }

        const checkInDate = parseLocalDate(checkIn);
        const checkOutDate = parseLocalDate(checkOut);
        const todayDate = parseLocalDate(todayStr);

        if (checkInDate < todayDate) {
            showError("Check-in date cannot be in the past.");
            return;
        }

        if (checkOutDate <= checkInDate) {
            showError("Check-out date must be after the check-in date.");
            return;
        }

        // Calculation
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const total = nights * roomPrices[room];

        const newBooking = {
            id: 'LG-' + Math.floor(1000 + Math.random() * 9000),
            name: name,
            room: room,
            checkIn: checkIn,
            checkOut: checkOut,
            nights: nights,
            total: total,
            status: 'Pending'
        };

        try {
            await createBooking(newBooking);
            // Hide errors and redirect
            errorDiv.style.display = 'none';
            window.location.href = "dashboard.html";
        } catch (err) {
            showError('Could not save your booking. Make sure the server is running.');
        }
    });

    function showError(msg) {
        showModal(msg);
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// User Dashboard Logic (dashboard.html)
async function renderDashboard() {
    const bookingsContainer = document.getElementById('booking-cards-container');
    if (!bookingsContainer) return;

    let bookings;
    try {
        bookings = await getBookings();
    } catch (err) {
        bookingsContainer.innerHTML = `<div class="no-bookings"><h3>Could not load bookings</h3><p>Make sure the server is running on localhost:3000.</p></div>`;
        return;
    }

    if (bookings.length === 0) {
        bookingsContainer.innerHTML = `
            <div class="no-bookings">
                <h3>No Reservations Found</h3>
                <p>Experience Lumina Grand's unparalleled luxury. Book your first stay today.</p>
                <a href="booking.html" class="btn btn-primary">Book Now</a>
            </div>
        `;
        return;
    }

    bookingsContainer.innerHTML = '';

    // Render bookings newest first
    bookings.slice().reverse().forEach(booking => {
        const details = roomDetails[booking.room];
        if (!details) return;

        const display = getBookingDisplayStatus(booking);

        let actionButtonsHTML = '';
        if (display.text === 'Pending' || display.text === 'Upcoming') {
            actionButtonsHTML = `
                <button class="btn btn-outline btn-sm manage-btn" data-id="${booking.id}" data-room="${booking.room}" data-name="${booking.name}" data-checkin="${booking.checkIn}" data-checkout="${booking.checkOut}" data-total="${booking.total}" data-nights="${booking.nights}" data-status="${booking.status}">Manage</button>
                <button class="btn-text cancel-btn" data-id="${booking.id}" data-room="${booking.room}">Cancel Booking</button>
            `;
        } else if (display.text === 'Active') {
            actionButtonsHTML = `
                <button class="btn btn-outline btn-sm manage-btn" data-id="${booking.id}" data-room="${booking.room}" data-name="${booking.name}" data-checkin="${booking.checkIn}" data-checkout="${booking.checkOut}" data-total="${booking.total}" data-nights="${booking.nights}" data-status="${booking.status}">Manage</button>
            `;
        } else { // Completed, Cancelled, Rejected
            actionButtonsHTML = `
                <button class="btn btn-primary btn-sm rebook-btn" data-id="${booking.id}" data-room="${booking.room}">Rebook</button>
            `;
        }

        const card = document.createElement('div');
        card.className = `dashboard-card ${booking.status === 'Cancelled' || booking.status === 'Rejected' ? 'cancelled' : ''}`;
        card.innerHTML = `
            <div class="card-image">
                <img src="${details.image}" alt="${details.name}">
                <span class="status-tag ${display.cssClass}">${display.text}</span>
            </div>
            <div class="card-details">
                <div class="card-title-group">
                    <h3>${details.name}</h3>
                    <span class="booking-id">#${booking.id}</span>
                </div>
                <div class="booking-period">
                    <div class="date-item">
                        <span class="label">Check-in</span>
                        <span class="value">${formatDate(booking.checkIn)}</span>
                    </div>
                    <div class="date-item">
                        <span class="label">Check-out</span>
                        <span class="value">${formatDate(booking.checkOut)}</span>
                    </div>
                    <div class="date-item">
                        <span class="label">Total Amount</span>
                        <span class="value">$${booking.total.toLocaleString()} (${booking.nights} nights)</span>
                    </div>
                </div>
                <div class="card-actions">
                    ${actionButtonsHTML}
                </div>
            </div>
        `;
        bookingsContainer.appendChild(card);
    });

    // Attach listeners on dynamically generated buttons
    bookingsContainer.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            const roomKey = btn.getAttribute('data-room');
            const roomName = roomDetails[roomKey] ? roomDetails[roomKey].name : roomKey;
            if (confirm(`Are you sure you want to cancel your stay in the ${roomName}?`)) {
                try {
                    await updateBooking(id, { status: 'Cancelled' });
                    await renderDashboard();
                    showModal(`Booking #${id} for ${roomName} has been successfully cancelled.`);
                } catch (err) {
                    showModal('Failed to cancel booking. Please try again.');
                }
            }
        });
    });

    bookingsContainer.querySelectorAll('.rebook-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const roomKey = btn.getAttribute('data-room');
            if (roomKey) {
                localStorage.setItem('selectedRoom', roomKey);
                window.location.href = `booking.html?room=${roomKey}`;
            }
        });
    });

    bookingsContainer.querySelectorAll('.manage-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id  = btn.getAttribute('data-id');
            const roomKey = btn.getAttribute('data-room');
            const name = btn.getAttribute('data-name');
            const checkIn = btn.getAttribute('data-checkin');
            const checkOut = btn.getAttribute('data-checkout');
            const total = btn.getAttribute('data-total');
            const nights = btn.getAttribute('data-nights');
            const status = btn.getAttribute('data-status');
            const roomName = roomDetails[roomKey] ? roomDetails[roomKey].name : roomKey;
            showModal(`Reservation Details #${id}\nGuest: ${name}\nRoom: ${roomName}\nCheck-in: ${formatDate(checkIn)}\nCheck-out: ${formatDate(checkOut)}\nTotal: $${Number(total).toLocaleString()}\nStatus: ${status}\n\nOur concierge service has curated exclusive amenities for your stay. To request dates modifications, pre-arrival room setups, or custom experiences, please contact our Guest Relations at concierge@luminagrand.com.`);
        });
    });
}

// Admin Panel Logic (admin.html)
const roomCategories = {
    'deluxe-ocean': 'Suite',
    'presidency': 'Penthouse',
    'garden-vista': 'Standard',
    'skyline': 'Executive',
    'royal': 'Penthouse',
    'heritage': 'Studio'
};

async function renderAdmin() {
    const adminContainer = document.getElementById('admin-bookings-container');
    if (!adminContainer) return;

    let bookings;
    try {
        bookings = await getBookings();
    } catch (err) {
        adminContainer.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted)">Could not reach server. Make sure it is running on localhost:3000.</div>`;
        return;
    }

    if (bookings.length === 0) {
        adminContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 0.95rem;">
                No bookings in the system database.
            </div>
        `;
        renderAdminRooms(bookings);
        return;
    }

    adminContainer.innerHTML = '';

    // Render bookings newest first
    bookings.slice().reverse().forEach(booking => {
        const details = roomDetails[booking.room];
        if (!details) return;

        let statusPillClass = 'pending';
        if (booking.status === 'Confirmed') statusPillClass = 'confirmed';
        if (booking.status === 'Rejected') statusPillClass = 'rejected';
        if (booking.status === 'Cancelled') statusPillClass = 'cancelled';

        let actionButtonsHTML = '';
        if (booking.status === 'Pending') {
            actionButtonsHTML = `
                <button class="action-btn approve" data-id="${booking.id}">Approve</button>
                <button class="action-btn reject" data-id="${booking.id}">Reject</button>
                <button class="action-btn delete" data-id="${booking.id}">Delete</button>
            `;
        } else {
            actionButtonsHTML = `
                <button class="action-btn delete" data-id="${booking.id}">Delete</button>
            `;
        }

        const row = document.createElement('div');
        row.className = 'booking-row';
        row.innerHTML = `
            <div class="booking-main">
                <span class="customer-name">${booking.name}</span>
                <span class="booking-room">${details.name} (#${booking.id})</span>
            </div>
            <div class="booking-dates">
                <span>${formatPeriod(booking.checkIn, booking.checkOut)}</span>
            </div>
            <div class="booking-amount">
                <span>$${booking.total.toLocaleString()}</span>
            </div>
            <div class="booking-status">
                <span class="status-pill ${statusPillClass}">${booking.status}</span>
            </div>
            <div class="booking-actions">
                ${actionButtonsHTML}
            </div>
        `;
        adminContainer.appendChild(row);
    });

    // Attach listeners on dynamic admin actions
    adminContainer.querySelectorAll('.approve').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            try {
                await updateBooking(id, { status: 'Confirmed' });
                await renderAdmin();
                showModal(`Booking #${id} has been approved.`);
            } catch (err) {
                showModal('Failed to approve booking. Please try again.');
            }
        });
    });

    adminContainer.querySelectorAll('.reject').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            try {
                await updateBooking(id, { status: 'Rejected' });
                await renderAdmin();
                showModal(`Booking #${id} has been rejected.`);
            } catch (err) {
                showModal('Failed to reject booking. Please try again.');
            }
        });
    });

    adminContainer.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            if (confirm(`Permanently delete reservation #${id}?`)) {
                try {
                    await deleteBooking(id);
                    await renderAdmin();
                    showModal(`Booking #${id} has been deleted.`);
                } catch (err) {
                    showModal('Failed to delete booking. Please try again.');
                }
            }
        });
    });

    // Update the room occupancy table statuses
    renderAdminRooms(bookings);
}

function renderAdminRooms(bookings = []) {
    const tableBody = document.querySelector('.admin-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    const todayStr = getLocalDateString();
    const today = parseLocalDate(todayStr);
    const deactivated = getDeactivatedRooms();

    for (const key in roomDetails) {
        if (deactivated.includes(key)) continue;

        const room = roomDetails[key];
        const category = roomCategories[key] || 'Standard';

        // Check active confirmed booking today
        const isOccupied = bookings.some(b => {
            if (b.room !== key || b.status !== 'Confirmed') return false;
            const checkIn = parseLocalDate(b.checkIn);
            const checkOut = parseLocalDate(b.checkOut);
            return today >= checkIn && today <= checkOut;
        });

        const statusHTML = isOccupied 
            ? `<span class="status-dot occupied"></span> Occupied`
            : `<span class="status-dot available"></span> Available`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="room-td">
                <img src="${room.image}" alt="${room.name}">
                <span>${room.name}</span>
            </td>
            <td>${category}</td>
            <td>$${room.price.toLocaleString()}/night</td>
            <td>${statusHTML}</td>
            <td class="actions-td">
                <button class="action-btn edit" data-key="${key}" title="Edit">Edit</button>
                <button class="action-btn delete" data-key="${key}" title="Delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    }

    // Attach room action listeners
    tableBody.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            const room = roomDetails[key];
            showModal(`Edit details for ${room.name}:\nThis feature is reserved for database administrators.`);
        });
    });

    tableBody.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            const room = roomDetails[key];
            if (confirm(`Are you sure you want to delete ${room.name} from active inventory?`)) {
                const deactivatedList = getDeactivatedRooms();
                if (!deactivatedList.includes(key)) {
                    deactivatedList.push(key);
                    saveDeactivatedRooms(deactivatedList);
                }
                showModal(`${room.name} has been deactivated.`);
                renderAdminRooms();
            }
        });
    });

    // Render the "Deactivated Rooms" section (with Restore buttons)
    renderDeactivatedRooms();
}

// Deactivated Rooms section (admin.html) - shows deactivated rooms with a Restore button
function renderDeactivatedRooms() {
    const adminTable = document.querySelector('.admin-table');
    if (!adminTable) return;
    const adminCard = adminTable.closest('.admin-card');
    if (!adminCard) return;

    const deactivated = getDeactivatedRooms();
    let section = document.getElementById('deactivated-rooms-section');

    if (deactivated.length === 0) {
        if (section) section.remove();
        return;
    }

    if (!section) {
        section = document.createElement('div');
        section.id = 'deactivated-rooms-section';
        section.style.marginTop = '30px';
        adminCard.appendChild(section);
    }

    section.innerHTML = `
        <h3 style="font-family: var(--font-serif); font-weight: 400; margin: 0 0 15px; color: var(--text-muted);">
            Deactivated Rooms
        </h3>
        <div class="admin-table">
            ${deactivated.map(key => {
                const room = roomDetails[key];
                if (!room) return '';
                return `
                    <div class="booking-row">
                        <div class="room-td">
                            <img src="${room.image}" alt="${room.name}">
                            <span>${room.name}</span>
                        </div>
                        <div></div>
                        <div>$${room.price.toLocaleString()}/night</div>
                        <div><span class="status-pill cancelled">Deactivated</span></div>
                        <div class="booking-actions">
                            <button class="action-btn approve restore-room" data-key="${key}">Restore</button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    section.querySelectorAll('.restore-room').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            const room = roomDetails[key];
            const list = getDeactivatedRooms().filter(k => k !== key);
            saveDeactivatedRooms(list);
            showModal(`${room.name} has been restored and is now available for booking.`);
            renderAdminRooms();
        });
    });
}

function initAdminTabs() {
    const adminContainer = document.getElementById('admin-bookings-container');
    if (!adminContainer) return;

    const sidebarLinks = document.querySelectorAll('.dashboard-sidebar .sidebar-nav a');
    if (!sidebarLinks.length) return;

    const headers = document.querySelectorAll('.dashboard-content .admin-header');
    const cards = document.querySelectorAll('.dashboard-content .admin-card');

    if (headers.length < 2 || cards.length < 2) return;

    const roomsHeader = headers[0];
    const roomsCard = cards[0];
    const bookingsHeader = headers[1];
    const bookingsCard = cards[1];

    let placeholderCard = document.getElementById('admin-placeholder-card');
    if (!placeholderCard) {
        placeholderCard = document.createElement('div');
        placeholderCard.id = 'admin-placeholder-card';
        placeholderCard.className = 'admin-card';
        placeholderCard.style.display = 'none';
        placeholderCard.style.textAlign = 'center';
        placeholderCard.style.padding = '60px 40px';
        placeholderCard.style.color = 'var(--text-muted)';
        bookingsCard.parentNode.appendChild(placeholderCard);
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const tabText = link.textContent.trim().toLowerCase();

            roomsHeader.style.display = 'none';
            roomsCard.style.display = 'none';
            bookingsHeader.style.display = 'none';
            bookingsCard.style.display = 'none';
            placeholderCard.style.display = 'none';

            if (tabText === 'rooms') {
                roomsHeader.style.display = 'flex';
                roomsCard.style.display = 'block';
            } else if (tabText === 'bookings') {
                bookingsHeader.style.display = 'flex';
                bookingsCard.style.display = 'block';
            } else if (tabText === 'customers') {
                placeholderCard.style.display = 'block';
                placeholderCard.innerHTML = `
                    <div style="font-size: 3rem; color: var(--gold); margin-bottom: 20px;">👤</div>
                    <h3 style="font-family: var(--font-serif); font-size: 1.8rem; font-weight: 400; margin-bottom: 10px;">Customer Database</h3>
                    <p style="margin-bottom: 0;">Access and manage registered guests and booking histories.</p>
                `;
            } else if (tabText === 'settings') {
                placeholderCard.style.display = 'block';
                placeholderCard.innerHTML = `
                    <div style="font-size: 3rem; color: var(--gold); margin-bottom: 20px;">⚙️</div>
                    <h3 style="font-family: var(--font-serif); font-size: 1.8rem; font-weight: 400; margin-bottom: 10px;">Admin Settings</h3>
                    <p style="margin-bottom: 0;">Configure booking rules, seasonal rates, and system preferences.</p>
                `;
            }
        });
    });

    const activeLink = document.querySelector('.dashboard-sidebar .sidebar-nav a.active');
    if (activeLink) {
        activeLink.click();
    }
}

function initDashboardTabs() {
    const bookingsContainer = document.getElementById('booking-cards-container');
    if (!bookingsContainer) return; // Only run on dashboard page

    const sidebarLinks = document.querySelectorAll('.dashboard-sidebar .sidebar-nav a');
    if (!sidebarLinks.length) return;

    const contentHeader = document.querySelector('.dashboard-content .content-header');
    
    // Create container/placeholder for other tabs
    let placeholderCard = document.getElementById('dashboard-placeholder-card');
    if (!placeholderCard) {
        placeholderCard = document.createElement('div');
        placeholderCard.id = 'dashboard-placeholder-card';
        placeholderCard.className = 'no-bookings'; // Use existing empty-state styling
        placeholderCard.style.display = 'none';
        bookingsContainer.parentNode.appendChild(placeholderCard);
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const tabText = link.textContent.trim().toLowerCase();

            // Default hide everything
            contentHeader.style.display = 'none';
            bookingsContainer.style.display = 'none';
            placeholderCard.style.display = 'none';

            if (tabText === 'my bookings') {
                contentHeader.style.display = 'block';
                bookingsContainer.style.display = 'flex';
            } else if (tabText === 'profile') {
                placeholderCard.style.display = 'block';
                placeholderCard.innerHTML = `
                    <div style="font-size: 3rem; color: var(--gold); margin-bottom: 20px;">👤</div>
                    <h3 style="font-family: var(--font-serif); font-size: 1.8rem; font-weight: 400; margin-bottom: 15px;">My Profile</h3>
                    <p style="margin-bottom: 25px; color: var(--text-muted);">Name: John Doe<br>Email: john.doe@example.com<br>Phone: +1 (555) 019-2834</p>
                    <button class="btn btn-primary" onclick="showModal('Profile updates are coming soon!')">Edit Profile</button>
                `;
            } else if (tabText === 'payments') {
                placeholderCard.style.display = 'block';
                placeholderCard.innerHTML = `
                    <div style="font-size: 3rem; color: var(--gold); margin-bottom: 20px;">💳</div>
                    <h3 style="font-family: var(--font-serif); font-size: 1.8rem; font-weight: 400; margin-bottom: 15px;">Payment Methods</h3>
                    <p style="margin-bottom: 25px; color: var(--text-muted);">Manage your saved cards and view transaction history.</p>
                    <button class="btn btn-primary" onclick="showModal('Payment gateway configuration is locked.')">Add Payment Method</button>
                `;
            } else if (tabText === 'settings') {
                placeholderCard.style.display = 'block';
                placeholderCard.innerHTML = `
                    <div style="font-size: 3rem; color: var(--gold); margin-bottom: 20px;">⚙️</div>
                    <h3 style="font-family: var(--font-serif); font-size: 1.8rem; font-weight: 400; margin-bottom: 15px;">Account Settings</h3>
                    <p style="margin-bottom: 25px; color: var(--text-muted);">Configure email notifications, security preferences, and password settings.</p>
                    <button class="btn btn-primary" onclick="showModal('Settings changes are restricted.')">Save Settings</button>
                `;
            }
        });
    });
}

function logout() {
    // Only clear session-related keys; bookings now live on the server
    sessionStorage.removeItem('isAdmin');
    window.location.href = "index.html";
}

// Bind logout links
document.querySelectorAll('.logout-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Page-specific renders
    if (document.getElementById('booking-cards-container')) {
        // IMPORTANT: await renderDashboard() first so cards are in the DOM
        // before initDashboardTabs() sets up handlers that can toggle display.
        await renderDashboard();
        initDashboardTabs();
    }
    
    if (document.getElementById('admin-bookings-container')) {
        await renderAdmin();
        initAdminTabs();

        // Connect the "+ Add New Room" button
        const addRoomBtn = document.querySelector('.admin-header .btn-primary');
        if (addRoomBtn && addRoomBtn.textContent.includes('Add New Room')) {
            addRoomBtn.addEventListener('click', () => {
                showModal('Add New Room:\nThis feature is reserved for database administrators.');
            });
        }
    }

    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            const errorDiv = document.getElementById('admin-login-error');
            
            if (!username || !password) {
                errorDiv.textContent = 'Please enter both username and password.';
                errorDiv.style.display = 'block';
                return;
            }
            
            if (username === 'admin' && password === '123456') {
                sessionStorage.setItem('isAdmin', 'true');
                window.location.replace('admin.html');
            } else {
                errorDiv.textContent = 'Invalid username or password.';
                errorDiv.style.display = 'block';
            }
        });
    }


    hideDeactivatedRoomsOnBooking();
});



async function registerUser(user) {
    const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    return res.json();
}

async function loginUser(email, password) {
    const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    return res.json();
}
