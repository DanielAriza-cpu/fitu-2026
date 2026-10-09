(function () {
  'use strict';
  var DIAS = { '2026-10-27': ['Martes', '27'], '2026-10-28': ['Miércoles', '28'], '2026-10-29': ['Jueves', '29'], '2026-10-30': ['Viernes', '30'] };
  var TIPOS = { obra: 'Obra', taller: 'Master class', muestra: 'Muestra de ensamble', conferencia: 'Coloquio · Conferencia' };
  var data = [], lug = {};
  try { data = JSON.parse(document.getElementById('ev-data').textContent); lug = JSON.parse(document.getElementById('lug-data').textContent); } catch (e) {}

  // Fecha y hora actuales en Manizales (UTC-5)
  function bogotaNow() {
    var now = new Date();
    var parts = {};
    try {
      new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(now).forEach(function (p) { parts[p.type] = p.value; });
      return { fecha: parts.year + '-' + parts.month + '-' + parts.day, hm: (parts.hour === '24' ? '00' : parts.hour) + ':' + parts.minute };
    } catch (e) {
      var d = new Date(now.getTime() - 5 * 3600 * 1000);
      return { fecha: d.toISOString().slice(0, 10), hm: d.toISOString().slice(11, 16) };
    }
  }
  var now = bogotaNow();

  function h12(t) {
    var a = t.split(':'), hh = +a[0], mm = a[1];
    var suf = hh < 12 ? 'a.m.' : (hh === 12 && mm === '00' ? 'm.' : 'p.m.');
    return (hh > 12 ? hh - 12 : hh) + ':' + mm + ' ' + suf;
  }

  // Marcar "Ahora" / "A continuación" / pasado en las listas del día de hoy
  function markNow(root) {
    var items = root.querySelectorAll('.ev[data-fecha="' + now.fecha + '"]');
    var nextMarked = false;
    items.forEach(function (li) {
      var ini = li.getAttribute('data-ini'), fin = li.getAttribute('data-fin');
      var flag = li.querySelector('.now-flag');
      if (now.hm >= ini && now.hm < fin) { li.classList.add('is-now'); if (flag) { flag.textContent = 'Ahora'; flag.hidden = false; } }
      else if (now.hm >= fin) { li.classList.add('is-past'); }
      else if (!nextMarked && flag) { flag.textContent = 'A continuación'; flag.hidden = false; nextMarked = true; }
    });
  }
  markNow(document);

  // Portada: "Hoy en el festival"
  var hoyList = document.getElementById('hoy-list');
  if (hoyList && DIAS[now.fecha]) {
    var d = DIAS[now.fecha];
    document.getElementById('hoy-label').textContent = 'Hoy · ' + d[0] + ' ' + d[1];
    document.getElementById('hoy-more').setAttribute('href', 'dia-' + d[1] + '.html');
    var cta = document.getElementById('cta-today'); if (cta) cta.setAttribute('href', 'dia-' + d[1] + '.html');
    var html = '';
    data.filter(function (x) { return x.fecha === now.fecha; }).forEach(function (x) {
      html += '<li class="ev ev-' + x.tipo + '" data-tipo="' + x.tipo + '" data-fecha="' + x.fecha + '" data-ini="' + x.ini + '" data-fin="' + x.fin + '">' +
        '<div class="ev-time"><span class="ev-h">' + h12(x.ini) + '</span><span class="ev-to">hasta ' + h12(x.fin) + '</span></div>' +
        '<div class="ev-body"><p class="ev-tipo"><span>' + TIPOS[x.tipo] + '</span><span class="now-flag" hidden></span></p>' +
        '<h3 class="ev-title"><a href="' + x.href + '"></a></h3><p class="ev-meta"><span class="lugar"></span></p></div></li>';
    });
    hoyList.innerHTML = html;
    var lis = hoyList.querySelectorAll('.ev');
    data.filter(function (x) { return x.fecha === now.fecha; }).forEach(function (x, i) {
      lis[i].querySelector('.ev-title a').textContent = x.titulo;
      lis[i].querySelector('.lugar').textContent = lug[x.lugar] || '';
    });
    markNow(hoyList);
  } else if (hoyList && now.fecha > '2026-10-30') {
    document.getElementById('hoy-label').textContent = 'Así fue el primer día · Martes 27';
  }

  // Filtros por tipo
  var chips = document.querySelectorAll('.chip[data-f]');
  if (chips.length) {
    var KEY = 'fitu-filtro';
    function apply(f) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-f') === f ? 'true' : 'false'); });
      var shown = 0;
      document.querySelectorAll('[data-filterable] .ev').forEach(function (li) {
        var ok = f === 'todo' || li.getAttribute('data-tipo') === f;
        li.hidden = !ok; if (ok) shown++;
      });
      var empty = document.getElementById('empty-msg'); if (empty) empty.hidden = shown > 0;
      try { localStorage.setItem(KEY, f); } catch (e) {}
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.getAttribute('data-f')); }); });
    var saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved && document.querySelector('.chip[data-f="' + saved + '"]')) apply(saved);
  }
})();
