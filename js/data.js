const AP = {
  business: {
    brand: 'Barbeiro Barril',
    barber: 'Gilson Borges',
    address: 'R. Sebastião José de Abreu - Algodões, Quijingue - BA, 48830-000',
    hoursLabel: 'Terça a domingo · 08h às 17h',
    offDayLabel: 'Segunda-feira fechada',
  },

  services: [
    { id: 1, name: 'Corte degradê qualquer tipo', dur: '45 min', price: 25, category: 'corte', desc: 'Degradê feito no estilo que você preferir, com acabamento limpo e alinhado.', photo: '' },
    { id: 2, name: 'Corte social', dur: '35 min', price: 20, category: 'corte', desc: 'Corte clássico e alinhado para o dia a dia, trabalho ou ocasião especial.', photo: '' },
    { id: 3, name: 'Corte com pigmentação', dur: '55 min', price: 38, category: 'tratamento', desc: 'Corte com realce e pigmentação para valorizar o acabamento e corrigir falhas visuais.', photo: '' },
    { id: 4, name: 'Corte kids', dur: '35 min', price: 23, category: 'corte', desc: 'Atendimento para crianças. Disponível somente às terças e quintas.', note: 'Atendimento somente às terças e quintas', allowedWeekdays: [2, 4], photo: '' },
    { id: 5, name: 'Barba', dur: '20 min', price: 10, category: 'barba', desc: 'Barba alinhada com acabamento limpo para manter o visual em dia.', photo: '' },
    { id: 6, name: 'Corte degradê + barba + sobrancelhas', dur: '60 min', price: 35, category: 'combo', desc: 'Combo completo para sair na régua, com corte, barba e sobrancelhas.', photo: '' },
    { id: 7, name: 'Corte social + barba', dur: '50 min', price: 28, category: 'combo', desc: 'Praticidade e estilo em um combo direto e bem acabado.', photo: '' },
    { id: 8, name: 'Platinado a partir de', dur: '120 min', price: 85, category: 'tratamento', desc: 'Serviço de platinado com valor inicial. O preço pode variar conforme o cabelo.', photo: '' },
    { id: 9, name: 'Pezinho + barba', dur: '25 min', price: 15, category: 'combo', desc: 'Acabamento rápido para manter o visual sempre organizado.', photo: '' },
    { id:10, name: 'Corte com relaxamento', dur: '90 min', price: 65, category: 'tratamento', desc: 'Corte com relaxamento para alinhar e modelar melhor o cabelo.', photo: '' },
    { id:11, name: 'Pezinho', dur: '10 min', price: 5, category: 'acabamento', desc: 'Ajuste rápido para manter o corte limpo por mais tempo.', photo: '' },
  ],

  categories: [
    { id: 'todos', label: 'Todos' },
    { id: 'corte', label: 'Cortes' },
    { id: 'barba', label: 'Barba' },
    { id: 'combo', label: 'Combos' },
    { id: 'tratamento', label: 'Tratamentos' },
    { id: 'acabamento', label: 'Acabamento' },
  ],

  timeGroups: [
    { label: 'Manhã', times: ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30'] },
    { label: 'Tarde', times: ['13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'] },
  ],

  unavailableSlots: ['09:30','14:00','15:30'],
  months: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  days: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],

  formatPrice(n) {
    return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  formatDate(date) {
    if (!date) return '—';
    return `${date.getDate()} de ${AP.months[date.getMonth()]} de ${date.getFullYear()}`;
  },

  sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  },

  isClosedDay(date) {
    return date.getDay() === 1;
  },


  canBookOnDate(service, date) {
    if (!date) return false;
    if (AP.isClosedDay(date)) return false;
    if (service?.allowedWeekdays?.length) return service.allowedWeekdays.includes(date.getDay());
    return true;
  },

  genRef() {
    return 'BB-' + Math.floor(100000 + Math.random() * 900000);
  },

  toast(msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(18px)';
      el.style.transition = '.25s';
      setTimeout(() => el.remove(), 250);
    }, 3200);
  },

  maskPhone(input) {
    if (!input) return;
    input.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      v = v.replace(/^(\d{2})(\d)/, '($1) $2');
      v = v.replace(/(\d{5})(\d)/, '$1-$2');
      this.value = v;
    });
  },

  mapsLink() {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(AP.business.address)}`;
  },

  saveBooking(booking) {
    try {
      const list = JSON.parse(localStorage.getItem('bb_appointments') || '[]');
      list.push(booking);
      localStorage.setItem('bb_appointments', JSON.stringify(list));
    } catch {}
  },

  getBlockedSlotsForDate(dateStr) {
    try {
      const all = JSON.parse(localStorage.getItem('bb_blocked_slots') || '{}');
      return all[dateStr] || [];
    } catch { return []; }
  },

  toDateStr(date) {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  },
};
