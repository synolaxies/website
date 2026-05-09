window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('loaded');
  }
  // Allow scrolling again once everything is loaded
  document.body.classList.remove('no-scroll');
});

document.addEventListener('DOMContentLoaded', function() {
  // ========== Moon Phase & Shooting Stars ==========
  const moonContainer = document.getElementById('moon-container');

  function getMoonPhase(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDate();

    let c = 0, e = 0, jd = 0, b = 0;

    if (month < 3) {
      year--;
      month += 12;
    }

    ++month;
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    b = parseInt(jd);
    jd -= b;
    b = Math.round(jd * 8);

    if (b >= 8) b = 0;
    return b;
  }

  function setMoonPhase() {
    const today = new Date();
    const phase = getMoonPhase(today);
    const moon = document.createElement('div');
    moon.className = 'moon';
 
    // First, add the moon to the DOM to be able to read its CSS-defined styles.
    moonContainer.innerHTML = '';
    moonContainer.appendChild(moon);

    // Now, get the computed glow effect which is theme-dependent.
    const glowShadow = window.getComputedStyle(moon).boxShadow;

    // Define properties for the phase shadow
    const shadowColor = 'rgba(0, 0, 0, 0.6)';
    const moonWidth = moonContainer.offsetWidth;
    const blurRadius = moonWidth * 0.2;
    const spreadRadius = -moonWidth * 0.05;
    let phaseShadowString = '';

    if (phase <= 4) {
      // Waxing (from new moon to full moon)
      const shadowPosition = (1 - (phase / 4)) * moonWidth;
      phaseShadowString = `inset ${shadowPosition}px 0 ${blurRadius}px ${spreadRadius}px ${shadowColor}`;
    } else {
      // Waning (from full moon to new moon)
      const shadowPosition = ((phase - 4) / 4) * moonWidth;
      phaseShadowString = `inset -${shadowPosition}px 0 ${blurRadius}px ${spreadRadius}px ${shadowColor}`;
    }

    // Combine the theme-aware glow from CSS with the calculated phase shadow.
    moon
  }


  setMoonPhase();

  function createStar() {
    const star = document.createElement('div');
    star.className = 'star';

    // Random X position
    star.style.left = Math.random() * window.innerWidth + 'px';

    // Random falling duration
    const duration = 2 + Math.random() * 2;
    star.style.animationDuration = duration + 's';

    document.body.appendChild(star);

    // Remove after animation ends
    setTimeout(() => {
      star.remove();
    }, duration * 1000);
  }

  // Keep creating stars
  setInterval(createStar, 200);

  // ========== Dynamic Content Loading ==========

  /**
   * Fetches data from a given URL.
   * @param {string} url - The URL to fetch data from.
   * @returns {Promise<Array>} - A promise that resolves to an array of data.
   */
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Could not fetch data from ${url}:`, error);
      return []; // Return empty array on error to prevent crashes
    }
  }

  /**
   * Populates the projects grid with data.
   * @param {Array} projects - The array of project objects.
   */
  function populateProjects(projects) {
    const container = document.querySelector('.projects-grid');
    if (!container) return;
    container.innerHTML = projects.map(project => `
      <div class="project-card">
        <img src="${project.image}" alt="${project.alt}" class="project-image" loading="lazy">
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
          </div>
          <div class="project-links">
            <a href="${project.links.demo.url}" class="project-link ${project.links.demo.disabled ? 'disabled' : ''}" ${project.links.demo.disabled ? 'aria-disabled="true" tabindex="-1"' : 'target="_blank" rel="noopener noreferrer"'}>Live Demo <i class="fas fa-external-link-alt"></i></a>
            <a href="${project.links.source.url}" class="project-link" target="_blank" rel="noopener noreferrer">Source <i class="fab fa-github"></i></a>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Populates the FAQ section with data.
   * @param {Array} faqData - The array of FAQ objects.
   */
  function populateFaq(faqData) {
    const container = document.querySelector('.faq-container');
    if (!container) return;
    container.innerHTML = faqData.map(item => `
      <details class="faq-item">
        <summary>${item.question}</summary>
        <div class="faq-content">
          <p>${item.answer}</p>
        </div>
      </details>
    `).join('');
  }

  /**
   * Populates the testimonial slider with data.
   * @param {Array} testimonials - The array of testimonial objects.
   * @returns {Promise} - A promise that resolves when the testimonials are loaded.
   */
  function populateTestimonialSlider(testimonials) {
    return new Promise(resolve => {
      const container = document.getElementById('testimonial-container');
      if (!container) return resolve();

      // Simulate a delay to show the skeleton loader, improving perceived performance.
      setTimeout(() => {
        container.innerHTML = '';
        const shuffledTestimonials = [...testimonials].sort(() => Math.random() - 0.5);

        shuffledTestimonials.forEach(testimonial => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
          slide.innerHTML = `
            <div class="testimonial-card">
              <p class="testimonial-content">${testimonial.quote}</p>
              <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.author}" class="author-avatar" loading="lazy">
                <div class="author-info">
                  <h4>${testimonial.author}</h4>
                  <p>${testimonial.role}</p>
                </div>
              </div>
            </div>
          `;
          container.appendChild(slide);
        });
        resolve(); // Resolve the promise after loading
      }, 1500); // 1.5 second delay
    });
  }

  /**
   * Initializes the FAQ accordion functionality.
   * Must be called after the FAQ items are added to the DOM.
   */
  function initializeFaqAccordion() {
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) return;

    // Use event delegation for better performance and to handle dynamic content
    faqContainer.addEventListener('click', (e) => {
      const summary = e.target.closest('summary');
      if (!summary) return;

      e.preventDefault();
      const item = summary.parentElement;

      // If this item is already open, close it.
      if (item.hasAttribute('open')) {
        item.removeAttribute('open');
      }
    });
  }

  /**
   * Initializes the Swiper slider for testimonials.
   * Must be called after the testimonials are added to the DOM.
   */
  function initializeTestimonialSlider() {
    new Swiper('.testimonial-slider', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  // ========== Theme Toggle ==========
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeToggleBtn.querySelector('i');
  const currentTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      document.body.classList.remove('dark-mode');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }

  if (currentTheme) {
    applyTheme(currentTheme);
  } else if (prefersDark) {
    applyTheme('dark');
  } else {
    applyTheme('light'); // Default to light and set icon
  }

  themeToggleBtn.addEventListener('click', function() {
    const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  });

  

  // ========== Payment System ==========
  const paymentBtn = document.getElementById('payment-btn');

  const handlePayment = (event) => {
    // Prevent any default browser action, which is good practice for buttons.
    if(event) event.preventDefault();

    const razorpayUrl = 'https://razorpay.me/@paytosantosh';

    // Try to open the payment link in a new tab. 'noopener' and 'noreferrer' are for security.
    const newWindow = window.open(razorpayUrl, '_blank', 'noopener,noreferrer');

    // Check if the new window was blocked by a popup blocker.
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // If blocked, inform the user and redirect the current page as a fallback.
      alert('Payment page may be blocked by a pop-up blocker. We will redirect you now.');
      window.location.href = razorpayUrl;
    } else {
      // If the new tab opened successfully, show the "redirecting" modal on this page.
      setTimeout(() => { // Use a small timeout for a smoother feel
        closeSupportModal();
        paymentSuccess();
      }, 100);
    }
  };

  if (paymentBtn) {
    paymentBtn.addEventListener('click', handlePayment);
  }

  function paymentSuccess() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
      successModal.classList.add('active');
      createConfetti();
      // Automatically close the modal after a few seconds for a better UX
      setTimeout(() => {
        // Check if the user hasn't already closed it manually
        if (successModal.classList.contains('active')) {
          successModal.classList.remove('active');
        }
      }, 3000); // 3-second delay
    }
  }

  // ========== Confetti Effect ==========
  function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = ''; // Clear previous confetti

    const colors = ['#6c5ce7', '#00cec9', '#a29bfe', '#00b894', '#fdcb6e'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';

      const size = Math.random() * 8 + 6 + 'px'; // 6px to 14px
      const xPos = Math.random() * 100 + 'vw';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const radius = Math.random() > 0.5 ? '50%' : '3px';
      const duration = Math.random() * 3 + 2 + 's'; // 2s to 5s
      const delay = Math.random() * 2 + 's'; // 0s to 2s
      const startRot = Math.random() * 360 + 'deg';
      const endRot = Math.random() * 360 + 720 + 'deg'; // Rotate at least twice

      confetti.style.setProperty('--size', size);
      confetti.style.setProperty('--x-pos', xPos);
      confetti.style.setProperty('--color', color);
      confetti.style.setProperty('--radius', radius);
      confetti.style.setProperty('--duration', duration);
      confetti.style.setProperty('--delay', delay);
      confetti.style.setProperty('--start-rot', startRot);
      confetti.style.setProperty('--end-rot', endRot);

      container.appendChild(confetti);

      // Remove the element after animation to clean up the DOM
      confetti.addEventListener('animationend', () => {
        confetti.remove();
      });
    }
  }

  // ========== Modal System & Payment Flow ==========
  const supportModalOverlay = document.getElementById('support-modal-overlay');
  const openSupportModalBtn = document.getElementById('open-support-modal-btn');
  const closeSupportModalBtn = document.getElementById('close-support-modal');
  const headerSupportBtn = document.querySelector('.support-btn-header');
  const drawerSupportLink = document.querySelector('.drawer-link[href="#support"]');
  const successModal = document.getElementById('success-modal');

  const openSupportModal = () => {
    if (supportModalOverlay) {
      supportModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      // No amount to set, just open the modal.
    }
  };

  const closeSupportModal = () => {
    if (supportModalOverlay) {
      supportModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // --- Success Modal Controls ---
  if (successModal) {
    document.getElementById('close-modal').addEventListener('click', () => successModal.classList.remove('active'));
    document.getElementById('modal-ok-btn').addEventListener('click', () => successModal.classList.remove('active'));
  }

  // --- Event Listeners to Open/Close Support Modal ---
  openSupportModalBtn.addEventListener('click', openSupportModal);
  headerSupportBtn.addEventListener('click', (e) => { e.preventDefault(); openSupportModal(); });
  drawerSupportLink.addEventListener('click', (e) => { e.preventDefault(); openSupportModal(); });
  closeSupportModalBtn.addEventListener('click', closeSupportModal);
  supportModalOverlay.addEventListener('click', (e) => { if (e.target === supportModalOverlay) closeSupportModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && supportModalOverlay.classList.contains('active')) {
      closeSupportModal();
    }
  });

  // ========== Scroll Animations ==========
  const animatedElements = document.querySelectorAll('[data-animation]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => {
    observer.observe(el);
  });

  // ========== Drawer Menu ==========
  const menuToggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');

  const openDrawer = () => {
    drawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer when a link is clicked for better UX
  // Note: The support link is handled separately to open the modal
  document.querySelectorAll('.drawer-nav .drawer-link').forEach(link => {
    if (link.getAttribute('href') !== '#support') {
      link.addEventListener('click', closeDrawer);
    }
  });

  // ========== Hero Stats Counter ==========
  const statsContainer = document.querySelector('.hero-stats');

  function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      
      element.textContent = currentValue + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
          const text = el.textContent.trim();
          const target = parseFloat(text); // Gets 250 from "250+", 5 from "5K+"
          const suffix = text.replace(/[0-9.]/g, ''); // Gets "+" from "250+", "K+" from "5K+"
          
          animateValue(el, 0, target, 2000, suffix);
        });
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, { threshold: 0.5 });

  if (statsContainer) {
    statsObserver.observe(statsContainer);
  }

  // ========== UPI ID Copy Button ==========
  const copyUpiBtn = document.getElementById('copy-upi-btn');
  const upiIdText = document.getElementById('upi-id-text');

  if (copyUpiBtn && upiIdText) {
    copyUpiBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(upiIdText.value).then(() => {
        showTooltip('UPI ID copied!');
        // Visual feedback on the button
        const icon = copyUpiBtn.querySelector('i');
        icon.classList.remove('fa-copy');
        icon.classList.add('fa-check');
        setTimeout(() => {
          icon.classList.remove('fa-check');
          icon.classList.add('fa-copy');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy UPI ID: ', err);
        showTooltip('Failed to copy!');
      });
    });
  }

  // ========== Share Functionality ==========
  const nativeShareBtn = document.getElementById('native-share-btn');

  const showTooltip = (message) => {
    const tooltip = document.getElementById('copy-tooltip');
    tooltip.textContent = message;
    tooltip.classList.add('show');
    setTimeout(() => tooltip.classList.remove('show'), 2000);
  };

  nativeShareBtn.addEventListener('click', async () => {
    const shareData = {
      title: document.title,
      text: "Check out this awesome page!",
      url: window.location.href.replace(/\/$/, ""),
    };
    try {
      // Use Web Share API if available
      await navigator.share(shareData);
    } catch (err) {
      // Fallback to copying link if Web Share is not available or fails
      navigator.clipboard.writeText(shareData.url).then(() => {
        showTooltip('Link copied to clipboard!');
      });
    }
  });

  // ========== Contact Modal Logic ==========
  const contactModalOverlay = document.getElementById('contact-modal-overlay');
  const openContactModalBtn = document.getElementById('open-contact-modal-btn');
  const openContactModalFooterBtn = document.getElementById('open-contact-modal-footer-btn');
  const closeContactModalBtn = document.getElementById('close-contact-modal');
  const contactForm = document.getElementById('contact-form');

  const openContactModal = () => {
    if (contactModalOverlay) contactModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeContactModal = () => {
    if (contactModalOverlay) contactModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openContactModalBtn) {
    openContactModalBtn.addEventListener('click', openContactModal);
  }
  if (openContactModalFooterBtn) {
    openContactModalFooterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  }
  if (closeContactModalBtn) {
    closeContactModalBtn.addEventListener('click', closeContactModal);
  }
  if (contactModalOverlay) {
    contactModalOverlay.addEventListener('click', (e) => {
      if (e.target === contactModalOverlay) {
        closeContactModal();
      }
    });
  }

  // Handle Netlify form submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner" style="display: inline-block; margin: 0;"></span> Sending...';

      const formData = new FormData(contactForm);
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(formData).toString() })
        .then(() => { contactForm.reset(); closeContactModal(); showTooltip('Message sent successfully!'); })
        .catch((error) => { alert('Oops! Something went wrong. Please try again.'); console.error(error); })
        .finally(() => { submitBtn.disabled = false; submitBtn.innerHTML = originalButtonText; });
    });
  }

  // ========== Dynamic Year ==========
  document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ========== Scroll Effects & Scrollspy ==========
  const header = document.querySelector('header');
  const backToTopButton = document.querySelector('.back-to-top');
  const sections = document.querySelectorAll('.hero, .scroll-target');
  const drawerLinks = document.querySelectorAll('.drawer-nav a.drawer-link[href^="#"]');
  const particlesJsEl = document.getElementById('particles-js'); // For parallax
 
  let lastKnownScrollY = 0;
  let ticking = false;
  // Cooldown for shooting stars on scroll
  let lastStarTime = 0;
  const starCooldown = 200; // ms, a new star can be created at most every 200ms

  const handleScroll = () => {
    const scrollY = lastKnownScrollY;
    // 1. Toggle scrolled class on header
    header.classList.toggle('scrolled', scrollY > 50);
    // 2. Toggle visibility of back-to-top button
    backToTopButton.classList.toggle('visible', scrollY > 300);
    // 3. Parallax for particles background
    if (particlesJsEl) {
      // Slower, more "universe-like" parallax effect
      const yOffset = scrollY * 0.1; // Much slower vertical scroll
      const xOffset = Math.sin(scrollY / 500) * 15; // Gentle side-to-side drift (amplitude 15px)
      const rotation = Math.sin(scrollY / 1000) * 1; // Subtle rotation (max 1 degree)
      particlesJsEl.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`;
    }
    // 4. Create shooting star on scroll with cooldown
    const now = performance.now();
    if (scrollY > 50 && now - lastStarTime > starCooldown) {
      lastStarTime = now;
    }
    // 5. Scrollspy logic to highlight active drawer link
    const headerOffset = header.offsetHeight + 20;
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerOffset;
      if (scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });
    drawerLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };
 
  window.addEventListener('scroll', () => {
    lastKnownScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call to set correct state on page load
  lastKnownScrollY = window.scrollY;
  handleScroll();

  /**
   * Main function to fetch and render all dynamic content.
   */
  async function initializePage() {
    const [projects, faqData, testimonials] = await Promise.all([
      fetchData('src/data/projects.json'),
      fetchData('src/data/faq.json'),
      fetchData('src/data/testimonials.json')
    ]);

    populateProjects(projects);
    populateFaq(faqData);
    initializeFaqAccordion(); // Initialize FAQ after populating

    await populateTestimonialSlider(testimonials);
    initializeTestimonialSlider(); // Initialize slider after populating
  }

  // Start loading all dynamic content
  initializePage();
});