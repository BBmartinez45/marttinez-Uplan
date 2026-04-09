// FAQ accordion behavior: manages expand/collapse with smooth transitions.
// Keeps panels responsive to content and window resizes.
document.addEventListener('DOMContentLoaded', function () {
  const accButtons = document.querySelectorAll('.accordion-button');

  function closeAll() {
    accButtons.forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      const panel = b.nextElementSibling;
      if (panel) {
        // ensure we animate from current height to 0
        panel.style.maxHeight = panel.scrollHeight + 'px';
        // allow the browser to paint then collapse
        requestAnimationFrame(() => {
          panel.style.transition = 'max-height 220ms ease';
          panel.style.maxHeight = '0px';
        });
      }
    });
  }

  accButtons.forEach(btn => {
    const panel = btn.nextElementSibling;

    // ensure accessible initial state
    btn.setAttribute('aria-expanded', 'false');
    if (panel) panel.style.maxHeight = '0px';

    btn.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        // close this one
        this.setAttribute('aria-expanded', 'false');
        if (panel) {
          // ensure overflow hidden while collapsing
          panel.style.overflow = 'hidden';
          panel.style.maxHeight = panel.scrollHeight + 'px';
          requestAnimationFrame(() => panel.style.maxHeight = '0px');
        }
        return;
      }

      // open this one (close others first)
      closeAll();
      this.setAttribute('aria-expanded', 'true');
      if (panel) {
  // prepare to expand: keep overflow hidden until fully open
  panel.style.overflow = 'hidden';
  panel.style.transition = 'max-height 220ms ease';
  panel.style.maxHeight = panel.scrollHeight + 24 + 'px'; // extra padding buffer

        let clearTimer = null;
        const onTransitionEnd = function (e) {
          if (e.propertyName === 'max-height') {
            // allow natural height so content changes (fonts/resizes) won't clip
            panel.style.maxHeight = 'none';
            panel.style.overflow = 'visible';
            panel.style.transition = '';
            panel.removeEventListener('transitionend', onTransitionEnd);
            if (clearTimer) {
              clearTimeout(clearTimer);
              clearTimer = null;
            }
          }
        };
        panel.addEventListener('transitionend', onTransitionEnd);
        // Fallback: if transitionend doesn't fire (race, browser), clear after 500ms
        clearTimer = setTimeout(() => {
          panel.style.maxHeight = 'none';
          panel.style.overflow = 'visible';
          panel.style.transition = '';
          panel.removeEventListener('transitionend', onTransitionEnd);
        }, 500);
      }
    });
  });

  // Recompute open panels on resize or font load
  window.addEventListener('resize', () => {
    accButtons.forEach(b => {
      if (b.getAttribute('aria-expanded') === 'true') {
        const p = b.nextElementSibling;
        if (p && p.style.maxHeight !== 'none') p.style.maxHeight = p.scrollHeight + 'px';
      }
    });
  });

  // In case fonts load late, recompute heights after load
  window.addEventListener('load', () => {
    accButtons.forEach(b => {
      if (b.getAttribute('aria-expanded') === 'true') {
        const p = b.nextElementSibling;
        if (p && p.style.maxHeight !== 'none') p.style.maxHeight = p.scrollHeight + 'px';
      }
    });
  });
});

// Netlify form forwarding: use sendBeacon to call serverless function (best-effort)
(function(){
  var form = document.querySelector('form[name="early-access"]');
  if(!form) return;
  form.addEventListener('submit', function(){
    try {
      var data = new FormData(form);
      var obj = {};
      data.forEach(function(value,key){ obj[key]=value; });
      var payload = JSON.stringify(obj);
      var url = '/.netlify/functions/forward-mailerlite';
      if (navigator.sendBeacon) {
        var blob = new Blob([payload], {type: 'application/json'});
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body: payload}).catch(function(){});
      }
    } catch (err) { console.warn('Forward failed', err); }
  });
})();
