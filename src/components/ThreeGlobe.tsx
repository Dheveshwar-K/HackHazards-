import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const ThreeGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Group to hold all globe objects (helps with rotation)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Solid Inner Globe (Deep Ocean Blue)
    const innerGeo = new THREE.SphereGeometry(5, 64, 64);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x041B2D,
      transparent: true,
      opacity: 0.75,
    });
    const innerGlobe = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerGlobe);

    // 2. Wireframe Outer Globe (Electric Cyan Digital Grid)
    const outerGeo = new THREE.SphereGeometry(5.08, 32, 32);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const outerGlobe = new THREE.Mesh(outerGeo, outerMat);
    globeGroup.add(outerGlobe);

    // 3. Floating Current Data Lines (Curved arcs connecting coordinates)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00FF9D, // Neon Green
      transparent: true,
      opacity: 0.6,
    });

    const createArc = (startLat: number, startLon: number, endLat: number, endLon: number) => {
      // Helper to convert lat/lon to 3D Cartesian coordinates
      const latLonToVector3 = (lat: number, lon: number, radius: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
          -(radius * Math.sin(phi) * Math.sin(theta)),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.cos(theta)
        );
      };

      const start = latLonToVector3(startLat, startLon, 5.1);
      const end = latLonToVector3(endLat, endLon, 5.1);

      // Create a quadratic bezier curve for the arc
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const midLength = mid.length();
      mid.normalize().multiplyScalar(midLength + 1.5); // lift arc up in the middle

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(30);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geometry, lineMaterial);
    };

    // Add some random simulated currents
    const arcs = [
      createArc(20, -40, 45, -10),   // Gulf Stream approx
      createArc(-10, 110, -35, 115), // Indo-Pacific
      createArc(5, 80, 25, 90),      // Bay of Bengal
      createArc(-20, -80, -5, -40),  // Brazil Current
      createArc(35, 130, 42, 145),   // Kuroshio approx
    ];
    arcs.forEach(arc => globeGroup.add(arc));

    // 4. Glowing Atmosphere / Halo effect
    const haloGeo = new THREE.SphereGeometry(5.4, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    scene.add(halo);

    // 5. Satellite Orbit Path
    const orbitRadius = 7.5;
    const orbitSegments = 64;
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPositions = [];
    // Orbit is inclined
    const angleInclination = Math.PI / 6; // 30 degrees inclination
    for (let i = 0; i <= orbitSegments; i++) {
      const theta = (i / orbitSegments) * Math.PI * 2;
      const x = orbitRadius * Math.cos(theta);
      const y = orbitRadius * Math.sin(theta) * Math.sin(angleInclination);
      const z = orbitRadius * Math.sin(theta) * Math.cos(angleInclination);
      orbitPositions.push(x, y, z);
    }
    orbitGeometry.setAttribute("position", new THREE.Float32BufferAttribute(orbitPositions, 3));
    const orbitLineMat = new THREE.LineBasicMaterial({
      color: 0x00E5FF,
      transparent: true,
      opacity: 0.12,
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitLineMat);
    scene.add(orbitLine);

    // 6. Satellite Mesh
    const satGeo = new THREE.BoxGeometry(0.25, 0.15, 0.45);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x00FF9D }); // Neon green satellite
    const satellite = new THREE.Mesh(satGeo, satMat);
    
    // Mini solar panels for satellite
    const panelGeo = new THREE.BoxGeometry(0.8, 0.02, 0.2);
    const panelMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.8 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    satellite.add(panel);
    scene.add(satellite);

    // Ambient particles/stars around the globe
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 8 + Math.random() * 8;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      positions.push(x, y, z);
    }
    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00E5FF,
      size: 0.08,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation variables
    let animationFrameId: number;
    let satAngle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate globe group
      globeGroup.rotation.y += 0.002;
      globeGroup.rotation.x += 0.0003;

      // Rotate particle field slowly
      particles.rotation.y -= 0.0005;

      // Animate satellite position along orbit
      satAngle += 0.008;
      satellite.position.x = orbitRadius * Math.cos(satAngle);
      satellite.position.y = orbitRadius * Math.sin(satAngle) * Math.sin(angleInclination);
      satellite.position.z = orbitRadius * Math.sin(satAngle) * Math.cos(angleInclination);
      
      // Orient satellite along its flight path
      satellite.lookAt(
        orbitRadius * Math.cos(satAngle + 0.1),
        orbitRadius * Math.sin(satAngle + 0.1) * Math.sin(angleInclination),
        orbitRadius * Math.sin(satAngle + 0.1) * Math.cos(angleInclination)
      );

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Dispose materials/geometries
      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      lineMaterial.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      orbitGeometry.dispose();
      orbitLineMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      panelGeo.dispose();
      panelMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      {/* HUD Circular Rings Overlay (Iron Man styling) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Radar Ring 1 */}
        <div className="w-[85%] h-[85%] rounded-full border border-dashed border-cyan-400/10 animate-[spin_40s_linear_infinite]" />
        {/* Radar Ring 2 */}
        <div className="absolute w-[70%] h-[70%] rounded-full border border-cyan-400/5 animate-[spin_25s_linear_infinite_reverse]" />
        {/* Crosshair Overlay */}
        <div className="absolute w-full h-[1px] bg-cyan-400/10" />
        <div className="absolute h-full w-[1px] bg-cyan-400/10" />
        
        {/* Telemetry labels */}
        <div className="absolute top-4 left-4 font-numeric text-[9px] text-cyan-400/40 tracking-wider">
          ORBITAL TLE: 25544U 98067A<br />
          ALTITUDE: 418.62 KM<br />
          VELOCITY: 7.66 KM/S
        </div>
        <div className="absolute bottom-4 right-4 font-numeric text-[9px] text-accent/40 tracking-wider text-right">
          SYS_STATUS: NOMINAL<br />
          ANTENNA_GRID: active<br />
          SATELLITE_LOCK: 09/09
        </div>
      </div>
    </div>
  );
};
