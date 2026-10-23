const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const MONTHS_SHORT = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const DAYS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const LS_CACHE = 'dm_requests_v1';
const LS_ADMIN = 'dm_admin_session';
const BM = {};
BASES.forEach(b => { BM[b.id] = b; });
const state = {
  tab: 'bases',
  baseId: 'perla8',
  calDate: new Date(),
  selDate: '',
  reqType: 'pedido',
  reqBlocked: false,
  requests: [],
  online: true,
  admin: false,
  editTarget: null
};
let toastTimer = null;

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function cleanText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function ymd(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fromYMD(value) {
  const parts = String(value || '').split('-').map(Number);
  return new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1, 12, 0, 0);
}

function todayStr() {
  return ymd(new Date());
}

function isValidYMD(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
}

function cap(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}

function shortDate(value) {
  if (!isValidYMD(value)) return '—';
  const d = fromYMD(value);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

function longDate(value) {
  if (!isValidYMD(value)) return 'Fecha por definir';
  const d = fromYMD(value);
  return `${DAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

function monthLabel(date) {
  return cap(`${MONTHS[date.getMonth()]} ${date.getFullYear()}`);
}

function money(value) {
  return value ? String(value) : '—';
}

function typeLabel(type) {
  return type === 'apartado' ? 'Apartado de base' : 'Pedido completo';
}

function showToast(message, tone = '') {
  const el = $('#toast');
  el.textContent = message;
  el.className = `toast show ${tone}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = 'toast'; }, 3600);
}

function setConn(ok) {
  state.online = ok;
  const el = $('#conn');
  el.classList.toggle('offline', !ok);
  $('#connText').textContent = ok ? 'En línea' : 'Sin conexión';
}

function readCache() {
  try {
    const value = JSON.parse(localStorage.getItem(LS_CACHE) || '[]');
    return Array.isArray(value) ? value.map(normReq).filter(r => !(r.raw && r.raw.data && r.raw.data.__test)) : [];
  } catch {
    return [];
  }
}

function writeCache() {
  try {
    localStorage.setItem(LS_CACHE, JSON.stringify(state.requests));
  } catch {}
}

function normReq(row) {
  const raw = row || {};
  let data = raw.data || (raw.raw && raw.raw.data) || raw.payload || {};
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { data = {}; }
  }
  const isEdit = data.type === 'edicion';
  const changes = isEdit && data.changes ? data.changes : {};
  const original = isEdit && data.original ? data.original : {};
  const source = isEdit ? changes : data;
  const base = source.base || (Array.isArray(source.bs) ? source.bs[0] : '') || '';
  const baseName = source.baseName || (BM[base] ? BM[base].n : '') || (source.bt || 'Sin base');
  return {
    id: String(raw.id ?? data.id ?? ''),
    createdAt: raw.created_at || data.createdAt || '',
    status: String(raw.status || data.status || 'pending').toLowerCase(),
    type: isEdit ? 'edicion' : (data.type || 'pedido'),
    targetId: data.targetId || '',
    targetLabel: data.targetLabel || '',
    changes,
    original,
    client: source.client || source.c || data.client || '',
    phone: source.phone || source.tel || data.phone || '',
    date: source.date || source.d || data.date || '',
    time: source.time || source.tm || data.time || '',
    base,
    baseName,
    people: source.people || data.people || '',
    order: source.order || source.o || data.order || '',
    deco: source.deco || data.deco || '',
    place: source.place || source.de || data.place || '',
    price: source.price || source.pr || data.price || '',
    deposit: source.deposit || source.ad || data.deposit || '',
    notes: source.notes || data.notes || '',
    raw,
    payload: data
  };
}

function requestPayload(r) {
  return {
    type: r.type,
    client: r.client,
    phone: r.phone,
    date: r.date,
    time: r.time,
    base: r.base,
    baseName: r.baseName,
    people: r.people,
    order: r.order,
    deco: r.deco,
    place: r.place,
    price: r.price,
    deposit: r.deposit,
    notes: r.notes,
    createdAt: r.createdAt
  };
}

function requestEvent(r) {
  return {
    id: `req-${r.id}`,
    requestId: r.id,
    d: r.date,
    tm: r.time,
    c: r.client || 'Solicitud aprobada',
    tel: r.phone,
    bs: r.base ? [r.base] : [],
    rl: [],
    bt: r.baseName || 'Sin base',
    o: r.order,
    pr: r.price,
    ad: r.deposit,
    de: r.place,
    deco: r.deco,
    notes: r.notes,
    source: 'request'
  };
}

function approvedEvents() {
  return state.requests.filter(r => r.type !== 'edicion' && r.status === 'approved' && isValidYMD(r.date)).map(requestEvent);
}

function fallbackEventId(event) {
  const value = [event.d, event.c, event.tm, event.bt, event.o].join('|');
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  return `evt-${Math.abs(hash).toString(36)}`;
}

function allEvents() {
  const edits = state.requests
    .filter(r => r.type === 'edicion' && r.status === 'approved' && r.targetId)
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  const editMap = {};
  edits.forEach(edit => {
    editMap[edit.targetId] = { ...(editMap[edit.targetId] || {}), ...(edit.changes || {}) };
  });
  return EVENTS
    .map(event => ({ ...event, id: event.id || fallbackEventId(event) }))
    .concat(approvedEvents())
    .map(event => editMap[event.id] ? { ...event, ...editMap[event.id], edited: true } : event)
    .sort((a, b) => {
      const dateCompare = String(a.d).localeCompare(String(b.d));
      return dateCompare || String(a.tm || '').localeCompare(String(b.tm || ''));
    });
}

function busyEvents(baseId, date) {
  return allEvents().filter(e => e.d === date && Array.isArray(e.bs) && e.bs.includes(baseId));
}

function eventsOn(date) {
  return allEvents().filter(e => e.d === date);
}

function pendingFor(baseId, date) {
  return state.requests.filter(r => r.type !== 'edicion' && r.status === 'pending' && r.date === date && r.base === baseId);
}

function nextBusy(baseId) {
  const today = todayStr();
  return allEvents().find(e => e.d >= today && Array.isArray(e.bs) && e.bs.includes(baseId));
}

async function supa(path = '', options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || 'Error de conexión');
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function postRequest(payload) {
  const rows = await supa('', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ status: 'pending', data: payload })
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

async function updateRequest(id, status) {
  if (String(id).startsWith('local-')) {
    const local = state.requests.find(r => r.id === id);
    if (local) local.status = status;
    writeCache();
    return true;
  }
  await supa(`?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ status })
  });
  return true;
}

async function syncLocalRequests() {
  if (!state.online) return 0;
  const locals = state.requests.filter(r => String(r.id).startsWith('local-') && r.status === 'pending');
  let synced = 0;
  for (const local of locals) {
    try {
      const payload = local.payload || requestPayload(local);
      const row = await postRequest(payload);
      const saved = normReq(row || { id: `local-${Date.now()}`, status: 'pending', data: payload });
      state.requests = state.requests.filter(r => r.id !== local.id);
      state.requests.unshift(saved);
      synced += 1;
    } catch {
      break;
    }
  }
  if (synced) {
    writeCache();
    renderAll();
  }
  return synced;
}

async function loadRequests(silent = false) {
  try {
    const rows = await supa('?select=*&order=created_at.desc');
    const server = (Array.isArray(rows) ? rows : []).map(normReq).filter(r => !(r.raw && r.raw.data && r.raw.data.__test));
    const local = state.requests.filter(r => String(r.id).startsWith('local-'));
    state.requests = [...local, ...server.filter(row => !local.some(item => item.id === row.id))];
    setConn(true);
    writeCache();
    renderAll();
    await syncLocalRequests();
    return true;
  } catch {
    setConn(false);
    if (!state.requests.length) state.requests = readCache();
    renderAll();
    if (!silent) showToast('No se pudo conectar. Mostrando los datos guardados.', 'red');
    return false;
  }
}

function renderBaseGrid() {
  const today = todayStr();
  $('#baseGrid').innerHTML = BASES.map(base => {
    const upcoming = allEvents().filter(e => e.d >= today && Array.isArray(e.bs) && e.bs.includes(base.id));
    const next = upcoming[0];
    const badge = upcoming.length ? String(upcoming.length) : '✓';
    return `
      <button class="base-card" type="button" data-base="${esc(base.id)}">
        <span class="base-thumb">
          <img src="${esc(base.img)}" alt="${esc(base.n)}" loading="lazy">
          <span class="dot ${upcoming.length ? 'busy' : ''}">${badge}</span>
        </span>
        <span class="base-info">
          <strong>${esc(base.n)}</strong>
          <span>${esc(base.d)}</span>
          <span class="base-meta">
            <span class="tag">${esc(base.tag)}</span>
            <span class="tag ${next ? 'red' : 'green'}">${next ? `Próx. ${shortDate(next.d)}` : 'Sin ocupaciones'}</span>
          </span>
        </span>
      </button>`;
  }).join('');
}

function renderCalendar() {
  const base = BM[state.baseId] || BASES[0];
  const year = state.calDate.getFullYear();
  const month = state.calDate.getMonth();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  $('#calBaseImg').src = base.img;
  $('#calBaseImg').alt = base.n;
  $('#calBaseName').textContent = base.n;
  $('#calBaseDesc').textContent = base.d;
  $('#calTitle').textContent = monthLabel(state.calDate);
  let html = '';
  for (let i = 0; i < offset; i += 1) html += '<span class="cal-empty"></span>';
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = ymd(new Date(year, month, day));
    const busy = busyEvents(base.id, date);
    const pending = pendingFor(base.id, date);
    const other = eventsOn(date).length > 0;
    const classes = ['cal-day'];
    if (busy.length) classes.push('busy');
    else if (other) classes.push('has-event');
    if (pending.length) classes.push('pending');
    if (date === state.selDate) classes.push('selected');
    if (date === todayStr()) classes.push('today');
    const label = busy.length ? 'ocupada' : pending.length ? 'con solicitud pendiente' : 'disponible';
    html += `<button class="${classes.join(' ')}" type="button" data-day="${date}" aria-label="${day} de ${MONTHS[month]}, ${label}">${day}</button>`;
  }
  $('#calGrid').innerHTML = html;
}

function renderDay() {
  const box = $('#dayResult');
  if (!state.selDate) {
    box.innerHTML = '<div class="empty">Elige un día en el calendario.</div>';
    return;
  }
  const base = BM[state.baseId] || BASES[0];
  const date = state.selDate;
  const busy = busyEvents(base.id, date);
  const pending = pendingFor(base.id, date);
  const other = eventsOn(date);
  let html = '';
  if (busy.length) {
    const e = busy[0];
    html += `
      <div class="verdict danger">
        <span class="verdict-label">No disponible</span>
        <strong>${esc(shortDate(date))}</strong>
        <p>${esc(e.c || 'Evento agendado')}${e.tm ? ` · ${esc(e.tm)}` : ''}<br>${esc(e.bt || base.n)}${e.de ? `<br>${esc(e.de)}` : ''}</p>
      </div>
      <button class="btn secondary" type="button" data-goto-agenda="${date}">Ver este pedido en la agenda</button>`;
  } else if (pending.length) {
    const p = pending[0];
    html += `
      <div class="verdict warn">
        <span class="verdict-label">Solicitud pendiente</span>
        <strong>${esc(shortDate(date))} · aún libre</strong>
        <p>${esc(p.client || 'Hay una solicitud')} está esperando aprobación${p.time ? ` para las ${esc(p.time)}` : ''}. La base todavía no está apartada.</p>
      </div>
      <button class="btn" type="button" data-request-date="${date}">Solicitar de todos modos</button>`;
  } else if (other.length) {
    html += `
      <div class="verdict warn">
        <span class="verdict-label">Base libre</span>
        <strong>${esc(shortDate(date))}</strong>
        <p>Ese día ya hay ${other.length} evento${other.length === 1 ? '' : 's'} en la agenda, pero ${esc(base.n)} no está ocupada.</p>
      </div>
      <button class="btn green" type="button" data-request-date="${date}">Solicitar ${esc(base.n)} para este día</button>`;
  } else {
    html += `
      <div class="verdict ok">
        <span class="verdict-label">Disponible</span>
        <strong>${esc(shortDate(date))}</strong>
        <p>${esc(base.n)} está libre. Puedes enviar una solicitud para apartarla.</p>
      </div>
      <button class="btn green" type="button" data-request-date="${date}">Solicitar ${esc(base.n)} para este día</button>`;
  }
  box.innerHTML = html;
}

function renderBusyDates() {
  const base = BM[state.baseId] || BASES[0];
  const list = allEvents().filter(e => Array.isArray(e.bs) && e.bs.includes(base.id));
  if (!list.length) {
    $('#busyDates').innerHTML = `<div class="empty">${esc(base.n)} no tiene fechas ocupadas en la agenda.</div>`;
    return;
  }
  $('#busyDates').innerHTML = list.map(e => {
    const d = fromYMD(e.d);
    return `
      <button class="busy-row" type="button" data-goto-agenda="${esc(e.d)}">
        <span class="bd"><b>${d.getDate()}</b><small>${MONTHS_SHORT[d.getMonth()]}</small></span>
        <span class="bt">${esc(e.c || 'Sin cliente')}<small>${esc(e.bt || base.n)}${e.tm ? ` · ${esc(e.tm)}` : ''}</small></span>
      </button>`;
  }).join('');
}

function eventCard(e) {
  const baseNames = (Array.isArray(e.bs) ? e.bs : []).map(id => (BM[id] ? BM[id].n : id)).filter(Boolean).join(' · ');
  const baseLine = baseNames && e.bt && baseNames !== e.bt ? `${baseNames} · ${e.bt}` : (baseNames || e.bt || 'Sin base');
  const img = Array.isArray(e.bs) && BM[e.bs[0]] ? BM[e.bs[0]].img : 'assets/logo.png';
  const phone = e.tel ? `<a href="tel:${esc(String(e.tel).replace(/[^\d+]/g, ''))}">${esc(e.tel)}</a>` : '—';
  return `
    <article class="event-card ${e.source === 'request' ? 'approved' : ''}">
      <img class="event-thumb" src="${esc(img)}" alt="" loading="lazy">
      <div class="event-main">
        <div class="event-top">
          <span class="date-pill">📅 ${esc(shortDate(e.d))}</span>
          ${e.source === 'request' ? '<span class="event-badge green">Aprobada</span>' : ''}
          ${e.edited ? '<span class="event-badge green">Actualizado</span>' : ''}
        </div>
        <h4>${esc(e.c || 'Sin cliente')}</h4>
        <div class="event-sub">${esc(baseLine)}</div>
        <div class="event-rows">
          ${e.tm ? `<div class="event-row"><u>Hora</u><span>${esc(e.tm)}</span></div>` : ''}
          ${e.o ? `<div class="event-row"><u>Pedido</u><span>${esc(e.o)}</span></div>` : ''}
          ${e.deco ? `<div class="event-row"><u>Decoración</u><span>${esc(e.deco)}</span></div>` : ''}
          ${e.de ? `<div class="event-row"><u>Lugar</u><span>${esc(e.de)}</span></div>` : ''}
          ${e.pr ? `<div class="event-row"><u>Precio</u><span>${esc(money(e.pr))}</span></div>` : ''}
          ${e.ad ? `<div class="event-row"><u>Anticipo</u><span>${esc(money(e.ad))}</span></div>` : ''}
          <div class="event-row"><u>Teléfono</u><span>${phone}</span></div>
        </div>
        <button class="edit-link" type="button" data-edit-event="${esc(e.id)}">Editar pedido</button>
      </div>
    </article>`;
}

function populateAgendaFilters() {
  const years = Array.from(new Set(EVENTS.map(e => String(e.d).slice(0, 4)))).sort();
  const yearSelect = $('#agendaYear');
  const currentYear = yearSelect.value;
  yearSelect.innerHTML = '<option value="">Todos los años</option>' + years.map(y => `<option value="${y}">${y}</option>`).join('');
  if (years.includes(currentYear)) yearSelect.value = currentYear;
  const baseSelect = $('#agendaBase');
  const currentBase = baseSelect.value;
  baseSelect.innerHTML = '<option value="">Todas las bases</option>' + BASES.map(b => `<option value="${esc(b.id)}">${esc(b.n)}</option>`).join('');
  if (BASES.some(b => b.id === currentBase)) baseSelect.value = currentBase;
}

function populateRequestBases() {
  const select = $('#rBase');
  const current = select.value;
  select.innerHTML = '<option value="">Sin base / elegir después</option>' + BASES.map(b => `<option value="${esc(b.id)}">${esc(b.n)} · ${esc(b.d)}</option>`).join('');
  if (BM[current]) select.value = current;
}

function renderAgenda() {
  const query = cleanText($('#agendaSearch').value.trim());
  const year = $('#agendaYear').value;
  const baseFilter = $('#agendaBase').value;
  const list = allEvents().filter(e => {
    if (year && !String(e.d).startsWith(year)) return false;
    if (baseFilter && !(Array.isArray(e.bs) && e.bs.includes(baseFilter))) return false;
    if (!query) return true;
    const haystack = cleanText([e.c, e.tel, e.bt, e.o, e.de, e.deco, e.pr, e.ad, ...(e.bs || []).map(id => BM[id] ? BM[id].n : id)].join(' '));
    return haystack.includes(query);
  });
  $('#agendaSummary').textContent = `${list.length} pedido${list.length === 1 ? '' : 's'} en la agenda`;
  if (!list.length) {
    $('#agendaList').innerHTML = '<div class="empty">No hay pedidos que coincidan con los filtros.</div>';
    return;
  }
  const groups = {};
  list.forEach(e => {
    const key = String(e.d).slice(0, 7);
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  $('#agendaList').innerHTML = Object.keys(groups).sort().map(key => {
    const [y, m] = key.split('-').map(Number);
    return `
      <div class="month-title" data-month="${key}">${MONTHS[m - 1]} ${y}</div>
      ${groups[key].map(eventCard).join('')}`;
  }).join('');
}

function renderRequestAvail() {
  const date = $('#rDate').value;
  const baseId = $('#rBase').value;
  const box = $('#reqAvail');
  state.reqBlocked = false;
  if (!isValidYMD(date)) {
    box.className = 'avail hidden';
    box.innerHTML = '';
    return;
  }
  if (date < todayStr()) {
    state.reqBlocked = true;
    box.className = 'avail danger';
    box.innerHTML = '<strong>Fecha pasada</strong>Elige una fecha de hoy en adelante.';
    return;
  }
  if (baseId && BM[baseId]) {
    const base = BM[baseId];
    const busy = busyEvents(baseId, date);
    if (busy.length) {
      state.reqBlocked = true;
      const e = busy[0];
      box.className = 'avail danger';
      box.innerHTML = `<strong>${esc(base.n)} está ocupada</strong>${esc(shortDate(date))} ya tiene un pedido${e.c ? ` de ${esc(e.c)}` : ''}. Elige otra fecha u otra base.`;
      return;
    }
    const pending = pendingFor(baseId, date);
    if (pending.length) {
      box.className = 'avail warn';
      box.innerHTML = `<strong>Hay una solicitud pendiente</strong>${esc(base.n)} todavía está libre, pero alguien más pidió esa fecha. El administrador decidirá.`;
      return;
    }
    box.className = 'avail ok';
    box.innerHTML = `<strong>${esc(base.n)} disponible</strong>${esc(shortDate(date))} está libre para apartar.`;
    return;
  }
  const other = eventsOn(date);
  if (other.length) {
    box.className = 'avail warn';
    box.innerHTML = `<strong>Ese día ya hay ${other.length} evento${other.length === 1 ? '' : 's'}</strong>No elegiste base. Si necesitas una, selecciónala arriba para revisar su disponibilidad.`;
  } else {
    box.className = 'avail ok';
    box.innerHTML = '<strong>Fecha libre</strong>No hay eventos agendados para ese día.';
  }
}

function setReqType(type) {
  state.reqType = type;
  $$('#typeToggle button').forEach(btn => btn.classList.toggle('on', btn.dataset.type === type));
  $('#fieldPed span').textContent = type === 'apartado' ? 'Detalles del pedido' : 'Pedido / descripción *';
  $('#rPed').placeholder = type === 'apartado' ? 'agrega los detalles del pedido' : 'Pastel, sabores, niveles, diseño…';
  renderRequestAvail();
}

function markBad(id, bad) {
  $(id).classList.toggle('bad', bad);
}

function clearFormMessage() {
  const msg = $('#formMsg');
  msg.className = 'form-msg hidden';
  msg.textContent = '';
}

const EDIT_FIELDS = { c: 'Cliente', tel: 'Teléfono', d: 'Fecha', tm: 'Hora', bs: 'Base', bt: 'Base / tipo', o: 'Pedido', deco: 'Decoración', de: 'Lugar', pr: 'Precio', ad: 'Abonos' };

function editDisplay(key, value) {
  if (key === 'bs') {
    const names = (Array.isArray(value) ? value : []).map(id => (BM[id] ? BM[id].n : id)).filter(Boolean);
    return names.length ? names.join(' · ') : 'Sin base';
  }
  if (key === 'd') return isValidYMD(value) ? shortDate(value) : '—';
  return value ? String(value) : '—';
}

function editDiffRows(request) {
  const changes = request.changes || {};
  const original = request.original || {};
  return Object.keys(EDIT_FIELDS).filter(key => JSON.stringify(original[key] ?? '') !== JSON.stringify(changes[key] ?? '')).map(key => `
    <div class="row"><u>${EDIT_FIELDS[key]}</u><span><s>${esc(editDisplay(key, original[key]))}</s> → <b>${esc(editDisplay(key, changes[key]))}</b></span></div>`).join('');
}

function requestAdminCard(r) {
  return `
    <article class="admin-card">
      <div class="topline">
        <span class="tag amber">Pendiente</span>
        <span class="event-badge">${esc(typeLabel(r.type))}</span>
      </div>
      <h4>${esc(r.client || 'Sin cliente')}</h4>
      <div class="when">${esc(longDate(r.date))}${r.time ? ` · ${esc(r.time)}` : ''}</div>
      <div class="rows">
        <div class="row"><u>Base</u><span>${esc(r.baseName || 'Sin base')}</span></div>
        <div class="row"><u>Personas</u><span>${esc(r.people || '—')}</span></div>
        <div class="row"><u>Pedido</u><span>${esc(r.order || '—')}</span></div>
        ${r.deco ? `<div class="row"><u>Decoración</u><span>${esc(r.deco)}</span></div>` : ''}
        <div class="row"><u>Lugar</u><span>${esc(r.place || '—')}</span></div>
        <div class="row"><u>Precio</u><span>${esc(money(r.price))}</span></div>
        <div class="row"><u>Anticipo</u><span>${esc(money(r.deposit))}</span></div>
        <div class="row"><u>Teléfono</u><span>${esc(r.phone || '—')}</span></div>
        ${r.notes ? `<div class="row"><u>Nota</u><span>${esc(r.notes)}</span></div>` : ''}
      </div>
      <div class="admin-actions">
        <button class="btn green" type="button" data-approve="${esc(r.id)}">Aprobar</button>
        <button class="btn danger" type="button" data-reject="${esc(r.id)}">Rechazar</button>
      </div>
    </article>`;
}

function editAdminCard(r) {
  const diff = editDiffRows(r);
  return `
    <article class="admin-card">
      <div class="topline">
        <span class="tag amber">Pendiente</span>
        <span class="event-badge">Corrección de pedido</span>
      </div>
      <h4>${esc(r.targetLabel || r.client || 'Pedido agendado')}</h4>
      <div class="when">Solicitud de actualización</div>
      <div class="rows">${diff || '<div class="row"><u>Cambios</u><span>Sin diferencias</span></div>'}</div>
      <div class="admin-actions">
        <button class="btn green" type="button" data-approve="${esc(r.id)}">Aprobar cambios</button>
        <button class="btn danger" type="button" data-reject="${esc(r.id)}">Rechazar</button>
      </div>
    </article>`;
}

function renderAdmin() {
  const gate = $('#adminGate');
  const panel = $('#adminPanel');
  if (!state.admin) {
    gate.classList.remove('hidden');
    panel.classList.add('hidden');
    return;
  }
  gate.classList.add('hidden');
  panel.classList.remove('hidden');
  const pending = state.requests.filter(r => r.status === 'pending').sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const history = state.requests.filter(r => r.status !== 'pending').sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 12);
  $('#pendingCount').textContent = pending.length;
  if (!pending.length) {
    $('#pendingList').innerHTML = '<div class="empty">No hay solicitudes pendientes.</div>';
  } else {
    $('#pendingList').innerHTML = pending.map(r => r.type === 'edicion' ? editAdminCard(r) : requestAdminCard(r)).join('');
  }
  if (!history.length) {
    $('#historyList').innerHTML = '<div class="empty">Todavía no hay solicitudes aprobadas ni rechazadas.</div>';
  } else {
    $('#historyList').innerHTML = history.map(r => `
      <div class="history-card">
        <span class="st ${r.status === 'approved' ? 'ok' : 'no'}">${r.status === 'approved' ? '✓' : '×'}</span>
        <span class="tx"><b>${esc(r.type === 'edicion' ? (r.targetLabel || r.client || 'Corrección') : (r.client || 'Sin cliente'))}</b><small>${esc(shortDate(r.date))} · ${esc(r.baseName || 'Sin base')}${r.type === 'edicion' ? ' · Corrección' : ''}</small></span>
        <time>${esc(r.status === 'approved' ? 'Aprobada' : 'Rechazada')}</time>
      </div>`).join('');
  }
}

function updateBadge() {
  const count = state.requests.filter(r => r.status === 'pending').length;
  const badge = $('#adminBadge');
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
  $('#pendingCount').textContent = count;
}

function renderAll() {
  renderBaseGrid();
  renderCalendar();
  renderDay();
  renderBusyDates();
  renderAgenda();
  renderAdmin();
  updateBadge();
}

function showView(name, navTab = 'bases') {
  state.tab = name;
  $$('.view').forEach(view => view.classList.toggle('active', view.id === `view-${name}`));
  $$('.tabbar button').forEach(btn => btn.classList.toggle('on', btn.dataset.tab === navTab));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchTab(tab) {
  if (tab === 'bases') {
    showView('bases', 'bases');
    renderBaseGrid();
  } else if (tab === 'agenda') {
    showView('agenda', 'agenda');
    renderAgenda();
  } else if (tab === 'request') {
    showView('request', 'request');
    renderRequestAvail();
  } else if (tab === 'admin') {
    showView('admin', 'admin');
    renderAdmin();
  }
}

function openBase(id) {
  if (!BM[id]) return;
  state.baseId = id;
  state.calDate = new Date();
  state.selDate = todayStr();
  renderCalendar();
  renderDay();
  renderBusyDates();
  showView('cal', 'bases');
}

function goRequest(date) {
  switchTab('request');
  if (isValidYMD(date)) $('#rDate').value = date;
  if (BM[state.baseId]) $('#rBase').value = state.baseId;
  renderRequestAvail();
  setTimeout(() => $('#rCli').focus(), 120);
}

function openAgendaForDate(date) {
  switchTab('agenda');
  const month = String(date).slice(0, 7);
  setTimeout(() => {
    const el = $(`[data-month="${month}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

async function handleStatus(id, status) {
  const request = state.requests.find(r => r.id === id);
  if (!request) return;
  const isEdit = request.type === 'edicion';
  const verb = status === 'approved' ? 'aprobar' : 'rechazar';
  const subject = isEdit
    ? `la corrección de ${request.targetLabel || request.client || 'este pedido'}`
    : `la solicitud de ${request.client || 'este cliente'}`;
  if (!window.confirm(`¿Seguro que quieres ${verb} ${subject}?`)) return;
  try {
    await updateRequest(id, status);
    request.status = status;
    writeCache();
    renderAll();
    if (isEdit) {
      showToast(status === 'approved' ? 'Corrección aprobada y aplicada a la agenda.' : 'Corrección rechazada.', status === 'approved' ? 'green' : 'red');
    } else {
      showToast(status === 'approved' ? 'Solicitud aprobada y agregada a la agenda.' : 'Solicitud rechazada.', status === 'approved' ? 'green' : 'red');
    }
    if (state.online) loadRequests(true);
  } catch {
    showToast('No se pudo actualizar la solicitud. Revisa la conexión e inténtalo de nuevo.', 'red');
  }
}

async function submitForm(event) {
  event.preventDefault();
  clearFormMessage();
  markBad('#fieldCli', false);
  markBad('#fieldDate', false);
  markBad('#fieldBase', false);
  markBad('#fieldPed', false);
  const type = state.reqType;
  const client = $('#rCli').value.trim();
  const phone = $('#rTel').value.trim();
  const date = $('#rDate').value;
  const time = $('#rTime').value.trim();
  const base = $('#rBase').value;
  const people = $('#rPeople').value.trim();
  const order = $('#rPed').value.trim();
  const deco = $('#rDeco').value.trim();
  const place = $('#rPlace').value.trim();
  const price = $('#rPrice').value.trim();
  const deposit = $('#rDeposit').value.trim();
  let bad = false;
  if (!client) { markBad('#fieldCli', true); bad = true; }
  if (!isValidYMD(date) || date < todayStr()) { markBad('#fieldDate', true); bad = true; }
  if (type === 'apartado' && !base) { markBad('#fieldBase', true); bad = true; }
  if (type === 'pedido' && !order) { markBad('#fieldPed', true); bad = true; }
  if (base && isValidYMD(date) && busyEvents(base, date).length) {
    state.reqBlocked = true;
    bad = true;
  }
  if (bad) {
    showFormMessage(state.reqBlocked ? 'Esa base ya está ocupada en la fecha elegida.' : 'Revisa los campos marcados para continuar.', 'bad');
    renderRequestAvail();
    return;
  }
  const payload = {
    type, client, phone, date, time, base,
    baseName: base && BM[base] ? BM[base].n : 'Sin base',
    people, order, deco, place, price, deposit,
    createdAt: new Date().toISOString()
  };
  const button = $('#reqSubmit');
  button.disabled = true;
  button.textContent = 'Enviando…';
  try {
    let offline = false;
    if (state.online) {
      try {
        const row = await postRequest(payload);
        const saved = normReq(row || { id: `local-${Date.now()}`, status: 'pending', data: payload });
        state.requests.unshift(saved);
        writeCache();
      } catch {
        setConn(false);
        offline = true;
      }
    } else {
      offline = true;
    }
    if (offline) {
      state.requests.unshift(normReq({ id: `local-${Date.now()}`, created_at: new Date().toISOString(), status: 'pending', data: payload }));
      writeCache();
    }
    renderAll();
    $('#reqForm').reset();
    setReqType('pedido');
    renderRequestAvail();
    showFormMessage(offline ? 'Solicitud guardada en este dispositivo. Se enviará al recuperar la conexión.' : 'Solicitud enviada. El administrador la revisará pronto.', 'ok');
    showToast(offline ? 'Solicitud guardada localmente.' : 'Solicitud enviada correctamente.', offline ? '' : 'green');
  } catch {
    showFormMessage('No se pudo enviar la solicitud. Inténtalo de nuevo.', 'bad');
  } finally {
    button.disabled = false;
    button.textContent = 'Enviar solicitud';
  }
}

function showFormMessage(text, tone) {
  const msg = $('#formMsg');
  msg.textContent = text;
  msg.className = `form-msg ${tone}`;
}

async function loginAdmin() {
  const input = $('#admPass');
  const error = $('#admError');
  if (input.value !== ADMIN_PASSWORD) {
    error.classList.remove('hidden');
    input.value = '';
    input.focus();
    return;
  }
  error.classList.add('hidden');
  state.admin = true;
  sessionStorage.setItem(LS_ADMIN, '1');
  input.value = '';
  renderAdmin();
  await loadRequests(true);
  showToast('Bienvenido al panel de administrador.', 'green');
}

function logoutAdmin() {
  state.admin = false;
  sessionStorage.removeItem(LS_ADMIN);
  renderAdmin();
  showToast('Sesión de administrador cerrada.');
}

function populateEditBases() {
  $('#eBase').innerHTML = '<option value="">Sin base / elegir después</option>' + BASES.map(b => `<option value="${esc(b.id)}">${esc(b.n)} · ${esc(b.d)}</option>`).join('');
}

function cleanField(value) {
  return value === '—' ? '' : String(value ?? '');
}

function showEditMessage(text, tone) {
  const msg = $('#editMsg');
  msg.textContent = text;
  msg.className = `form-msg ${tone}`;
}

function openEdit(id) {
  const event = allEvents().find(e => e.id === id);
  if (!event) {
    showToast('No se encontró ese pedido en la agenda.', 'red');
    return;
  }
  state.editTarget = event;
  $('#editTarget').textContent = `Editando: ${event.c || 'Sin cliente'} · ${shortDate(event.d)}. Los cambios se enviarán al administrador para su aprobación.`;
  $('#eCli').value = cleanField(event.c);
  $('#eTel').value = cleanField(event.tel);
  $('#eDate').value = isValidYMD(event.d) ? event.d : '';
  $('#eTime').value = cleanField(event.tm);
  $('#eBase').value = Array.isArray(event.bs) && BM[event.bs[0]] ? event.bs[0] : '';
  $('#ePed').value = cleanField(event.o);
  $('#eDeco').value = cleanField(event.deco);
  $('#ePlace').value = cleanField(event.de);
  $('#ePrice').value = cleanField(event.pr);
  $('#eDeposit').value = cleanField(event.ad);
  $('#editMsg').className = 'form-msg hidden';
  $('#editMsg').textContent = '';
  ['#editFieldCli', '#editFieldDate', '#editFieldPed'].forEach(selector => $(selector).classList.remove('bad'));
  $('#editModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#eCli').focus(), 120);
}

function closeEdit() {
  state.editTarget = null;
  $('#editModal').classList.add('hidden');
  document.body.style.overflow = '';
}

async function submitEdit(event) {
  event.preventDefault();
  const target = state.editTarget;
  if (!target) return;
  $('#editMsg').className = 'form-msg hidden';
  ['#editFieldCli', '#editFieldDate', '#editFieldPed'].forEach(selector => $(selector).classList.remove('bad'));
  const client = $('#eCli').value.trim();
  const phone = $('#eTel').value.trim();
  const date = $('#eDate').value;
  const time = $('#eTime').value.trim();
  const base = $('#eBase').value;
  const order = $('#ePed').value.trim();
  const deco = $('#eDeco').value.trim();
  const place = $('#ePlace').value.trim();
  const price = $('#ePrice').value.trim();
  const deposit = $('#eDeposit').value.trim();
  let bad = false;
  if (!client) { $('#editFieldCli').classList.add('bad'); bad = true; }
  if (!isValidYMD(date)) { $('#editFieldDate').classList.add('bad'); bad = true; }
  if (!order) { $('#editFieldPed').classList.add('bad'); bad = true; }
  if (bad) {
    showEditMessage('Completa el cliente, la fecha y los detalles del pedido.', 'bad');
    return;
  }
  const oldBase = Array.isArray(target.bs) ? (target.bs[0] || '') : '';
  const baseChanged = base !== oldBase;
  const changes = {
    c: client,
    tel: phone,
    d: date,
    tm: time,
    bs: base ? [base] : [],
    bt: baseChanged ? (BM[base] ? BM[base].n : 'Sin base') : (target.bt || 'Sin base'),
    o: order,
    deco,
    de: place,
    pr: price,
    ad: deposit
  };
  const original = {
    c: cleanField(target.c),
    tel: cleanField(target.tel),
    d: target.d || '',
    tm: cleanField(target.tm),
    bs: Array.isArray(target.bs) ? target.bs : [],
    bt: target.bt || '',
    o: cleanField(target.o),
    deco: cleanField(target.deco),
    de: cleanField(target.de),
    pr: cleanField(target.pr),
    ad: cleanField(target.ad)
  };
  if (JSON.stringify(changes) === JSON.stringify(original)) {
    showEditMessage('No hay cambios para enviar.', 'bad');
    return;
  }
  const payload = {
    type: 'edicion',
    targetId: target.id,
    targetLabel: `${target.c || 'Sin cliente'} · ${shortDate(target.d)}`,
    original,
    changes,
    createdAt: new Date().toISOString()
  };
  const button = $('#editSubmit');
  button.disabled = true;
  button.textContent = 'Enviando…';
  try {
    let offline = false;
    if (state.online) {
      try {
        const row = await postRequest(payload);
        state.requests.unshift(normReq(row || { id: `local-${Date.now()}`, created_at: new Date().toISOString(), status: 'pending', data: payload }));
        writeCache();
      } catch {
        setConn(false);
        offline = true;
      }
    } else {
      offline = true;
    }
    if (offline) {
      state.requests.unshift(normReq({ id: `local-${Date.now()}`, created_at: new Date().toISOString(), status: 'pending', data: payload }));
      writeCache();
    }
    renderAll();
    closeEdit();
    showToast(offline ? 'Corrección guardada en este dispositivo. Se enviará al recuperar la conexión.' : 'Corrección enviada al administrador para su aprobación.', offline ? '' : 'green');
  } catch {
    showEditMessage('No se pudo enviar la corrección. Inténtalo de nuevo.', 'bad');
  } finally {
    button.disabled = false;
    button.textContent = 'Enviar cambios para aprobación';
  }
}

function bindEvents() {
  document.addEventListener('click', event => {
    const tab = event.target.closest('[data-tab]');
    if (tab) { switchTab(tab.dataset.tab); return; }
    const base = event.target.closest('[data-base]');
    if (base) { openBase(base.dataset.base); return; }
    const back = event.target.closest('[data-back]');
    if (back) { switchTab('bases'); return; }
    const day = event.target.closest('[data-day]');
    if (day) {
      state.selDate = day.dataset.day;
      renderCalendar();
      renderDay();
      return;
    }
    const requestDate = event.target.closest('[data-request-date]');
    if (requestDate) { goRequest(requestDate.dataset.requestDate); return; }
    const agendaDate = event.target.closest('[data-goto-agenda]');
    if (agendaDate) { openAgendaForDate(agendaDate.dataset.gotoAgenda); return; }
    const editEvent = event.target.closest('[data-edit-event]');
    if (editEvent) { openEdit(editEvent.dataset.editEvent); return; }
    const closeEditBtn = event.target.closest('[data-close-edit]');
    if (closeEditBtn) { closeEdit(); return; }
    if (event.target.id === 'editModal') { closeEdit(); return; }
    const approve = event.target.closest('[data-approve]');
    if (approve) { handleStatus(approve.dataset.approve, 'approved'); return; }
    const reject = event.target.closest('[data-reject]');
    if (reject) { handleStatus(reject.dataset.reject, 'rejected'); return; }
  });

  $('#calPrev').addEventListener('click', () => {
    state.calDate = new Date(state.calDate.getFullYear(), state.calDate.getMonth() - 1, 1);
    state.selDate = '';
    renderCalendar();
    renderDay();
  });
  $('#calNext').addEventListener('click', () => {
    state.calDate = new Date(state.calDate.getFullYear(), state.calDate.getMonth() + 1, 1);
    state.selDate = '';
    renderCalendar();
    renderDay();
  });
  $('#agendaSearch').addEventListener('input', renderAgenda);
  $('#agendaYear').addEventListener('change', renderAgenda);
  $('#agendaBase').addEventListener('change', renderAgenda);
  $('#typeToggle').addEventListener('click', event => {
    const btn = event.target.closest('[data-type]');
    if (btn) setReqType(btn.dataset.type);
  });
  $('#reqForm').addEventListener('submit', submitForm);
  $('#editForm').addEventListener('submit', submitEdit);
  ['#rDate', '#rBase'].forEach(selector => {
    $(selector).addEventListener('change', renderRequestAvail);
  });
  $('#admLogin').addEventListener('click', loginAdmin);
  $('#admPass').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      loginAdmin();
    }
  });
  $('#admRefresh').addEventListener('click', () => loadRequests(false));
  $('#admLogout').addEventListener('click', logoutAdmin);
  window.addEventListener('online', () => {
    setConn(true);
    loadRequests(true);
  });
  window.addEventListener('offline', () => {
    setConn(false);
    showToast('Sin conexión. Las solicitudes se guardarán en este dispositivo.');
  });
}

function init() {
  state.requests = readCache();
  state.admin = sessionStorage.getItem(LS_ADMIN) === '1';
  state.selDate = todayStr();
  populateAgendaFilters();
  populateRequestBases();
  populateEditBases();
  setReqType('pedido');
  $('#rDate').min = todayStr();
  $('#eDate').min = '2026-01-01';
  bindEvents();
  renderAll();
  renderRequestAvail();
  loadRequests(true);
}

init();
