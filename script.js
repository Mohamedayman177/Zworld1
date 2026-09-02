document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector('.menu_toggle');
    const siteNav = document.querySelector('.site_nav');

    if (menuToggle && siteNav) {
      menuToggle.addEventListener('click', function () {
        const isOpen = siteNav.classList.toggle('is-open');
        menuToggle.classList.toggle('is-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
      });

      siteNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', function () {
          siteNav.classList.remove('is-open');
          menuToggle.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    const form = document.querySelector('.form_grid');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const button = form.querySelector('.form_submit');
        const originalText = button ? button.textContent : 'Send Request';

        if (button) {
          button.disabled = true;
          button.textContent = 'Sent';
        }

        setTimeout(() => {
          form.reset();
          if (button) {
            button.disabled = false;
            button.textContent = originalText;
          }
        }, 1400);
      });
    }

    const contactForm = document.querySelector('[data-contact-form]');
    if (contactForm) {
      contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const emailInput = contactForm.querySelector('input[type="email"]');
        const status = contactForm.querySelector('.footer_contact-status');

        if (!emailInput || !emailInput.checkValidity()) {
          emailInput?.reportValidity();
          return;
        }

        const recipient = 'info@zworld.com';
        const subject = encodeURIComponent('New contact request');
        const body = encodeURIComponent(`Please contact me at: ${emailInput.value}`);
        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

        if (status) {
          status.textContent = 'Thank you. Your email client is opening.';
        }
      });
    }

    gsap.registerPlugin(ScrollTrigger);

    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.05,
        wheelMultiplier: 0.7,
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    const workSections = document.querySelectorAll('[data-work="section"]');

    workSections.forEach((workSection) => {
      const workItems = workSection.querySelectorAll('[data-work="item"]');
      if (!workItems.length) return;

      const ghostContainer = document.createElement('div');
      ghostContainer.className = 'ghost_work-container';
      workSection.appendChild(ghostContainer);

      const ghostItems = Array.from(workItems).map(() => {
        const ghostItem = document.createElement('div');
        ghostItem.className = 'ghost_work-item';
        ghostItem.style.cssText = 'width: 100%; height: 300vh;';
        ghostContainer.appendChild(ghostItem);

        return ghostItem;
      });

      gsap.set('.work_item', {
        position: 'fixed',
        top: '0',
        clipPath: 'inset(100% 0 0% 0)'
      });

      workItems.forEach((element, index) => {
        const lines = element.querySelectorAll('[data-line]');
        const workImage = element.querySelector('[data-work="image"]');
        const videoContainer = element.querySelectorAll('[data-work="video"]');
        const overlay = element.querySelectorAll('[data-work="item-overlay"]');

        if (!workImage) return;

        gsap.set(workImage, {
          scale: 1.4,
          yPercent: 10
        });

        const stStarting = {
          trigger: ghostItems[index],
          scrub: true,
          start: 'top bottom',
          end: '+75vh top'
        };

        gsap.to(element, {
          clipPath: 'inset(0% 0 0 0)',
          scrollTrigger: stStarting
        });

        gsap.to(workImage, {
          yPercent: 10,
          scale: 1.2,
          scrollTrigger: stStarting
        });

        gsap.from(lines, {
          yPercent: 125,
          rotate: 2.5,
          ease: 'power2.inOut',
          duration: 1.25,
          scrollTrigger: {
            trigger: ghostItems[index],
            start: 'top 75%',
            toggleActions: 'play reverse restart reverse'
          }
        });

        gsap.to(workImage, {
          filter: 'blur(10px)',
          opacity: 0.3,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: ghostItems[index],
            scrub: true,
            start: '0 top',
            end: '35% top'
          }
        });

        gsap.from(videoContainer, {
          x: index % 2 === 0 ? '100vw' : '-100vw',
          scrollTrigger: {
            trigger: ghostItems[index],
            scrub: true,
            start: '0 top',
            end: '65% top',
            onLeave: () => {
              gsap.set(overlay, {
                display: 'flex',
                opacity: 0
              });
            }
          }
        });

        const stFinal = {
          trigger: ghostItems[index],
          scrub: true,
          start: '105% bottom',
          toggleActions: 'play reverse play reverse'
        };

        gsap.fromTo(overlay, { opacity: 0 }, {
          opacity: 1,
          scrollTrigger: stFinal
        });

        gsap.to(videoContainer, {
          yPercent: 15,
          scrollTrigger: stFinal
        });

        gsap.to(element, {
          filter: 'blur(1px)',
          scrollTrigger: stFinal
        });
      });
    });
});
