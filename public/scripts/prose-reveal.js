const proseContainers = document.querySelectorAll('.prose');
const io = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) target.classList.add('in');
  });
}, { threshold: 0.15 });
proseContainers.forEach((el) => io.observe(el));

