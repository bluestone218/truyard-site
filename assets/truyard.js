// Video — facade plus lightbox.
//
// The video tile is card-sized, which is too small to watch a machine work in,
// so clicking opens a full-size overlay instead of playing in place. Nothing
// from youtube.com is requested until that click: the iframe below is the
// first and only time the domain is touched. youtube-nocookie.com is the
// privacy variant of the embed host.
(function () {
  var open = null, lastFocus = null;

  function close() {
    if (!open) return;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    open.parentNode.removeChild(open);
    open = null;
    if (lastFocus) lastFocus.focus();
  }

  function onKey(ev) { if (ev.key === 'Escape' || ev.keyCode === 27) close(); }

  function show(id, label) {
    lastFocus = document.activeElement;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', label || 'Video');

    var inner = document.createElement('div');
    inner.className = 'lightbox__inner';

    var shut = document.createElement('button');
    shut.className = 'lightbox__close';
    shut.type = 'button';
    shut.textContent = 'Close \u00d7';
    shut.addEventListener('click', close);

    var frame = document.createElement('div');
    frame.className = 'lightbox__frame';

    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id +
            '?autoplay=1&rel=0&modestbranding=1';
    f.title = label || 'TruYard video';
    f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.allowFullscreen = true;

    frame.appendChild(f);
    inner.appendChild(shut);
    inner.appendChild(frame);
    box.appendChild(inner);

    // Click the backdrop to close, but not the player itself.
    box.addEventListener('click', function (ev) { if (ev.target === box) close(); });

    document.body.appendChild(box);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    open = box;
    shut.focus();
  }

  var tiles = document.querySelectorAll('.card--video[data-yt]');
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', function () {
      var id = this.getAttribute('data-yt');
      if (id) show(id, this.getAttribute('data-label'));
    });
  }
})();

// Mobile nav
var t = document.querySelector('.nav__toggle');
if (t) t.addEventListener('click', function () {
  var open = document.getElementById('navlinks').classList.toggle('is-open');
  this.setAttribute('aria-expanded', open);
});

// Tabs
(function () {
  var tabs = document.querySelectorAll('.tabs__list [role="tab"]');
  if (!tabs.length) return;
  function select(tab) {
    tabs.forEach(function (x) {
      var on = x === tab;
      x.setAttribute('aria-selected', on);
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (x) {
    x.addEventListener('click', function () { select(x); });
    x.addEventListener('keydown', function (ev) {
      var i = [].indexOf.call(tabs, x), n = tabs.length;
      if (ev.key === 'ArrowRight') { tabs[(i + 1) % n].focus(); select(tabs[(i + 1) % n]); }
      if (ev.key === 'ArrowLeft') { tabs[(i - 1 + n) % n].focus(); select(tabs[(i - 1 + n) % n]); }
    });
  });
})();

// Gallery — swaps the image AND its treatment, so a field shot never
// inherits the mount left behind by a cut-out.
document.querySelectorAll('.gallery__strip [role="tab"]').forEach(function (b) {
  b.addEventListener('click', function () {
    if (!b.dataset.shot) return;
    document.querySelectorAll('.gallery__strip [role="tab"]').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
    b.setAttribute('aria-selected', 'true');
    document.getElementById('heroShot').src = b.dataset.shot;
    var main = document.querySelector('.gallery__main');
    var field = b.dataset.kind === 'field';
    main.classList.toggle('shot--bleed', field);
    main.classList.toggle('shot--mount', !field);
  });
});

// Hero scrim comparison (homepage only)
var sb = document.getElementById('scrimBtn');
if (sb) sb.addEventListener('click', function () {
  var off = document.body.classList.toggle('scrim-off');
  sb.textContent = off ? 'Scrim: OFF — see the legibility problem' : 'Scrim: on — click to compare';
});
