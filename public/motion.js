(function () {
  'use strict';
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var activeAnimations = new Map();
  var hero = document.querySelector('.hero');
  var pointerFrame = 0;

  // Uma atualização por frame, apenas enquanto o cursor está na abertura.
  if (hero) {
    hero.addEventListener('pointermove', function (event) {
      if (motion.matches || !finePointer.matches) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(function () {
        var bounds = hero.getBoundingClientRect();
        hero.style.setProperty('--pointer-x', ((event.clientX - bounds.left) / bounds.width - .5) * 70 + 'px');
        hero.style.setProperty('--pointer-y', ((event.clientY - bounds.top) / bounds.height - .5) * 50 + 'px');
      });
    });
    hero.addEventListener('pointerleave', resetPointer);
  }

  function resetPointer() {
    cancelAnimationFrame(pointerFrame);
    if (!hero) return;
    hero.style.removeProperty('--pointer-x');
    hero.style.removeProperty('--pointer-y');
  }

  // Conteúdo visível sem JS; cada entrada é animada uma única vez.
  if ('IntersectionObserver' in window && Element.prototype.animate) {
    var selector = '.hero-inner > *, .section-head, .split-text, .split-media, .box, ' +
      '.video-box, .st-grid > .card, .offers > li, .partner, .depo-carrossel, ' +
      '.equipe > li, .join-inner, .join-ways > li, .join-actions, .site-footer .curve circle';
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var element = entry.target;
        observer.unobserve(element);
        if (motion.matches || element.contains(document.activeElement)) return;

        var siblings = Array.from(element.parentElement.children).filter(function (child) {
          return child.matches(selector);
        });
        var index = siblings.indexOf(element);
        var isDot = element.matches('.curve circle');
        var isHero = element.parentElement.matches('.hero-inner');
        var isMedia = element.matches('.split-media, .video-box');
        var offset = isDot ? '0 0' : isMedia ? '24px 20px' : '0 32px';
        var animation = element.animate([
          { opacity: 0, translate: offset, scale: isDot ? '.3' : isMedia ? '.96' : '1' },
          { opacity: 1, translate: '0 0', scale: '1' }
        ], {
          duration: isHero ? 950 : 750,
          delay: isDot ? index * 45 : Math.min(index, 3) * (isHero ? 160 : 110),
          easing: 'cubic-bezier(.16,1,.3,1)',
          fill: 'backwards'
        });
        activeAnimations.set(element, animation);
        animation.onfinish = animation.oncancel = function () { activeAnimations.delete(element); };
      });
    }, { threshold: 0, rootMargin: '0px 0px -36px 0px' });
    document.querySelectorAll(selector).forEach(function (element) { observer.observe(element); });
  }

  // Foco por teclado e preferência de movimento reduzido interrompem os efeitos.
  document.addEventListener('focusin', function (event) {
    activeAnimations.forEach(function (animation, element) {
      if (element.contains(event.target)) animation.cancel();
    });
  });
  motion.addEventListener('change', function () {
    if (motion.matches) {
      activeAnimations.forEach(function (animation) { animation.cancel(); });
      resetPointer();
    }
  });
  finePointer.addEventListener('change', resetPointer);
})();
