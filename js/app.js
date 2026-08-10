// Smooth scroll animation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Scroll progress indicator
const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  
  const progressBar = document.getElementById('scrubProg');
  if (progressBar) {
    progressBar.style.width = scrollPercent + '%';
  }
};

window.addEventListener('scroll', updateScrollProgress);

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all project cards and sections
document.querySelectorAll('.project-card, section').forEach(el => {
  observer.observe(el);
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const profileImg = document.getElementById('profileImg');
  
  if (profileImg) {
    profileImg.style.transform = `translateY(${scrollY * 0.1}px)`;
  }
  
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.style.opacity = Math.max(0, 1 - scrollY / 500);
  }
});

// Hero button animations
const heroButtons = document.querySelectorAll('.hero-actions .btn');
heroButtons.forEach(btn => {
  btn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.05)';
  });
  
  btn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
});

// Loading bar simulation
window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  if (loading) {
    setTimeout(() => {
      loading.style.opacity = '0';
      loading.style.pointerEvents = 'none';
    }, 500);
  }
});

console.log('Portfolio app loaded!');
