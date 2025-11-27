const API_BASE_URL = 'http://localhost:5000/api';
const state = {
  token: localStorage.getItem('pcn_token') || null,
  user: null,
  vehicles: [],
  reservations: []
};

const formatCurrency = (value) =>
  typeof value === 'number' ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0';

const setStatus = (elementId, message, type = 'info') => {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.style.color = type === 'error' ? '#f79ca5' : '#9fb2d3';
};

const authorizedHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  return headers;
};

const fetchVehicles = async (query = {}) => {
  try {
    const params = new URLSearchParams(query);
    const endpoint = params.toString() ? `/vehicles/filter?${params}` : '/vehicles';
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error('Unable to load vehicles');
    const data = await response.json();
    state.vehicles = data;
    renderVehicles();
    refreshInventoryMetrics();
  } catch (error) {
    document.getElementById('inventoryList').innerHTML = '<p class="small">Unable to reach the backend right now.</p>';
    setStatus('statusMessage', 'Connect the backend to populate the live catalog.', 'error');
  }
};

const renderVehicles = () => {
  const container = document.getElementById('inventoryList');
  container.innerHTML = '';
  if (!state.vehicles.length) {
    container.innerHTML = '<p class="small">No vehicles found. Try broadening your filters.</p>';
    return;
  }

  state.vehicles.forEach((vehicle) => {
    const card = document.createElement('article');
    card.className = 'card vehicle-card';
    card.innerHTML = `
      <p class="eyebrow">${vehicle.category || 'Vehicle'}</p>
      <h4>${vehicle.make || 'Unknown'} ${vehicle.model || ''}</h4>
      <div class="vehicle-meta">
        <span>${vehicle.year || '—'} • ${vehicle.color || 'Color TBD'}</span>
        <span>${vehicle.status || 'Unknown status'}</span>
        <span>ID: ${vehicle.id || vehicle._id || 'n/a'}</span>
      </div>
      <p class="vehicle-price">${formatCurrency(vehicle.sellingPrice ?? vehicle.price)}</p>
      <p class="small">Mileage: ${vehicle.mileage ?? 'n/a'} • Stock: ${vehicle.stock ?? 'n/a'}</p>
    `;
    container.appendChild(card);
  });
};

const refreshInventoryMetrics = () => {
  if (!state.vehicles.length) return;
  const available = state.vehicles.filter((v) => v.status === 'AVAILABLE' || v.status === 'Available');
  const avgPriceValue = state.vehicles.reduce((sum, v) => sum + (v.sellingPrice ?? v.price ?? 0), 0) / state.vehicles.length;
  document.getElementById('availableCount').textContent = available.length;
  document.getElementById('avgPrice').textContent = formatCurrency(avgPriceValue);
  document.getElementById('hybridCount').textContent = state.vehicles.filter((v) => /hybrid/i.test(v.fuelType || v.category || '')).length;
  document.getElementById('evCount').textContent = state.vehicles.filter((v) => /ev|electric/i.test(v.fuelType || v.category || '')).length;
  document.getElementById('performanceCount').textContent = state.vehicles.filter((v) => /sport|performance/i.test(v.category || v.model || '')).length;
};

const fetchLowStock = async () => {
  if (!state.token) return;
  try {
    const res = await fetch(`${API_BASE_URL}/vehicles/low-stock`, { headers: authorizedHeaders() });
    if (!res.ok) throw new Error('Unable to fetch low-stock data');
    const data = await res.json();
    document.getElementById('thresholdValue').textContent = data.threshold;
    document.getElementById('lowStockCount').textContent = data.vehicles.length;
    const list = document.getElementById('lowStockList');
    list.innerHTML = '';
    data.vehicles.forEach((vehicle) => {
      const item = document.createElement('li');
      item.className = 'pill';
      item.textContent = `${vehicle.make} ${vehicle.model} (${vehicle.stock} left)`;
      list.appendChild(item);
    });
    setStatus('statusMessage', 'Low stock pulled from /api/vehicles/low-stock');
  } catch (error) {
    setStatus('statusMessage', 'Low stock requires an authenticated staff or manager token.', 'error');
  }
};

const register = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Unable to register');
  return res.json();
};

const login = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  return res.json();
};

const loadProfile = async () => {
  if (!state.token) return;
  const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: authorizedHeaders() });
  if (!res.ok) throw new Error('Unable to load profile');
  const data = await res.json();
  state.user = data.user;
  updateAuthUI();
};

const reserveVehicle = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers: authorizedHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Reservation failed');
  return res.json();
};

const loadMyReservations = async () => {
  if (!state.token) return;
  const res = await fetch(`${API_BASE_URL}/reservations/my`, { headers: authorizedHeaders() });
  if (!res.ok) throw new Error('Unable to load reservations');
  state.reservations = await res.json();
  renderReservations();
};

const renderReservations = () => {
  const container = document.getElementById('myReservations');
  container.innerHTML = '';
  if (!state.reservations.length) {
    container.innerHTML = '<p class="small">No reservations yet. Submit one to see it appear here.</p>';
    return;
  }
  state.reservations.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <p class="eyebrow">${item.status || 'Pending'}</p>
      <h4>Vehicle ${item.vehicleId}</h4>
      <p class="small">${item.notes || 'No notes provided'}</p>
    `;
    container.appendChild(card);
  });
};

const updateAuthUI = () => {
  const badge = document.getElementById('userBadge');
  if (state.user) {
    badge.textContent = `${state.user.email} (${state.user.role})`;
    badge.classList.remove('muted');
  } else {
    badge.textContent = 'Guest';
    badge.classList.add('muted');
  }
};

const attachListeners = () => {
  const filterForm = document.getElementById('filterForm');
  filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(filterForm));
    fetchVehicles(Object.fromEntries(Object.entries(data).filter(([_, value]) => value)));
  });

  document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const payload = Object.fromEntries(new FormData(form));
    try {
      const user = await register(payload);
      setStatus('registerStatus', `Welcome, ${user.name}. You can now log in.`);
      form.reset();
    } catch (error) {
      setStatus('registerStatus', error.message, 'error');
    }
  });

  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const payload = Object.fromEntries(new FormData(form));
    try {
      const { token } = await login(payload);
      state.token = token;
      localStorage.setItem('pcn_token', token);
      setStatus('loginStatus', 'Token stored. Loading profile...');
      await loadProfile();
      await fetchLowStock();
      await loadMyReservations();
    } catch (error) {
      setStatus('loginStatus', error.message, 'error');
    }
  });

  document.getElementById('reservationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.token) {
      setStatus('reservationStatus', 'Please log in first.', 'error');
      return;
    }
    const form = event.target;
    const payload = Object.fromEntries(new FormData(form));
    try {
      await reserveVehicle(payload);
      setStatus('reservationStatus', 'Reservation submitted.');
      form.reset();
      await loadMyReservations();
    } catch (error) {
      setStatus('reservationStatus', error.message, 'error');
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    state.token = null;
    state.user = null;
    state.reservations = [];
    localStorage.removeItem('pcn_token');
    updateAuthUI();
    renderReservations();
    setStatus('loginStatus', 'Signed out.');
  });
};

const hydrateFromStorage = async () => {
  if (state.token) {
    try {
      await loadProfile();
      await fetchLowStock();
      await loadMyReservations();
    } catch (error) {
      state.token = null;
      localStorage.removeItem('pcn_token');
    }
  }
};

const init = async () => {
  attachListeners();
  await hydrateFromStorage();
  await fetchVehicles();
};

init();
