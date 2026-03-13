
document.addEventListener('DOMContentLoaded', function() {
  
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('theme-dark');
      localStorage.setItem('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    });
  }


  const header = document.querySelector('header');
  let lastScroll = 0;
  let latestScroll = 0;
  let ticking = false;
  let progressBar = null;

  function updateHeader(scrollTop) {
    if (scrollTop > 100) {
      header.classList.add('scrolled');
      if (scrollTop > lastScroll && !header.classList.contains('shrink')) {
        header.classList.add('shrink');
      }
    } else {
      header.classList.remove('scrolled', 'shrink');
    }
    lastScroll = scrollTop;
  }

  function updateProgress(scrollTop) {
    if (!progressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPercent + '%';
  }

  function onScroll() {
    latestScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeader(latestScroll);
        updateProgress(latestScroll);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Scroll animations with advanced stagger
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, index * 100);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll, .step, .category-card, .investor-card, .startup-card, .stat').forEach((el, index) => {
    if (!el.classList.contains('animate-on-scroll')) el.classList.add('animate-on-scroll');
    observer.observe(el);
  });

  // Ultra-smooth counter animation
  function animateCounters() {
    const counters = document.querySelectorAll('.count-anim');
    const observerCounters = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const suffix = counter.textContent.includes('+') ? '+' : '';
          let current = 0;
          const duration = 2000; // 2 seconds
          const increment = target / (duration / 16); // ~60fps
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target + suffix;
              clearInterval(timer);
              // Add comma formatting for large numbers
              counter.textContent = counter.textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else {
              counter.textContent = Math.floor(current) + suffix;
            }
          }, 16);
          observerCounters.unobserve(entry.target);
        }
      });
    });
    
    counters.forEach(counter => observerCounters.observe(counter));
  }

  
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || window.innerWidth < 768) return;

    
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
      heroImage.classList.add('parallax-ready');
    }
    
    const ctx = canvas.getContext('2d');
    let mouseX = 0, mouseY = 0;
    
    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    
    const density = Math.min(85, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 15000));
    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3.2 + 1,
        opacity: Math.random() * 0.6 + 0.25,
        hue: Math.random() * 25 + 155 
      });
    }

    
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx += (dx / dist) * 0.5;
          p.vy += (dy / dist) * 0.5;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = `hsl(${p.hue}, 70%, 70%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      
      if (window.innerWidth > 900) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 80) {
              ctx.save();
              ctx.strokeStyle = `rgba(15, 107, 90, ${1 - dist / 80})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
    animate();
  }

  
  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'loading-screen modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>🚀 Apply to Pitch</h2>
          <button class="modal-close">&times;</button>
        </div>
        <form id="apply-form">
          <div class="form-group">
            <input type="text" name="startup" placeholder="Startup Name *" required>
          </div>
          <div class="form-group">
            <input type="email" name="email" placeholder="Founder Email *" required>
          </div>
          <div class="form-group">
            <textarea name="description" placeholder="Tell us about your startup (100 words max) *" rows="4" maxlength="500" required></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary submit-btn">Submit Application</button>
            <button type="button" class="btn-secondary cancel-btn">Cancel</button>
          </div>
        </form>
        <div class="modal-success" style="display: none;">
          <i class="fas fa-check-circle" style="font-size: 4rem; color: #10b981;"></i>
          <h3>Application Submitted!</h3>
          <p>Our team will review it within 48 hours. Stay tuned!</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Form handling
    const form = document.getElementById('apply-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.submit-btn');
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      form.style.display = 'none';
      modal.querySelector('.modal-success').style.display = 'block';
      
      setTimeout(() => {
        modal.remove();
      }, 3000);
    });
    
    // Close handlers
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.cancel-btn').addEventListener('click', () => modal.remove());
    
    // Backdrop click to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.remove();
    });
  }

  
  function initScrollProgress() {
    progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 4px;
      background: var(--primary-gradient);
      z-index: 10000;
      transition: width 0.08s ease;
    `;
    document.body.appendChild(progressBar);
  }

  
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }


  initScrollProgress();
  initLazyLoading();
  animateCounters();
  initParticles();
  initHeroParallax();
  initRocketLaunch();
  
  
  document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary[href="#apply"], .cta-nav, .btn-primary[href="#apply"] *')) {
      e.preventDefault();
      createModal();
    }
  });

  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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


  function initHeroParallax() {
    const heroImage = document.querySelector('.hero-image');
    if (!heroImage || window.innerWidth < 768) return;
    
    const { clientWidth: w, clientHeight: h } = heroImage;
    let mouseX = 0, mouseY = 0;
    
    heroImage.addEventListener('mousemove', (e) => {
      const { left, top } = heroImage.getBoundingClientRect();
      mouseX = (e.clientX - left - w/2) / 25;
      mouseY = (e.clientY - top - h/2) / 25;
      
      heroImage.style.transform = `
        rotateX(${-mouseY}deg) 
        rotateY(${mouseX}deg) 
        scale(1.02)
      `;
    });
    
    heroImage.addEventListener('mouseleave', () => {
      heroImage.style.transform = '';
    });
    
    
    const rocket = heroImage.querySelector('i');
    if (rocket) {
      setInterval(() => {
        rocket.style.transform += ' scale(1.05)';
        setTimeout(() => {
          rocket.style.transform = rocket.style.transform.replace(' scale(1.05)', '');
        }, 200);
      }, 3000);
    }
  }

  // Auto rocket launch every 2 seconds
  function initRocketLaunch() {
    const rocket = document.querySelector('.hero-image i.fas.fa-rocket');
    if (!rocket) return;

    function launchRocket() {
      rocket.style.animation = 'none';
      rocket.offsetHeight; // Trigger reflow
      rocket.style.animation = 'rocketLaunch 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    }

    // Launch on load
    setTimeout(launchRocket, 500);
    
    // Repeat every 2 seconds
    setInterval(launchRocket, 2000);
  }


  // Performance: Preload critical resources
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});

