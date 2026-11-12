/**
 * ANJANA ANDURTHI - PORTFOLIO INTERACTIVE JAVASCRIPT
 * SPA Functionality: Smooth ScrollSpy, Typewriter, Theme Switcher,
 * Dynamic Filters, Resume Downloader & Micro-Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Switcher (Dark / Light) & Palette Selector with Local Storage
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const currentTheme = localStorage.getItem('anj_theme') || 'dark';
  const currentPalette = 'sapphire'; // Locked to Theme 6: Arctic Ice & Royal Sapphire Ocean

  document.documentElement.setAttribute('data-theme', currentTheme);
  document.documentElement.setAttribute('data-bs-theme', currentTheme);
  document.documentElement.setAttribute('data-palette', 'sapphire');
  updateThemeIcon(currentTheme);

  // Global Palette Switcher function
  window.setPaletteTheme = function(palette) {
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem('anj_palette', palette);
    const label = palette === 'sapphire' ? '🌊 Arctic Sapphire Ocean' : (palette === 'solar' ? '☀️ Solar Amber Gold' : (palette === 'emerald' ? '🌿 Cyber Emerald Mint' : '💎 Crimson Velvet Luxe'));
    if (typeof showToast === 'function') {
      showToast(`${label} Theme Activated!`);
    }
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('anj_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(newTheme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'bi bi-moon-stars-fill';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
      themeIcon.className = 'bi bi-sun-fill';
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
    }
  }

  // --------------------------------------------------------------------------
  // 2. Typewriter Effect
  // --------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriterText');
  const titles = [
    'Aspiring Software Developer',
    'Python Full-Stack Developer',
    'Database & SQL Specialist',
    'AI, NLP & Machine Learning Enthusiast'
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function typeEffect() {
    if (!typewriterElement) return;
    const currentWord = titles[titleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 95;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400; // Pause before next word
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  // --------------------------------------------------------------------------
  // 3. Navbar Scroll State & SPA ScrollSpy
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar-custom');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar shadow on scroll
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // ScrollSpy active link detection
    let currentActive = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentActive = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile nav auto-close on click
  const navCollapse = document.getElementById('navbarContent');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Back to Top Scroll
  // --------------------------------------------------------------------------
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Skills Category Filter
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-col');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. Clipboard Copy with Toast Feedback
  // --------------------------------------------------------------------------
  window.copyToClipboard = function(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${label} to clipboard! ✨`);
    }).catch(() => {
      // Fallback
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast(`Copied ${label} to clipboard! ✨`);
    });
  };

  // Toast Function
  window.showToast = function(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container-custom';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-custom';
    toast.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // --------------------------------------------------------------------------
  // 7. Direct Resume Download Handler
  // --------------------------------------------------------------------------
  window.downloadResumeFile = function(e) {
    if (e) e.preventDefault();
    const resumePath = 'Anjana_Andurthi_Resume.pdf';
    
    // Create temporary link element
    const link = document.createElement('a');
    link.href = resumePath;
    link.download = 'Anjana_Andurthi_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('📄 Downloading Anjana Andurthi\'s Resume...');
  };

  // Bind to all resume download buttons
  const resumeDownloadButtons = document.querySelectorAll('.btn-download-resume');
  resumeDownloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      window.downloadResumeFile(e);
    });
  });

  // --------------------------------------------------------------------------
  // 8. Contact Form Handling
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message) {
        showToast('⚠️ Please fill in all required fields.');
        return;
      }

      // Show immediate feedback
      showToast(`Thank you, ${name}! Opening mail client... 🚀`);

      // Open mailto with prefilled details
      setTimeout(() => {
        const mailtoUrl = `mailto:anjanaandurthi@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent('Hi Anjana,\n\n' + message + '\n\nBest regards,\n' + name + ' (' + email + ')')}`;
        window.location.href = mailtoUrl;
        contactForm.reset();
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 9. Low-to-Medium Scroll Animation (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show immediately
    revealElements.forEach(el => el.classList.add('active'));
  }
});

