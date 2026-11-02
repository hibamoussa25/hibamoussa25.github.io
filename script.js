document.addEventListener("DOMContentLoaded", () => {
  // Animated job titles
  const roleElement = document.getElementById("role-text");
  const roles = [
    "Data Engineer",
    "Business Analyst",
    "Data Analyst",
    "Cybersecurity Analyst",
    "ML Engineer",
    "Developer"
  ];

  if (roleElement) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    const typeSpeed = 75;
    const deleteSpeed = 38;
    const pauseAfterWord = 1400;

    function animateRole() {
      const currentRole = roles[roleIndex];

      if (deleting) {
        charIndex--;
        roleElement.textContent = currentRole.slice(0, Math.max(0, charIndex));

        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          window.setTimeout(animateRole, 280);
          return;
        }
        window.setTimeout(animateRole, deleteSpeed);
      } else {
        const nextRole = roles[roleIndex];
        charIndex++;
        roleElement.textContent = nextRole.slice(0, charIndex);

        if (charIndex >= nextRole.length) {
          deleting = true;
          window.setTimeout(animateRole, pauseAfterWord);
          return;
        }
        window.setTimeout(animateRole, typeSpeed);
      }
    }

    window.setTimeout(animateRole, pauseAfterWord);
  }

  // Mobile navigation menu
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });

    document.addEventListener("click", (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });
  }


  // Reveal sections and cards as they enter the viewport.
  const revealTargets = document.querySelectorAll(
    '.section .container, .info-card, .project-card, .timeline-card, .contact-panel, .hero-copy, .about-dashboard, .cert-card'
  );
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach((element, index) => {
      element.classList.add('js-reveal');
      if (element.matches('.info-card, .project-card, .timeline-card')) {
        element.style.transitionDelay = `${(index % 3) * 90}ms`;
      }
    });
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach((element) => revealObserver.observe(element));
  }


  // Make navigation feel responsive: highlight the section currently in view.
  const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const pageSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && pageSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sectionLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.setAttribute('aria-current', 'location');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    pageSections.forEach((section) => sectionObserver.observe(section));
  }

  // Click a skill, experience, or project card to select it with a clear visual response.
  const interactiveCards = document.querySelectorAll('.info-card, .project-card, .timeline-card');
  interactiveCards.forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');

    const toggleCard = () => {
      const selected = card.classList.toggle('is-selected');
      card.setAttribute('aria-pressed', String(selected));
    };

    card.addEventListener('click', (event) => {
      // Don't interfere with links/buttons if added inside a card in the future.
      if (event.target.closest('a, button')) return;
      toggleCard();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCard();
      }
    });
  });

  // Small click feedback for the main call-to-action buttons.
  document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.add('button-clicked');
      window.setTimeout(() => button.classList.remove('button-clicked'), 260);
    });
  });

  // Current year in footer
  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
});



/* Interactive skill familiarity readout */
(() => {
  const buttons = document.querySelectorAll('.skill-logo-button');
  const name = document.getElementById('familiaritySkillName');
  const fill = document.getElementById('familiarityFill');
  const value = document.getElementById('familiarityValue');
  const progress = document.getElementById('familiarityProgress');
  if (!buttons.length || !name || !fill || !value || !progress) return;

  function showSkill(button) {
    const level = Number(button.dataset.level);
    buttons.forEach(item => item.classList.toggle('is-active', item === button));
    name.textContent = button.dataset.skill;
    fill.style.width = `${level}%`;
    value.textContent = `${level}% familiarity · self-assessed`;
    progress.setAttribute('aria-valuenow', String(level));
  }

  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => showSkill(button));
    button.addEventListener('focus', () => showSkill(button));
    button.addEventListener('click', () => showSkill(button));
  });
})();


// Back-to-top link: return to the very top of the page smoothly.
document.querySelectorAll('.back-to-top').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });
});
