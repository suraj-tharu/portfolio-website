// src/three-bg.js — Interactive 3D GIS Earth Background

export function initThreeBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (typeof THREE === 'undefined' || !canvas) {
    console.warn('[Three.js] Library not loaded or canvas missing — skipping 3D Earth.');
    return;
  }

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 300);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(500, 300, 500);
    scene.add(sunLight);

    const backLight = new THREE.DirectionalLight(0x0ea5e9, 1.2);
    backLight.position.set(-500, -300, -500);
    scene.add(backLight);

    // --- Earth Group ---
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.5 * Math.PI / 180; // Earth's axial tilt
    scene.add(earthGroup);

    // 1. Earth Sphere (Using a stylized wireframe + solid base for GIS look)
    const earthRadius = 70;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    
    // We create a dark blue base
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x0f172a,
      emissive: 0x020617,
      specular: 0x38bdf8,
      shininess: 20,
      transparent: true,
      opacity: 0.95
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // 2. Wireframe Overlay (to give it a technical, engineering feel)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wireMesh = new THREE.Mesh(earthGeo, wireMat);
    wireMesh.scale.set(1.01, 1.01, 1.01);
    earthGroup.add(wireMesh);

    // 3. Atmosphere Glow
    const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.15, 64, 64);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // --- GIS Markers (Plotting real coordinates) ---
    // Helper to convert Lat/Lon to 3D Cartesian coordinates
    const getCoordinatesFromLatLng = (lat, lng, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));

      return new THREE.Vector3(x, y, z);
    };

    const locations = [
      { name: 'Nepal (Kathmandu)', lat: 27.7172, lng: 85.3240, color: 0x10b981 }, // Green
      { name: 'Surkhet (Research)', lat: 28.6015, lng: 81.6322, color: 0xf59e0b }, // Amber
      { name: 'Nawalparasi', lat: 27.5319, lng: 83.6922, color: 0x8b5cf6 },       // Purple
      { name: 'USA (Silicon Valley)', lat: 37.3875, lng: -122.0575, color: 0x38bdf8 } // Blue
    ];

    const markers = [];

    locations.forEach(loc => {
      // Create glowing point
      const markerGeo = new THREE.SphereGeometry(1.5, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ 
        color: loc.color,
        transparent: true,
        opacity: 0.8
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);

      // Add a larger glowing halo around the marker
      const haloGeo = new THREE.SphereGeometry(3, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: loc.color,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      marker.add(halo);

      // Position based on Lat/Lng
      const pos = getCoordinatesFromLatLng(loc.lat, loc.lng, earthRadius + 0.5);
      marker.position.copy(pos);
      
      earthGroup.add(marker);
      
      // Store for animation pulse
      markers.push({ mesh: marker, halo: halo, originalScale: 1, pulseAngle: Math.random() * Math.PI * 2 });
    });

    // --- Starry Background ---
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 1500;
    const posArray = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 2000;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMat = new THREE.PointsMaterial({ size: 1.5, color: 0xffffff, transparent: true, opacity: 0.7 });
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

        // Rotate the Earth
        earthGroup.rotation.y = t * 0.05; // 0.05 radians per second
        stars.rotation.y = t * 0.01;

        // Pulse the GIS markers
        markers.forEach(m => {
          m.pulseAngle += 0.05;
          const scale = 1 + Math.sin(m.pulseAngle) * 0.4;
          m.halo.scale.set(scale, scale, scale);
          m.halo.material.opacity = 0.3 * (1.5 - scale);
        });

        // Parallax effect on camera
        camera.position.x += (mouseX * 50 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 50 - camera.position.y) * 0.05;
        // Shift camera down slightly as we scroll
        camera.position.z = 300 + scrollY * 0.1;
        camera.lookAt(scene.position);
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
    console.warn('[Three.js] Earth Render error:', e.message);
  }
}
