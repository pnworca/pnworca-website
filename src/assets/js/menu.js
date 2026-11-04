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
