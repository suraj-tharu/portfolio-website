// src/animations.js — GSAP Animations, Scroll Effects & Skill Charts

export function initAnimations() {
  // --- Lenis Smooth Scrolling ---
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0, 0);
    }
  }

  // --- GSAP Hero Text Reveal ---
  if (typeof gsap !== 'undefined') {
    gsap.from('.hero-word', {
      y: 30, opacity: 0, duration: 1,
      stagger: 0.1, ease: 'power4.out', delay: 0.2
    });

    gsap.to('#hero-photo-wrap', {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.5, ease: 'power3.inOut', delay: 0.5
    });

    // --- GSAP ScrollTrigger Storytelling (Replacing AOS) ---
    try {
      gsap.registerPlugin(ScrollTrigger);

      // Animate elements that originally had data-aos
      const aosElements = document.querySelectorAll('[data-aos]');
      
      aosElements.forEach(el => {
        const animationType = el.getAttribute('data-aos');
        const delayRaw = el.getAttribute('data-aos-delay');
        const delay = delayRaw ? parseInt(delayRaw) / 1000 : 0;
        
        let fromVars = { opacity: 0, duration: 1, delay: delay, ease: 'power3.out' };
        
        if (animationType === 'fade-up') {
          fromVars.y = 50;
        } else if (animationType === 'fade-down') {
          fromVars.y = -50;
        } else if (animationType === 'fade-right') {
          fromVars.x = -50;
        } else if (animationType === 'fade-left') {
          fromVars.x = 50;
        } else if (animationType === 'zoom-in') {
          fromVars.scale = 0.8;
        }
        
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          ...fromVars
        });
      });

      // Special animation for Project Cards (Staggered)
      const projectSections = document.querySelectorAll('#projects, #featured-projects');
      projectSections.forEach(section => {
        const cards = section.querySelectorAll('.project-card');
        if (cards.length > 0) {
          gsap.from(cards, {
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)'
          });
        }
      });

      // --- Parallax on Background Orbs ---
      document.querySelectorAll('.orb').forEach((orb, i) => {
        const speed = i % 2 === 0 ? -0.3 : 0.3;
        gsap.to(orb, {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: orb.closest('section') || document.body,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      });

      // --- Stagger Section Headings ---
      document.querySelectorAll('.sec-num, .section-heading').forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
          },
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      });

    } catch (e) {
      console.warn('[GSAP] ScrollTrigger not available:', e.message);
    }
  }

  // --- Chart.js Radar Chart ---
  if (typeof Chart !== 'undefined') {
    try {
      const ctx = document.getElementById('radarChart').getContext('2d');
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['GIS & RS Expertise', 'ML Proficiency', 'Innovation', 'Research Output', 'Programming'],
          datasets: [{
            label: 'LULC Analysis (RF)',
            data: [95, 88, 85, 92, 78],
            backgroundColor: 'rgba(14, 165, 233, 0.2)',
            borderColor: 'rgba(14, 165, 233, 1)',
            pointBackgroundColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 2,
          }, {
            label: 'Earthquake Monitoring',
            data: [80, 75, 70, 65, 85],
            backgroundColor: 'rgba(234, 179, 8, 0.2)',
            borderColor: 'rgba(234, 179, 8, 1)',
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { color: 'rgba(148, 163, 184, 0.2)' },
              grid: { color: 'rgba(148, 163, 184, 0.2)' },
              pointLabels: { color: '#94a3b8', font: { family: 'Space Mono', size: 10 } },
              ticks: { display: false }
            }
          },
          plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Space Mono', size: 10 } } } }
        }
      });
    } catch (e) {
      console.warn('[Chart.js] Radar chart error:', e.message);
    }
  }

  // --- D3 Force Directed Skills Graph ---
  if (typeof d3 === 'undefined') {
    console.warn('[D3] Library not loaded — skipping skills graph.');
    return;
  }
  try {
    const graphEl = document.getElementById('d3-skills-graph');
    if (!graphEl) return;
    const width = graphEl.clientWidth;
    const height = 400;

    const nodes = [
      { id: 'GIS', group: 1, radius: 26 },
      { id: 'QGIS', group: 1, radius: 20 },
      { id: 'ArcGIS', group: 1, radius: 18 },
      { id: 'GEE', group: 2, radius: 24 },
      { id: 'Python', group: 2, radius: 22 },
      { id: 'R Lang', group: 2, radius: 18 },
      { id: 'ML / RF', group: 3, radius: 22 },
      { id: 'LULC', group: 3, radius: 20 },
      { id: 'Remote Sensing', group: 3, radius: 20 }
    ];
    const links = [
      { source: 'GIS', target: 'QGIS' },
      { source: 'GIS', target: 'ArcGIS' },
      { source: 'GIS', target: 'LULC' },
      { source: 'GEE', target: 'Python' },
      { source: 'GEE', target: 'LULC' },
      { source: 'ML / RF', target: 'Python' },
      { source: 'ML / RF', target: 'LULC' },
      { source: 'Remote Sensing', target: 'GEE' },
      { source: 'Remote Sensing', target: 'LULC' },
      { source: 'R Lang', target: 'Python' },
    ];

    const svg = d3.select('#d3-skills-graph').append('svg')
      .attr('width', '100%').attr('height', '100%')
      .attr('viewBox', [0, 0, width, height]);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(90))
      .force('charge', d3.forceManyBody().strength(-320))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g').attr('stroke', '#334155').attr('stroke-opacity', 0.6)
      .selectAll('line').data(links).join('line').attr('stroke-width', 2);

    function dragBehavior(sim) {
      function dragstarted(event) { if (!event.active) sim.alphaTarget(0.3).restart(); event.subject.fx = event.subject.x; event.subject.fy = event.subject.y; }
      function dragged(event) { event.subject.fx = event.x; event.subject.fy = event.y; }
      function dragended(event) { if (!event.active) sim.alphaTarget(0); event.subject.fx = null; event.subject.fy = null; }
      return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
    }

    const node = svg.append('g').selectAll('circle').data(nodes).join('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.group === 1 ? '#0ea5e9' : d.group === 2 ? '#10b981' : '#a855f7')
      .attr('stroke', '#fff').attr('stroke-width', 1.5)
      .call(dragBehavior(simulation));

    const labels = svg.append('g').selectAll('text').data(nodes).join('text')
      .text(d => d.id).attr('font-size', '10px').attr('font-family', 'Space Mono')
      .attr('fill', document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a')
      .attr('dx', 12).attr('dy', 4);

    simulation.on('tick', () => {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      node.attr('cx', d => Math.max(d.radius, Math.min(width - d.radius, d.x)))
        .attr('cy', d => Math.max(d.radius, Math.min(height - d.radius, d.y)));
      labels.attr('x', d => Math.max(d.radius, Math.min(width - d.radius, d.x)))
        .attr('y', d => Math.max(d.radius, Math.min(height - d.radius, d.y)));
    });
  } catch (e) {
    console.warn('[D3] Skills graph error:', e.message);
  }
}
