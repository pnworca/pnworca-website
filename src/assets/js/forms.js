// Sends site forms to the PNWORCA Google Apps Script handler.
// Each form has data-endpoint, a hidden "form" field, a Turnstile widget and a .form-status line.
(function () {
  var forms = document.querySelectorAll('form[data-endpoint]');
  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var label = button.textContent;

    function show(message, state) {
      status.textContent = message;
      status.setAttribute('data-state', state);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (button.disabled) return;
      button.disabled = true;
      button.textContent = 'Sending...';
      show('', '');

      fetch(form.getAttribute('data-endpoint'), {
        method: 'POST',
        body: new URLSearchParams(new FormData(form))
      })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (result.ok) {
            form.reset();
            show(result.message, 'ok');
          } else {
            show(result.message, 'error');
          }
        })
        .catch(function () {
          show('The form could not be sent. Please try again in a moment, or use the Contact page.', 'error');
        })
        .then(function () {
          button.disabled = false;
          button.textContent = label;
          if (window.turnstile) {
            try { window.turnstile.reset(form.querySelector('.cf-turnstile')); } catch (e) { /* widget not ready */ }
          }
        });
    });
  });
})();
