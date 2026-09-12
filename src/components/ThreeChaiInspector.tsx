import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Pause, Play, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';

interface ThreeChaiInspectorProps {
  className?: string;
}

export const ThreeChaiInspector: React.FC<ThreeChaiInspectorProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const controlsRef = useRef({
    azimuth: 0.5,
    elevation: 0.55,
    distance: 4.2,
    targetAzimuth: 0.5,
    targetElevation: 0.55,
    targetDistance: 4.2,
    autoRotate: true,
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    controlsRef.current.autoRotate = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 380;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 30);
    camera.position.set(2.2, 2.5, 3.4);
    camera.lookAt(0, 0.35, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Lighting (Monochromatic / Neutral PBR)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3.5, 6.0, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 2.5;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8edf2, 1.1);
    fillLight.position.set(-3.5, 3.0, 2.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.8);
    rimLight.position.set(-1.0, 5.0, -3.5);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x222222, 0.8);
    scene.add(ambientLight);

    // Group for cup, saucer, chai and details
    const group = new THREE.Group();
    scene.add(group);

    // Matte-black ceramic material
    const blackCeramicMat = new THREE.MeshPhysicalMaterial({
      color: 0x141416,
      roughness: 0.22,
      metalness: 0.08,
      clearcoat: 0.5,
      clearcoatRoughness: 0.15,
      reflectivity: 0.85,
    });

    // Platinum rim trim
    const platinumTrimMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f5f5,
      metalness: 0.96,
      roughness: 0.1,
      clearcoat: 0.9,
      reflectivity: 0.98,
    });

    // Saucer Base
    const saucerGeo = new THREE.CylinderGeometry(1.6, 0.95, 0.12, 64);
    const saucer = new THREE.Mesh(saucerGeo, blackCeramicMat);
    saucer.position.set(0, 0.06, 0);
    saucer.castShadow = true;
    saucer.receiveShadow = true;
    group.add(saucer);

    // Saucer platinum outer rim
    const saucerRimGeo = new THREE.TorusGeometry(1.58, 0.022, 16, 64);
    saucerRimGeo.rotateX(Math.PI / 2);
    const saucerRim = new THREE.Mesh(saucerRimGeo, platinumTrimMat);
    saucerRim.position.set(0, 0.12, 0);
    group.add(saucerRim);

    // Saucer indentation ring
    const saucerInnerRimGeo = new THREE.TorusGeometry(0.72, 0.015, 16, 64);
    saucerInnerRimGeo.rotateX(Math.PI / 2);
    const saucerInnerRim = new THREE.Mesh(saucerInnerRimGeo, platinumTrimMat);
    saucerInnerRim.position.set(0, 0.12, 0);
    group.add(saucerInnerRim);

    // Tea Cup Body
    const cupPoints: THREE.Vector2[] = [];
    cupPoints.push(new THREE.Vector2(0.55, 0.0));
    cupPoints.push(new THREE.Vector2(0.68, 0.25));
    cupPoints.push(new THREE.Vector2(0.85, 0.65));
    cupPoints.push(new THREE.Vector2(0.98, 1.05));
    cupPoints.push(new THREE.Vector2(0.95, 1.05));
    cupPoints.push(new THREE.Vector2(0.82, 0.65));
    cupPoints.push(new THREE.Vector2(0.65, 0.25));
    cupPoints.push(new THREE.Vector2(0.52, 0.05));
    cupPoints.push(new THREE.Vector2(0.0, 0.05));

    const cupGeo = new THREE.LatheGeometry(cupPoints, 64);
    const cup = new THREE.Mesh(cupGeo, blackCeramicMat);
    cup.position.set(0, 0.12, 0);
    cup.castShadow = true;
    cup.receiveShadow = true;
    group.add(cup);

    // Cup Platinum Rim
    const cupRimGeo = new THREE.TorusGeometry(0.965, 0.024, 16, 64);
    cupRimGeo.rotateX(Math.PI / 2);
    const cupRim = new THREE.Mesh(cupRimGeo, platinumTrimMat);
    cupRim.position.set(0, 1.17, 0);
    group.add(cupRim);

    // Ergonomic Ceramic Handle
    const handleCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.88, 0.98, 0),
      new THREE.Vector3(1.48, 0.88, 0),
      new THREE.Vector3(1.38, 0.38, 0),
      new THREE.Vector3(0.68, 0.35, 0)
    );
    const handleGeo = new THREE.TubeGeometry(handleCurve, 32, 0.08, 16, false);
    const handle = new THREE.Mesh(handleGeo, blackCeramicMat);
    handle.position.set(0, 0.12, 0);
    handle.castShadow = true;
    group.add(handle);

    // Karak Chai Liquid Surface (Procedural Rich Caramel with Froth)
    const chaiCanvas = document.createElement('canvas');
    chaiCanvas.width = 512;
    chaiCanvas.height = 512;
    const chaiCtx = chaiCanvas.getContext('2d')!;
    const cGrad = chaiCtx.createRadialGradient(256, 256, 30, 256, 256, 256);
    cGrad.addColorStop(0, '#c7894a');
    cGrad.addColorStop(0.7, '#a56832');
    cGrad.addColorStop(0.92, '#854e20');
    cGrad.addColorStop(1, '#562f0f');
    chaiCtx.fillStyle = cGrad;
    chaiCtx.fillRect(0, 0, 512, 512);

    // Froth bubbles
    for (let a = 0; a < Math.PI * 2; a += 0.035) {
      const rad = 236 + (Math.random() - 0.5) * 16;
      const x = 256 + Math.cos(a) * rad;
      const y = 256 + Math.sin(a) * rad;
      chaiCtx.fillStyle = 'rgba(255, 240, 215, 0.7)';
      chaiCtx.beginPath();
      chaiCtx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
      chaiCtx.fill();
    }

    const chaiTex = new THREE.CanvasTexture(chaiCanvas);
    const chaiMat = new THREE.MeshPhysicalMaterial({
      color: 0xba7c40,
      map: chaiTex,
      roughness: 0.12,
      metalness: 0.04,
      clearcoat: 0.85,
      reflectivity: 0.8,
    });
    const chaiGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.02, 48);
    const chaiMesh = new THREE.Mesh(chaiGeo, chaiMat);
    chaiMesh.position.set(0, 1.08, 0);
    chaiMesh.receiveShadow = true;
    group.add(chaiMesh);

    // Cardamom Pods on Saucer Rim
    const podGeo = new THREE.ConeGeometry(0.07, 0.22, 8);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0x4a5d3f,
      roughness: 0.75,
    });
    const pod1 = new THREE.Mesh(podGeo, podMat);
    pod1.position.set(-1.0, 0.16, 0.6);
    pod1.rotation.set(Math.PI / 2.2, 0.4, 0.8);
    group.add(pod1);

    const pod2 = new THREE.Mesh(podGeo, podMat);
    pod2.position.set(-1.12, 0.16, 0.48);
    pod2.rotation.set(Math.PI / 2.1, -0.3, 1.4);
    group.add(pod2);

    // Micro Saffron Threads
    const threadGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.14, 4);
    const saffronMat = new THREE.MeshBasicMaterial({ color: 0xb91c1c });
    const saf1 = new THREE.Mesh(threadGeo, saffronMat);
    saf1.position.set(0.08, 1.095, -0.05);
    saf1.rotation.set(Math.PI / 2, 0, 0.4);
    group.add(saf1);

    const saf2 = new THREE.Mesh(threadGeo, saffronMat);
    saf2.position.set(-0.12, 1.095, 0.08);
    saf2.rotation.set(Math.PI / 2, 0, -0.7);
    group.add(saf2);

    // Volumetric Steam Simulation
    const steamCount = 38;
    const steamParticles: Array<{
      mesh: THREE.Mesh;
      speed: number;
      baseScale: number;
      offsetAngle: number;
      radius: number;
    }> = [];

    const steamCanvas = document.createElement('canvas');
    steamCanvas.width = 64;
    steamCanvas.height = 64;
    const sCtx = steamCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
    sGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    sGrad.addColorStop(0.3, 'rgba(250, 250, 250, 0.4)');
    sGrad.addColorStop(1, 'rgba(240, 240, 240, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 64, 64);
    const steamTex = new THREE.CanvasTexture(steamCanvas);

    const steamPlaneGeo = new THREE.PlaneGeometry(0.24, 0.24);
    for (let i = 0; i < steamCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        map: steamTex,
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const p = new THREE.Mesh(steamPlaneGeo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.45;
      const y = 1.15 + (i / steamCount) * 1.5;
      p.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      group.add(p);
      steamParticles.push({
        mesh: p,
        speed: 0.007 + Math.random() * 0.005,
        baseScale: 0.8 + Math.random() * 0.7,
        offsetAngle: Math.random() * Math.PI * 2,
        radius,
      });
    }

    // Shadow Catcher plane
    const floorGeo = new THREE.PlaneGeometry(6, 6);
    floorGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const floor = new THREE.Mesh(floorGeo, shadowMat);
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Pointer controls for 360-degree orbit
    const onPointerDown = (e: PointerEvent) => {
      controlsRef.current.isDragging = true;
      controlsRef.current.lastX = e.clientX;
      controlsRef.current.lastY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!controlsRef.current.isDragging) return;
      const dx = e.clientX - controlsRef.current.lastX;
      const dy = e.clientY - controlsRef.current.lastY;
      controlsRef.current.lastX = e.clientX;
      controlsRef.current.lastY = e.clientY;

      controlsRef.current.targetAzimuth -= dx * 0.008;
      controlsRef.current.targetElevation = Math.max(
        0.18,
        Math.min(1.25, controlsRef.current.targetElevation - dy * 0.008)
      );
    };

    const onPointerUp = () => {
      controlsRef.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.003;
      controlsRef.current.targetDistance = Math.max(
        2.6,
        Math.min(6.2, controlsRef.current.targetDistance + delta)
      );
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Render loop
    let animId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      // Auto-rotation
      if (controlsRef.current.autoRotate && !controlsRef.current.isDragging) {
        controlsRef.current.targetAzimuth += 0.005;
      }

      // Smooth camera interpolation
      controlsRef.current.azimuth += (controlsRef.current.targetAzimuth - controlsRef.current.azimuth) * 0.08;
      controlsRef.current.elevation += (controlsRef.current.targetElevation - controlsRef.current.elevation) * 0.08;
      controlsRef.current.distance += (controlsRef.current.targetDistance - controlsRef.current.distance) * 0.08;

      const az = controlsRef.current.azimuth;
      const el = controlsRef.current.elevation;
      const dist = controlsRef.current.distance;

      camera.position.x = dist * Math.cos(el) * Math.sin(az);
      camera.position.y = dist * Math.sin(el) + 0.35;
      camera.position.z = dist * Math.cos(el) * Math.cos(az);
      camera.lookAt(0, 0.45, 0);

      // Animate steam billows
      steamParticles.forEach((sp, idx) => {
        sp.mesh.position.y += sp.speed;
        const progress = (sp.mesh.position.y - 1.15) / 1.5;
        if (progress > 1.0) {
          sp.mesh.position.y = 1.15;
        }
        const currentProgress = (sp.mesh.position.y - 1.15) / 1.5;
        const drift = Math.sin(elapsed * 1.5 + sp.offsetAngle) * 0.08 * currentProgress;
        sp.mesh.position.x = Math.cos(sp.offsetAngle) * sp.radius + drift;
        sp.mesh.position.z = Math.sin(sp.offsetAngle) * sp.radius + drift;

        const scale = sp.baseScale * (1.0 + currentProgress * 2.2);
        sp.mesh.scale.set(scale, scale, 1);
        (sp.mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(currentProgress * Math.PI) * 0.16;
        sp.mesh.lookAt(camera.position);
      });

      renderer.render(scene, camera);
    };

    render();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleZoom = (dir: 'in' | 'out') => {
    const delta = dir === 'in' ? -0.5 : 0.5;
    controlsRef.current.targetDistance = Math.max(
      2.6,
      Math.min(6.2, controlsRef.current.targetDistance + delta)
    );
  };

  const handleReset = () => {
    controlsRef.current.targetAzimuth = 0.5;
    controlsRef.current.targetElevation = 0.55;
    controlsRef.current.targetDistance = 4.2;
    setIsAutoRotating(true);
  };

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing touch-none"
        title="Interactive 3D Karak Chai Cup - Drag to rotate 360°"
      />

      {/* Top Floating Badge */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/90 border border-white/20 text-[10px] font-semibold text-white backdrop-blur-md">
        <Sparkles className="w-3 h-3 text-white" />
        <span>3D Karak Chai • 360° View</span>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1 p-1 rounded-xl bg-black/90 border border-neutral-800 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pause rotation' : 'Resume rotation'}
          className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
            isAutoRotating ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <button
          type="button"
          onClick={() => handleZoom('in')}
          title="Zoom in"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom('out')}
          title="Zoom out"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          title="Reset angle"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCw className="w-3 h-3" />
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-neutral-400 pointer-events-none">
        <span className="bg-black/80 px-2 py-0.5 rounded border border-neutral-800">
          Click &amp; drag to inspect
        </span>
        <span className="bg-black/80 px-2 py-0.5 rounded border border-neutral-800 font-mono text-white">
          Real-time Steam
        </span>
      </div>
    </div>
  );
};
