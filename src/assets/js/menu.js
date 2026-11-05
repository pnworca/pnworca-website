(function () {
  var btn = document.querySelector('.burger');
  var panel = document.getElementById('mobile-menu');
  if (!btn || !panel) return;
  function set(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.hidden = !open;
  }
  btn.addEventListener('click', function () { set(panel.hidden); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
})();
(function () {
  var b = document.querySelector('.motion-toggle');
  if (!b) return;
  b.addEventListener('click', function () {
    var on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    document.documentElement.classList.toggle('motion-paused', on);
  });
})();
// Races: the build lists races that were upcoming on the day it ran.
// On page load, mark races that are now over, and on the home page drop them
// so "Next race" and "Upcoming races" stay current between builds.
(function () {
  var now = Date.now();
  var rows = document.querySelectorAll('.race-row[data-end]');
  for (var i = 0; i < rows.length; i++) {
    if (Date.parse(rows[i].getAttribute('data-end')) < now) rows[i].classList.add('is-past');
  }
  var list = document.querySelector('[data-upcoming]');
  if (!list) return;
  var left = [];
  list.querySelectorAll('.race-row').forEach(function (r) {
    if (r.classList.contains('is-past')) r.remove(); else left.push(r);
  });
  left.forEach(function (r, n) { r.hidden = n >= 3; });
  var hero = document.querySelector('[data-next]');
  if (!hero) return;
  if (!left.length) { hero.hidden = true; return; }
  hero.href = left[0].getAttribute('href');
  hero.querySelector('[data-next-name]').textContent = left[0].getAttribute('data-name');
  var c = left[0].getAttribute('data-callout');
  hero.querySelector('[data-next-callout]').textContent = c || '';
  hero.querySelector('[data-next-when]').textContent = left[0].getAttribute('data-when');
})();
