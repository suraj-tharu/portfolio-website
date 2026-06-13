// src/three-bg.js — Interactive 3D Cosmic Origin (Solar System) Background

export function initThreeBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (typeof THREE === 'undefined' || !canvas) {
    console.warn('[Three.js] Library not loaded or canvas missing — skipping 3D Solar System.');
    return;
  }

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    // Camera positioned to view the solar system at an angle
    camera.position.set(0, 150, 450);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // The Sun emits light outward
    const pointLight = new THREE.PointLight(0xffffff, 2, 800);
    scene.add(pointLight);

    const solarSystemGroup = new THREE.Group();
    // Tilt the entire solar system slightly for better viewing angle
    solarSystemGroup.rotation.x = Math.PI / 8;
    scene.add(solarSystemGroup);

    // --- The Sun (Cosmic Origin) ---
    const sunRadius = 25;
    const sunGeo = new THREE.SphereGeometry(sunRadius, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    solarSystemGroup.add(sun);

    // Sun Glow Halo
    const sunHaloGeo = new THREE.SphereGeometry(sunRadius * 1.5, 32, 32);
    const sunHaloMat = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const sunHalo = new THREE.Mesh(sunHaloGeo, sunHaloMat);
    solarSystemGroup.add(sunHalo);

    // --- Planets ---
    const planetData = [
      { name: 'Mercury', radius: 1.5, distance: 40, speed: 0.04, color: 0xa8a8a8 },
      { name: 'Venus',   radius: 3,   distance: 60, speed: 0.015, color: 0xe6e6fa },
      { name: 'Earth',   radius: 3.5, distance: 85, speed: 0.01, color: 0x0ea5e9 },
      { name: 'Mars',    radius: 2,   distance: 110, speed: 0.008, color: 0xef4444 },
      { name: 'Jupiter', radius: 10,  distance: 160, speed: 0.002, color: 0xf59e0b },
      { name: 'Saturn',  radius: 8,   distance: 220, speed: 0.0009, color: 0xfcd34d, hasRings: true },
      { name: 'Uranus',  radius: 6,   distance: 270, speed: 0.0004, color: 0x2dd4bf },
      { name: 'Neptune', radius: 6,   distance: 310, speed: 0.0001, color: 0x3b82f6 },
    ];

    const planetPivots = [];

    // Helper material for orbit rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide
    });

    planetData.forEach(data => {
      // Orbit Ring
      const orbitGeo = new THREE.RingGeometry(data.distance - 0.2, data.distance + 0.2, 64);
      const orbitMesh = new THREE.Mesh(orbitGeo, ringMat);
      orbitMesh.rotation.x = Math.PI / 2; // Lie flat
      solarSystemGroup.add(orbitMesh);

      // Pivot to control revolution
      const pivot = new THREE.Object3D();
      // Randomize starting position
      pivot.rotation.y = Math.random() * Math.PI * 2;
      solarSystemGroup.add(pivot);

      // Planet Mesh
      const planetGeo = new THREE.SphereGeometry(data.radius, 32, 32);
      const planetMat = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.6,
        metalness: 0.1
      });
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetMesh.position.set(data.distance, 0, 0);

      // Saturn Rings
      if (data.hasRings) {
        const saturnRingGeo = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.2, 32);
        const saturnRingMat = new THREE.MeshStandardMaterial({
          color: 0xc2b280,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide
        });
        const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
        saturnRing.rotation.x = Math.PI / 2.2;
        planetMesh.add(saturnRing);
      }

      pivot.add(planetMesh);
      
      // Store reference to animate
      planetPivots.push({
        pivot: pivot,
        mesh: planetMesh,
        speed: data.speed,
        rotationSpeed: 0.02 + Math.random() * 0.02
      });
    });

    // --- Starry Background ---
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 2500;
    const posArray = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 2000;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMat = new THREE.PointsMaterial({ size: 1.5, color: 0xffffff, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);


    // --- Interactivity & Animation ---
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    let scrollY = 0;
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    });

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      if (!document.body.classList.contains('a11y-reduce-motion')) {
        const t = clock.getElapsedTime();

        // Rotate Sun
        sun.rotation.y = t * 0.05;
        
        // Pulse Sun Halo slightly
        const haloScale = 1 + Math.sin(t * 2) * 0.05;
        sunHalo.scale.set(haloScale, haloScale, haloScale);

        // Slow rotation of entire solar system and stars for dynamic feel
        solarSystemGroup.rotation.y = t * 0.005;
        stars.rotation.y = t * 0.002;

        // Animate Planets
        planetPivots.forEach(p => {
          p.pivot.rotation.y += p.speed; // Revolution around sun
          p.mesh.rotation.y += p.rotationSpeed; // Rotation on axis
        });

        // Parallax effect on camera
        camera.position.x += (mouseX * 100 - camera.position.x) * 0.05;
        camera.position.y += (150 + -mouseY * 50 - camera.position.y) * 0.05;
        
        // Shift camera back slightly as we scroll to see more of the system
        const targetZ = 450 + scrollY * 0.2;
        camera.position.z += (targetZ - camera.position.z) * 0.05;
        
        camera.lookAt(solarSystemGroup.position);
      }

      renderer.render(scene, camera);
    }

    animate();

    // --- Resize Handler ---
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

  } catch (e) {
    console.warn('[Three.js] Solar System Render error:', e.message);
  }
}
