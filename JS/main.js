/* ==========================================================================
   Ashish Varghese — Portfolio | Main JavaScript
   Production-ready, fully-featured interactive script
   ========================================================================== */

(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     1. TOGGLE ICON NAVBAR (Mobile Menu)
     --------------------------------------------------------------------------
     Toggles the hamburger icon to an "X" and slides the navbar open/closed.
  */
  const menuIcon = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");

  if (menuIcon && navbar) {
    menuIcon.addEventListener("click", () => {
      menuIcon.classList.toggle("fa-xmark");
      navbar.classList.toggle("active");
    });
  }

  /* --------------------------------------------------------------------------
     2. SCROLL SECTION ACTIVE LINK
     --------------------------------------------------------------------------
     Highlights the nav link that corresponds to the section currently in view.
  */
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("header nav a");

  function highlightActiveSection() {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(
          'header nav a[href*="' + sectionId + '"]'
        );
        if (activeLink) activeLink.classList.add("active");
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. STICKY NAVBAR
     --------------------------------------------------------------------------
     Adds a subtle border/shadow to the header once the user scrolls past 100px.
  */
  const header = document.querySelector(".header");

  function toggleStickyHeader() {
    if (header) {
      header.classList.toggle("sticky", window.scrollY > 100);
    }
  }

  /* --------------------------------------------------------------------------
     4. REMOVE MOBILE MENU ON SCROLL
     --------------------------------------------------------------------------
     Automatically closes the mobile nav when the user starts scrolling.
  */
  function closeMobileMenuOnScroll() {
    if (menuIcon && navbar) {
      menuIcon.classList.remove("fa-xmark");
      navbar.classList.remove("active");
    }
  }

  /* --------------------------------------------------------------------------
     12. BACK TO TOP BUTTON VISIBILITY
     --------------------------------------------------------------------------
     .footer-iconTop fades in when the user has scrolled past 500px.
  */
  const footerTopBtn = document.querySelector(".footer-iconTop");

  function toggleBackToTop() {
    if (footerTopBtn) {
      if (window.scrollY > 500) {
        footerTopBtn.classList.add("show-scroll");
        footerTopBtn.style.opacity = "1";
        footerTopBtn.style.visibility = "visible";
      } else {
        footerTopBtn.classList.remove("show-scroll");
        footerTopBtn.style.opacity = "0";
        footerTopBtn.style.visibility = "hidden";
      }
    }
  }

  /* ---- Unified scroll handler (combines features 2, 3, 4, 12) ----------- */
  window.addEventListener("scroll", () => {
    highlightActiveSection();
    toggleStickyHeader();
    closeMobileMenuOnScroll();
    toggleBackToTop();
  });

  /* --------------------------------------------------------------------------
     5. SCROLLREVEAL ANIMATIONS
     --------------------------------------------------------------------------
     Configures ScrollReveal globally and reveals elements from different
     directions as they enter the viewport.
  */
  if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      distance: "80px",
      duration: 2000,
      delay: 200,
    });

    sr.reveal(".home-content, .heading", { origin: "top" });
    sr.reveal(
      ".home-img, .services-container, .portfolio-box, .contact form",
      { origin: "bottom" }
    );
    sr.reveal(".home-content h1, .about-img", { origin: "left" });
    sr.reveal(".home-content p, .about-content", { origin: "right" });
    sr.reveal(".skills-content", { origin: "bottom" });
  }

  /* --------------------------------------------------------------------------
     6. TYPED.JS
     --------------------------------------------------------------------------
     Cycles through role titles in the hero section with a typewriter effect.
  */
  if (typeof Typed !== "undefined" && document.querySelector(".multiple-text")) {
    new Typed(".multiple-text", {
      strings: ["Frontend Developer", "Web Designer", "UI/UX Designer"],
      typeSpeed: 70,
      backSpeed: 70,
      backDelay: 1000,
      loop: true,
    });
  }

  /* --------------------------------------------------------------------------
     7. SKILL BAR ANIMATION (IntersectionObserver)
     --------------------------------------------------------------------------
     When the .skills section scrolls into view, the .skill-per bars animate
     their width via the "animate" class added by this observer.
  */
  const skillsSection = document.querySelector(".skills");

  if (skillsSection) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skillBars = document.querySelectorAll(".skill-per");
            skillBars.forEach((bar) => bar.classList.add("animate"));
            // Once animated, no need to keep observing
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    skillObserver.observe(skillsSection);
  }

  /* --------------------------------------------------------------------------
     8. SMOOTH SCROLL FOR NAVIGATION LINKS
     --------------------------------------------------------------------------
     Any anchor link whose href starts with "#" will smoothly scroll to
     the matching section instead of jumping.
  */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return; // skip bare "#" links

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* --------------------------------------------------------------------------
     9. PARTICLE / FLOATING DOTS BACKGROUND (Hero Canvas)
     --------------------------------------------------------------------------
     Creates a subtle, animated particle network behind the hero section.
     - ~60 semi-transparent cyan dots drift slowly
     - Nearby particles are connected with faint lines
     - Fully responsive (canvas resizes with the window)
  */
  const homeSection = document.querySelector(".home");

  if (homeSection) {
    // Create and style the canvas
    const canvas = document.createElement("canvas");
    canvas.classList.add("particle-canvas");
    Object.assign(canvas.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "0",
      pointerEvents: "none",
    });

    // Make sure the home section is a positioning context
    if (getComputedStyle(homeSection).position === "static") {
      homeSection.style.position = "relative";
    }

    // Insert canvas as the first child so content stays on top
    homeSection.insertBefore(canvas, homeSection.firstChild);

    const ctx = canvas.getContext("2d");

    // --- Configuration ---
    const PARTICLE_COUNT = 65;
    const CONNECT_DISTANCE = 140;
    const PARTICLE_COLOR = "rgba(0, 212, 255, 0.6)"; // semi-transparent cyan
    const LINE_COLOR_BASE = "0, 212, 255"; // RGB for connection lines
    const PARTICLE_RADIUS_MIN = 1;
    const PARTICLE_RADIUS_MAX = 3;
    const SPEED_FACTOR = 0.4;

    let particles = [];
    let animationId = null;

    function resizeCanvas() {
      canvas.width = homeSection.offsetWidth;
      canvas.height = homeSection.offsetHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius =
          Math.random() * (PARTICLE_RADIUS_MAX - PARTICLE_RADIUS_MIN) +
          PARTICLE_RADIUS_MIN;
        this.vx = (Math.random() - 0.5) * SPEED_FACTOR;
        this.vy = (Math.random() - 0.5) * SPEED_FACTOR;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DISTANCE) {
            const opacity = 1 - dist / CONNECT_DISTANCE;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${LINE_COLOR_BASE}, ${opacity * 0.35})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      connectParticles();
      animationId = requestAnimationFrame(animateParticles);
    }

    // Initialise
    resizeCanvas();
    initParticles();
    animateParticles();

    // Re-initialise on resize for responsiveness
    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles(); // regenerate positions for new dimensions
    });

    // Ensure content inside .home sits above the canvas
    Array.from(homeSection.children).forEach((child) => {
      if (child !== canvas && getComputedStyle(child).position === "static") {
        child.style.position = "relative";
        child.style.zIndex = "1";
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. FORM HANDLING
     --------------------------------------------------------------------------
     Form validation and submission is handled by JS/form-handler.js
     (Web3Forms API integration). No duplicate handler here.
  */

  /* --------------------------------------------------------------------------
     11. ACTIVE NAV LINK HIGHLIGHT ON CLICK
     --------------------------------------------------------------------------
     Immediately highlights the clicked nav link (scroll-based highlight
     will take over once the section enters the viewport).
  */
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  /* --------------------------------------------------------------------------
     INITIALISATION — Set initial state for back-to-top button
     -------------------------------------------------------------------------- */
  if (footerTopBtn) {
    footerTopBtn.style.transition = "opacity 0.4s ease, visibility 0.4s ease";
    footerTopBtn.style.opacity = "0";
    footerTopBtn.style.visibility = "hidden";
  }
})();