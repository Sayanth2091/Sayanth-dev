function setupProseReveals() {
  const proseContainers = document.querySelectorAll('.prose');
  if (proseContainers.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  proseContainers.forEach(prose => {
    // Animate all elements except for code blocks, which are handled separately
    const elementsToAnimate = prose.querySelectorAll('h2, h3, h4, p, img, blockquote, ul, ol');
    
    elementsToAnimate.forEach((el, index) => {
      if (el.tagName === 'IMG') {
        el.setAttribute('data-reveal', index % 2 === 0 ? 'left' : 'right');
      } else {
        el.setAttribute('data-reveal', '');
      }
      observer.observe(el);
    });
  });
}

document.addEventListener('astro:page-load', setupProseReveals);
setupProseReveals();
