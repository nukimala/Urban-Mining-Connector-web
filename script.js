/* ====================================================
   URBAN MINING CONNECTOR — JavaScript
   Light Mode Redesign
   ==================================================== */

// ==========================================
// 1. NAVBAR — scroll effect & hamburger
// ==========================================
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();

// ==========================================
// 2. COUNTER ANIMATION
// ==========================================
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const isFloat  = target % 1 !== 0;
  const duration = 2200;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = target * eased;
    el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString('id-ID')) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = (isFloat ? target.toFixed(1) : target.toLocaleString('id-ID')) + suffix;
  }
  requestAnimationFrame(step);
}

// ==========================================
// 3. SCROLL REVEAL & COUNTER TRIGGER
// ==========================================
(function initReveal() {
  const revealEls  = document.querySelectorAll('.reveal-up');
  const counterEls = document.querySelectorAll('[data-target]');
  const counted    = new Set();

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !counted.has(e.target)) {
        counted.add(e.target);
        animateCounter(e.target);
      }
    });
  }, { threshold: 0.5 });

  revealEls.forEach(el => revealObs.observe(el));
  counterEls.forEach(el => counterObs.observe(el));
})();

// ==========================================
// 4. LEAFLET MAP
// ==========================================
(function initMap() {
  if (!window.L) return;
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  const isFullPage = document.body.classList.contains('map-page');

  const map = L.map('map', {
    center: [-2.5, 118],
    zoom: isFullPage ? 5 : 5,
    zoomControl: true,
    attributionControl: false,
    scrollWheelZoom: isFullPage,
  });

  if (!isFullPage) {
    mapEl.addEventListener('click', () => map.scrollWheelZoom.enable());
    mapEl.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());
  }

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  function makeIcon(color, size = 13) {
    return L.divIcon({
      html: `<div style="
        width:${size}px;height:${size}px;
        background:${color};border-radius:50%;
        border:2.5px solid #fff;
        box-shadow:0 0 10px ${color}88,0 2px 8px rgba(0,0,0,0.2);
      "></div>`,
      className: '',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  const locations = [
    { type: 'dropoff',   lat: -6.2088,  lng: 106.8456,  name: 'Drop-Off Jakarta Pusat',     address: 'Jl. MH Thamrin, Jakarta Pusat',      info: 'Semua perangkat kecil' },
    { type: 'dropoff',   lat: -6.1791,  lng: 106.8283,  name: 'Drop-Off Kemayoran',          address: 'Mal Kemayoran, Jakarta Utara',        info: 'HP, Tablet, Charger' },
    { type: 'dropoff',   lat: -6.9175,  lng: 107.6191,  name: 'Drop-Off Bandung Kota',       address: 'Jl. Asia Afrika, Bandung',            info: 'Semua elektronik kecil' },
    { type: 'dropoff',   lat: -7.2575,  lng: 112.7521,  name: 'Drop-Off Surabaya Pusat',     address: 'Jl. Pemuda, Surabaya',               info: 'HP, Laptop, Baterai' },
    { type: 'dropoff',   lat: -7.7956,  lng: 110.3695,  name: 'Drop-Off Yogyakarta',         address: 'Jl. Malioboro, Yogyakarta',           info: 'Perangkat kecil' },
    { type: 'dropoff',   lat: -6.9932,  lng: 110.4203,  name: 'Drop-Off Semarang',           address: 'Simpang Lima, Semarang',              info: 'HP, Kabel, Charger' },
    { type: 'dropoff',   lat:  3.5952,  lng:  98.6722,  name: 'Drop-Off Medan',              address: 'Jl. Sudirman, Medan',                info: 'Semua elektronik kecil' },
    { type: 'dropoff',   lat: -5.1477,  lng: 119.4327,  name: 'Drop-Off Makassar',           address: 'Jl. AP Pettarani, Makassar',          info: 'HP, Tablet, Baterai' },
    { type: 'dropoff',   lat: -8.6574,  lng: 115.2183,  name: 'Drop-Off Denpasar',           address: 'Jl. Teuku Umar, Denpasar, Bali',     info: 'HP, Kamera, Baterai' },
    { type: 'dropoff',   lat: -0.0226,  lng: 109.3294,  name: 'Drop-Off Pontianak',          address: 'Jl. Gajah Mada, Pontianak',           info: 'Semua perangkat kecil' },
    { type: 'collector', lat: -6.1944,  lng: 106.8229,  name: 'Pengepul Berkah E-Waste',     address: 'Penjaringan, Jakarta Utara',          info: '500 kg/bulan' },
    { type: 'collector', lat: -6.3000,  lng: 106.8000,  name: 'CV. Daur Ulang Jaya',         address: 'Cilandak, Jakarta Selatan',           info: '1.2 ton/bulan' },
    { type: 'collector', lat: -6.9600,  lng: 107.6300,  name: 'Pengepul Maju Bandung',       address: 'Cicaheum, Bandung',                   info: '800 kg/bulan' },
    { type: 'collector', lat: -7.2800,  lng: 112.7200,  name: 'UD. Logam Mulia Surabaya',    address: 'Wonokromo, Surabaya',                 info: '2 ton/bulan' },
    { type: 'collector', lat:  3.5800,  lng:  98.6900,  name: 'Pengepul Mandiri Medan',      address: 'Medan Baru, Medan',                   info: '600 kg/bulan' },
    { type: 'collector', lat: -7.8000,  lng: 110.3800,  name: 'CV. Recycle Jogja',           address: 'Kotagede, Yogyakarta',                info: '400 kg/bulan' },
    { type: 'recycle',   lat: -6.4500,  lng: 107.0200,  name: 'PT. EcoRecycle Indonesia',    address: 'Kawasan Industri Cikarang, Bekasi',   info: '50 ton/bulan' },
    { type: 'recycle',   lat: -7.0500,  lng: 107.4800,  name: 'PT. Green Metal Bandung',     address: 'Cimahi Industri, Bandung',            info: '30 ton/bulan' },
    { type: 'recycle',   lat: -7.3500,  lng: 112.5500,  name: 'PT. Urban Mine Surabaya',     address: 'Kawasan Industri PIER, Surabaya',     info: '80 ton/bulan' },
    { type: 'recycle',   lat: -6.8000,  lng: 110.9000,  name: 'PT. Sinar Daur Ulang',        address: 'Demak Industrial Estate',             info: '25 ton/bulan' },
    { type: 'recycle',   lat:  3.5200,  lng:  98.7100,  name: 'PT. Medan Recycle Corp',      address: 'Kawasan Industri Medan',              info: '20 ton/bulan' },
  ];

  const colors    = { dropoff: '#3D7A3A', collector: '#E8960F', recycle: '#0096B7' };
  const labels    = { dropoff: 'Drop-Off Box', collector: 'Pengepul', recycle: 'Fasilitas Daur Ulang' };
  const iconSizes = { dropoff: 13, collector: 15, recycle: 17 };

  const allMarkers = [];

  locations.forEach(loc => {
    const color  = colors[loc.type];
    const icon   = makeIcon(color, iconSizes[loc.type]);
    const marker = L.marker([loc.lat, loc.lng], { icon });

    marker.bindPopup(`
      <div style="font-family:'Inter',sans-serif;padding:12px 14px;min-width:210px;background:#fff;color:#111;border-radius:12px;">
        <span style="display:inline-block;padding:2px 10px;border-radius:99px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;background:${color}18;color:${color};margin-bottom:8px;">${labels[loc.type]}</span>
        <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${loc.name}</div>
        <div style="font-size:12px;color:#9A9A8E;">📍 ${loc.address}</div>
        <div style="font-size:11px;color:#9A9A8E;margin-top:5px;">📦 ${loc.info}</div>
      </div>
    `, { className: 'lf-popup' });

    marker.addTo(map);
    allMarkers.push({ marker, type: loc.type, lat: loc.lat, lng: loc.lng, name: loc.name, address: loc.address });
  });

  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      allMarkers.forEach(({ marker, type }) => {
        if (filter === 'all' || type === filter) marker.addTo(map);
        else map.removeLayer(marker);
      });
    });
  });

  // ============================
  // USER GEOLOCATION
  // ============================
  let userMarker     = null;
  let accuracyCircle = null;

  function makeUserIcon() {
    return L.divIcon({
      html: `<div class="user-loc-wrapper">
               <div class="user-loc-pulse"></div>
               <div class="user-loc-dot"></div>
             </div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }

  function haversine(lat1, lng1, lat2, lng2) {
    const R    = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a    = Math.sin(dLat/2)**2 +
                 Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function findNearest(userLat, userLng, count = 3) {
    return allMarkers
      .map(m => ({ ...m, dist: haversine(userLat, userLng, m.lat, m.lng) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, count);
  }

  function showUserLocation(lat, lng, accuracy) {
    if (userMarker)     map.removeLayer(userMarker);
    if (accuracyCircle) map.removeLayer(accuracyCircle);

    accuracyCircle = L.circle([lat, lng], {
      radius: Math.min(accuracy, 5000),
      color: '#2563EB',
      fillColor: '#3B82F6',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '5 5',
    }).addTo(map);

    const nearest = findNearest(lat, lng);

    userMarker = L.marker([lat, lng], { icon: makeUserIcon(), zIndexOffset: 1000 });
    userMarker.bindPopup(`
      <div style="font-family:'Inter',sans-serif;padding:14px 16px;min-width:220px;background:#fff;color:#111;border-radius:14px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
          <div style="width:10px;height:10px;background:#2563EB;border-radius:50%;box-shadow:0 0 8px #2563EB99;flex-shrink:0;"></div>
          <span style="font-weight:800;font-size:14px;">📍 Lokasi Kamu</span>
        </div>
        <div style="font-size:11px;color:#9A9A8E;background:#F7F8F5;padding:6px 10px;border-radius:8px;margin-bottom:12px;">
          Akurasi ± ${Math.round(accuracy)} meter
        </div>
        <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.8px;">
          Terdekat dari lokasimu:
        </div>
        ${nearest.map((m, i) => `
          <div style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;${i < nearest.length-1 ? 'border-bottom:1px solid #F0F0EE;' : ''}">
            <div style="
              min-width:22px;height:22px;background:${colors[m.type]};
              border-radius:50%;display:flex;align-items:center;justify-content:center;
              font-size:10px;font-weight:800;color:#fff;flex-shrink:0;margin-top:2px;
            ">${i+1}</div>
            <div style="flex:1;">
              <div style="font-weight:700;font-size:12px;color:#111;line-height:1.3;">${m.name}</div>
              <div style="font-size:11px;color:#9A9A8E;margin:3px 0 6px;">
                ${m.dist < 1 ? (m.dist*1000).toFixed(0)+' m' : m.dist.toFixed(1)+' km'} ·
                <span style="color:${colors[m.type]};font-weight:600;">${labels[m.type]}</span>
              </div>
              <a href="https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${m.lat},${m.lng}" target="_blank" class="dir-btn">
                Mulai Rute ↗
              </a>
            </div>
          </div>`).join('')}
      </div>
    `, { className: 'lf-popup', maxWidth: 280 });

    userMarker.addTo(map);
    userMarker.openPopup();

    nearest.slice(0, 1).forEach(m => {
      L.polyline([[lat, lng], [m.lat, m.lng]], {
        color: colors[m.type],
        weight: 2,
        opacity: 0.45,
        dashArray: '6 6',
      }).addTo(map);
    });

    map.flyTo([lat, lng], 13, { duration: 1.6, easeLinearity: 0.2 });
    updateLocateBtn('success');
  }

  function updateLocateBtn(state) {
    const btn = document.getElementById('locate-btn');
    if (!btn) return;
    const states = {
      idle:    { html: `<span class="locate-icon">◎</span> Lokasi Saya`, disabled: false, cls: '' },
      loading: { html: `<span class="locate-spinner"></span> Mencari...`, disabled: true,  cls: 'loading' },
      success: { html: `<span>✓</span> Lokasi Ditemukan`,                 disabled: false, cls: 'success' },
      error:   { html: `<span class="locate-icon">◎</span> Coba Lagi`,    disabled: false, cls: 'error' },
    };
    const s = states[state] || states.idle;
    btn.innerHTML  = s.html;
    btn.disabled   = s.disabled;
    btn.dataset.state = state;
  }

  function requestUserLocation() {
    updateLocateBtn('loading');
    if (!navigator.geolocation) {
      showToast('Browser kamu tidak mendukung Geolocation.');
      updateLocateBtn('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => showUserLocation(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy),
      err => {
        const msgs = {
          1: 'Izin lokasi ditolak. Aktifkan izin lokasi di browser.',
          2: 'Sinyal GPS tidak tersedia saat ini.',
          3: 'Waktu habis. Coba lagi.',
        };
        showToast('⚠️ ' + (msgs[err.code] || 'Lokasi tidak dapat ditemukan.'));
        updateLocateBtn('error');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'map-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 4000);
  }

  if (isFullPage) {
    const btn = document.createElement('button');
    btn.id        = 'locate-btn';
    btn.className = 'locate-btn';
    btn.innerHTML = `<span class="locate-icon">◎</span> Lokasi Saya`;
    btn.addEventListener('click', requestUserLocation);
    const cta = document.querySelector('.sidebar-cta');
    if (cta) cta.parentNode.insertBefore(btn, cta);
  } else {
    const LocateCtrl = L.Control.extend({
      options: { position: 'topright' },
      onAdd() {
        const wrap = L.DomUtil.create('div', 'locate-ctrl-wrap');
        wrap.innerHTML = `<button id="locate-btn" class="locate-btn locate-btn-map">
          <span class="locate-icon">◎</span> Lokasi Saya
        </button>`;
        L.DomEvent.on(wrap.querySelector('button'), 'click', requestUserLocation);
        L.DomEvent.disableClickPropagation(wrap);
        return wrap;
      }
    });
    new LocateCtrl().addTo(map);
  }
})();

// ==========================================
// 5. MARKETPLACE
// ==========================================
(function initMarketplace() {
  const items = [
    { type: 'smartphone', emoji: '📱', title: 'Batch Smartphone Bekas Mix',    meta: 'Jakarta Selatan · 2 hari lalu', price: 'Rp 45.000/kg',   qty: '120 kg' },
    { type: 'laptop',     emoji: '💻', title: 'Laptop Core i5 Non-Fungsi',      meta: 'Bandung · 1 hari lalu',         price: 'Rp 120.000/unit', qty: '35 unit' },
    { type: 'battery',    emoji: '🔋', title: 'Baterai Lithium-Ion Bekas',      meta: 'Surabaya · 3 hari lalu',        price: 'Rp 28.000/kg',   qty: '250 kg' },
    { type: 'cable',      emoji: '🔌', title: 'Kabel & Charger Campuran',       meta: 'Semarang · 1 hari lalu',        price: 'Rp 8.000/kg',    qty: '80 kg' },
    { type: 'laptop',     emoji: '🖥️', title: 'CPU Desktop Bekas',              meta: 'Medan · 4 hari lalu',           price: 'Rp 75.000/unit', qty: '20 unit' },
    { type: 'smartphone', emoji: '📷', title: 'Kamera Digital Bekas',           meta: 'Yogyakarta · 5 hari lalu',      price: 'Rp 95.000/unit', qty: '15 unit' },
    { type: 'battery',    emoji: '⚡', title: 'PCB & Komponen Elektronik',      meta: 'Bekasi · 2 hari lalu',          price: 'Rp 55.000/kg',   qty: '150 kg' },
    { type: 'cable',      emoji: '🖨️', title: 'Printer & Scanner Bekas',        meta: 'Makassar · 6 hari lalu',        price: 'Rp 50.000/unit', qty: '10 unit' },
  ];

  const typeClass  = { smartphone: 'type-smartphone', laptop: 'type-laptop', battery: 'type-battery', cable: 'type-cable' };
  const typeLabel  = { smartphone: 'Smartphone', laptop: 'Laptop/Komputer', battery: 'Baterai', cable: 'Kabel & PCB' };
  const grid = document.getElementById('marketplace-grid');
  if (!grid) return;

  function render(filter = 'all') {
    grid.innerHTML = '';
    items.filter(i => filter === 'all' || i.type === filter).forEach(item => {
      const card = document.createElement('div');
      card.className = 'market-card';
      card.innerHTML = `
        <div class="market-card-img">${item.emoji}</div>
        <div class="market-card-body">
          <span class="market-card-type ${typeClass[item.type]}">${typeLabel[item.type]}</span>
          <div class="market-card-title">${item.title}</div>
          <div class="market-card-meta">📍 ${item.meta}</div>
          <div class="market-card-footer">
            <span class="market-card-price">${item.price}</span>
            <span class="market-card-qty">${item.qty} tersedia</span>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }

  render();

  document.querySelectorAll('[data-mfilter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-mfilter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.mfilter);
    });
  });
})();

// ==========================================
// 6. FORM TABS
// ==========================================
(function initTabs() {
  document.querySelectorAll('.reg-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.reg-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('panel-' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });
})();

// ==========================================
// 7. ACTOR CARD BUTTONS → jump to correct tab
// ==========================================
(function initActorJumps() {
  const mapping = { 'ac-ctz-btn': 'citizen', 'ac-col-btn': 'collector', 'ac-ind-btn': 'industry' };
  Object.entries(mapping).forEach(([id, tab]) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.reg-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + tab));
      document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

// ==========================================
// 8. RANGE SLIDER
// ==========================================
(function initRange() {
  const slider = document.getElementById('col-area');
  const display = document.getElementById('col-area-val');
  if (!slider || !display) return;
  slider.addEventListener('input', () => { display.textContent = slider.value + ' km'; });
})();

// ==========================================
// 9. FORM SUBMIT (mock)
// ==========================================
(function initForms() {
  const overlay  = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');

  ['form-citizen', 'form-collector', 'form-industry'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      form.reset();
    });
  });

  const hide = () => { overlay.classList.remove('active'); document.body.style.overflow = ''; };
  closeBtn  && closeBtn.addEventListener('click', hide);
  overlay   && overlay.addEventListener('click', e => { if (e.target === overlay) hide(); });
})();

// ==========================================
// 10. ACTIVE NAV HIGHLIGHT
// ==========================================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link:not(.nav-cta)');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.style.color = l.getAttribute('href') === '#' + current ? 'var(--black)' : '';
      l.style.background = l.getAttribute('href') === '#' + current ? 'var(--grey-100)' : '';
    });
  });
})();

console.log('%c🌱 Urban Mining Connector', 'color:#3D7A3A;font-size:18px;font-weight:900;');
console.log('%cPlatform Digital E-Waste · SDGs 12 · Indonesia', 'color:#9A9A8E;font-size:12px;');
