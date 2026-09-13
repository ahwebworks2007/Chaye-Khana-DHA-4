import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBreakfastSceneProps {
  className?: string;
  onSceneReady?: () => void;
}

export const ThreeBreakfastScene: React.FC<ThreeBreakfastSceneProps> = ({
  className = '',
  onSceneReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Spherical Orbit Camera Controls State (Fixed Angle)
  const controlsRef = useRef({
    azimuth: 0.38, // Fixed Horizontal angle matching reference image
    elevation: 0.32, // Fixed Vertical pitch angle matching reference image
    distance: 4.8, // Fixed Camera distance
    targetDistance: 4.8,
    targetLookAt: new THREE.Vector3(0.25, 0.18, -0.15), // Center plate & tea cup nicely
    currentLookAt: new THREE.Vector3(0.25, 0.18, -0.15),
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene & High-Precision WebGL Renderer Setup ---
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background to seamlessly integrate with hero overlay

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 560;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(2.4, 2.9, 4.4);
    camera.lookAt(0, 0.22, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    // Cap pixel ratio to maximize performance (1.5 on mobile, 2.0 on desktop)
    const maxPixelRatio = typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 2. Culinary Studio HDR Environment (PMREMGenerator) ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext('2d');
    if (envCtx) {
      const envGrad = envCtx.createLinearGradient(0, 0, 0, 512);
      envGrad.addColorStop(0, '#1c1611');
      envGrad.addColorStop(0.5, '#0d0a08');
      envGrad.addColorStop(1, '#030303');
      envCtx.fillStyle = envGrad;
      envCtx.fillRect(0, 0, 1024, 512);

      // Softbox overhead studio light
      const softbox = envCtx.createRadialGradient(512, 110, 10, 512, 110, 280);
      softbox.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      softbox.addColorStop(0.35, 'rgba(250, 246, 240, 0.85)');
      softbox.addColorStop(0.7, 'rgba(235, 228, 218, 0.3)');
      softbox.addColorStop(1, 'rgba(200, 190, 180, 0)');
      envCtx.fillStyle = softbox;
      envCtx.fillRect(0, 0, 1024, 340);

      // Warm honey kicker for tea & butter reflections
      const warmKicker = envCtx.createRadialGradient(180, 220, 10, 180, 220, 200);
      warmKicker.addColorStop(0, 'rgba(255, 240, 210, 0.95)');
      warmKicker.addColorStop(0.5, 'rgba(230, 190, 140, 0.45)');
      warmKicker.addColorStop(1, 'rgba(160, 120, 80, 0)');
      envCtx.fillStyle = warmKicker;
      envCtx.fillRect(0, 60, 440, 340);

      // Cool daylight rim reflection
      const coolRim = envCtx.createRadialGradient(850, 230, 10, 850, 230, 210);
      coolRim.addColorStop(0, 'rgba(240, 246, 255, 0.8)');
      coolRim.addColorStop(0.55, 'rgba(195, 210, 230, 0.3)');
      coolRim.addColorStop(1, 'rgba(140, 155, 175, 0)');
      envCtx.fillStyle = coolRim;
      envCtx.fillRect(620, 60, 404, 340);
    }
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    scene.environment = envMap;

    // --- 3. Physically Based 3-Point Food Photography Lighting ---
    const keyLight = new THREE.DirectionalLight(0xfff6ea, 3.2);
    keyLight.position.set(3.6, 7.5, 3.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1.0;
    keyLight.shadow.camera.far = 16.0;
    keyLight.shadow.camera.left = -4.2;
    keyLight.shadow.camera.right = 4.2;
    keyLight.shadow.camera.top = 4.2;
    keyLight.shadow.camera.bottom = -4.2;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.radius = 3.0;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe4eefa, 0.95);
    fillLight.position.set(-4.5, 4.2, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.8);
    rimLight.position.set(-1.2, 5.8, -4.8);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x242426, 0.7);
    scene.add(ambientLight);

    // Focused Spotlights for Tea & Plate
    const chaiSpot = new THREE.SpotLight(0xfffaee, 3.2, 9.0, Math.PI / 4.8, 0.45, 1.2);
    chaiSpot.position.set(1.8, 4.8, 1.4);
    chaiSpot.target.position.set(1.4, 0.4, -0.2);
    scene.add(chaiSpot);
    scene.add(chaiSpot.target);

    const plateSpot = new THREE.SpotLight(0xffffff, 2.6, 8.5, Math.PI / 3.8, 0.5, 1.1);
    plateSpot.position.set(-0.8, 5.4, 2.4);
    plateSpot.target.position.set(-0.5, 0.2, 0.1);
    scene.add(plateSpot);
    scene.add(plateSpot.target);

    // --- 4. Procedural PBR Texture Map Generators ---
    const createCeramicTextures = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#f8f4ec';
      ctx.fillRect(0, 0, 1024, 1024);

      const radGrad = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
      radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      radGrad.addColorStop(0.65, 'rgba(244, 235, 222, 0.15)');
      radGrad.addColorStop(1, 'rgba(222, 204, 180, 0.35)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      for (let i = 0; i < 1600; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const r = Math.random() * 1.8 + 0.3;
        const alpha = Math.random() * 0.12 + 0.02;
        ctx.fillStyle = Math.random() > 0.3 ? `rgba(62, 44, 30, ${alpha})` : `rgba(130, 100, 78, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 512;
      bumpCanvas.height = 512;
      const bumpCtx = bumpCanvas.getContext('2d')!;
      bumpCtx.fillStyle = '#808080';
      bumpCtx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 1200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const gray = Math.floor(128 + (Math.random() - 0.5) * 20);
        bumpCtx.fillStyle = `rgb(${gray},${gray},${gray})`;
        bumpCtx.fillRect(x, y, 2, 2);
      }

      return {
        albedo: new THREE.CanvasTexture(canvas),
        bump: new THREE.CanvasTexture(bumpCanvas),
      };
    };

    const createMatteBlackCeramicTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#141416';
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 2400; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const alpha = Math.random() * 0.08 + 0.01;
        ctx.fillStyle = Math.random() > 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha * 1.5})`;
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 256;
      bumpCanvas.height = 256;
      const bCtx = bumpCanvas.getContext('2d')!;
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 1200; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const gray = Math.floor(128 + (Math.random() - 0.5) * 18);
        bCtx.fillStyle = `rgb(${gray},${gray},${gray})`;
        bCtx.fillRect(x, y, 1.5, 1.5);
      }

      return {
        albedo: new THREE.CanvasTexture(canvas),
        bump: new THREE.CanvasTexture(bumpCanvas),
      };
    };

    const createSourdoughTextures = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createRadialGradient(512, 512, 60, 512, 512, 500);
      grad.addColorStop(0, '#fae3b4');
      grad.addColorStop(0.5, '#e4ac5a');
      grad.addColorStop(0.85, '#a65919');
      grad.addColorStop(1, '#562708');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const r = Math.random() * 5.5 + 1.2;
        const isDeepPore = Math.random() > 0.5;
        ctx.fillStyle = isDeepPore ? 'rgba(92, 42, 10, 0.32)' : 'rgba(255, 245, 220, 0.26)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Grill marks
      for (let offset = 120; offset < 1300; offset += 160) {
        ctx.beginPath();
        ctx.moveTo(offset - 240, 0);
        ctx.lineTo(offset + 240, 1024);
        ctx.lineWidth = 32;
        ctx.strokeStyle = 'rgba(74, 30, 8, 0.24)';
        ctx.stroke();
      }

      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 512;
      bumpCanvas.height = 512;
      const bCtx = bumpCanvas.getContext('2d')!;
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 1500; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = Math.random() * 4.0 + 0.8;
        const shade = Math.floor(128 - Math.random() * 45);
        bCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
        bCtx.beginPath();
        bCtx.arc(x, y, r, 0, Math.PI * 2);
        bCtx.fill();
      }

      return {
        albedo: new THREE.CanvasTexture(canvas),
        bump: new THREE.CanvasTexture(bumpCanvas),
      };
    };

    const createChaiLiquidTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createRadialGradient(512, 512, 60, 512, 512, 500);
      grad.addColorStop(0, '#c98d50');
      grad.addColorStop(0.7, '#ac6e36');
      grad.addColorStop(0.92, '#945827');
      grad.addColorStop(1, '#683813');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      for (let angle = 0; angle < Math.PI * 2; angle += 0.02) {
        const radius = 484 + (Math.random() - 0.5) * 20;
        const x = 512 + Math.cos(angle) * radius;
        const y = 512 + Math.sin(angle) * radius;
        const bubbleR = Math.random() * 4.0 + 1.0;
        ctx.fillStyle = 'rgba(255, 242, 220, 0.6)';
        ctx.beginPath();
        ctx.arc(x, y, bubbleR, 0, Math.PI * 2);
        ctx.fill();
      }

      return new THREE.CanvasTexture(canvas);
    };

    const createSteamTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.94)');
      grad.addColorStop(0.22, 'rgba(252, 246, 236, 0.72)');
      grad.addColorStop(0.5, 'rgba(240, 230, 218, 0.32)');
      grad.addColorStop(0.8, 'rgba(220, 206, 196, 0.06)');
      grad.addColorStop(1, 'rgba(200, 190, 180, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(canvas);
    };

    const createContactShadowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 124);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.92)');
      grad.addColorStop(0.32, 'rgba(0, 0, 0, 0.62)');
      grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.18)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(canvas);
    };

    const ceramicTex = createCeramicTextures();
    const blackCeramicTex = createMatteBlackCeramicTexture();
    const sourdoughTex = createSourdoughTextures();
    const chaiLiquidTex = createChaiLiquidTexture();

    // --- 5. Shared Photorealistic PBR Materials ---
    const goldPbrMat = new THREE.MeshPhysicalMaterial({
      color: 0xf3f3f3,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08,
      reflectivity: 0.98,
    });

    const blackCeramicPbrMat = new THREE.MeshPhysicalMaterial({
      color: 0x141416,
      map: blackCeramicTex.albedo,
      bumpMap: blackCeramicTex.bump,
      bumpScale: 0.0015,
      roughness: 0.28,
      metalness: 0.06,
      clearcoat: 0.42,
      clearcoatRoughness: 0.18,
      reflectivity: 0.82,
    });

    const creamPlatePbrMat = new THREE.MeshPhysicalMaterial({
      color: 0xf7f2e9,
      map: ceramicTex.albedo,
      bumpMap: ceramicTex.bump,
      bumpScale: 0.0035,
      roughness: 0.17,
      metalness: 0.03,
      clearcoat: 0.88,
      clearcoatRoughness: 0.1,
      reflectivity: 0.88,
    });

    const cutleryPbrMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8d1c6,
      metalness: 0.96,
      roughness: 0.11,
      clearcoat: 0.45,
      clearcoatRoughness: 0.08,
    });

    // --- 6. Main 3D Scene Root Group ---
    const turntableGroup = new THREE.Group();
    scene.add(turntableGroup);

    // --- 7. Tabletop Presentation Slate & Shadow Layer ---
    const pedestalGeo = new THREE.CylinderGeometry(4.0, 4.2, 0.35, 64);
    const slatePbrMat = new THREE.MeshPhysicalMaterial({
      color: 0x121214,
      roughness: 0.38,
      metalness: 0.18,
      clearcoat: 0.22,
      clearcoatRoughness: 0.38,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, slatePbrMat);
    pedestalMesh.position.y = -0.175;
    pedestalMesh.receiveShadow = true;
    turntableGroup.add(pedestalMesh);

    // Gold Beveled Edge Ring
    const pedestalGoldGeo = new THREE.TorusGeometry(4.01, 0.025, 16, 64);
    const pedestalGoldMesh = new THREE.Mesh(pedestalGoldGeo, goldPbrMat);
    pedestalGoldMesh.rotation.x = Math.PI / 2;
    pedestalGoldMesh.position.y = 0.001;
    turntableGroup.add(pedestalGoldMesh);

    // Soft Ambient Occlusion Under Tabletop
    const pedestalShadowGeo = new THREE.PlaneGeometry(9.5, 9.5);
    const pedestalShadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    });
    const pedestalShadowMesh = new THREE.Mesh(pedestalShadowGeo, pedestalShadowMat);
    pedestalShadowMesh.rotation.x = -Math.PI / 2;
    pedestalShadowMesh.position.y = -0.35;
    turntableGroup.add(pedestalShadowMesh);

    const plateShadowGeo = new THREE.PlaneGeometry(5.4, 5.4);
    const plateShadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity: 0.80,
      depthWrite: false,
    });
    const plateShadowMesh = new THREE.Mesh(plateShadowGeo, plateShadowMat);
    plateShadowMesh.rotation.x = -Math.PI / 2;
    plateShadowMesh.position.set(-0.35, 0.005, 0.05);
    turntableGroup.add(plateShadowMesh);

    // --- 8. REAL 3D ARTISANAL CERAMIC BREAKFAST DISH ---
    const plateGroup = new THREE.Group();
    plateGroup.position.set(-0.55, 0.02, 0.1);
    turntableGroup.add(plateGroup);

    const platePoints: THREE.Vector2[] = [];
    platePoints.push(new THREE.Vector2(0, 0.0));
    platePoints.push(new THREE.Vector2(1.7, 0.0));
    platePoints.push(new THREE.Vector2(1.9, 0.04));
    platePoints.push(new THREE.Vector2(2.18, 0.18));
    platePoints.push(new THREE.Vector2(2.28, 0.25));
    platePoints.push(new THREE.Vector2(2.26, 0.27));
    platePoints.push(new THREE.Vector2(2.12, 0.21));
    platePoints.push(new THREE.Vector2(1.82, 0.08));
    platePoints.push(new THREE.Vector2(1.52, 0.04));
    platePoints.push(new THREE.Vector2(0, 0.03));

    const plateGeo = new THREE.LatheGeometry(platePoints, 96);
    const plateMesh = new THREE.Mesh(plateGeo, creamPlatePbrMat);
    plateMesh.castShadow = true;
    plateMesh.receiveShadow = true;
    plateGroup.add(plateMesh);

    const plateGoldRimGeo = new THREE.TorusGeometry(2.22, 0.014, 16, 96);
    const plateGoldRimMesh = new THREE.Mesh(plateGoldRimGeo, goldPbrMat);
    plateGoldRimMesh.rotation.x = Math.PI / 2;
    plateGoldRimMesh.position.y = 0.245;
    plateGroup.add(plateGoldRimMesh);

    // --- 9. REAL 3D SUNNY-SIDE-UP FARMHOUSE EGGS ---
    const eggGroup = new THREE.Group();
    eggGroup.position.set(-0.25, 0.06, 0.15);
    plateGroup.add(eggGroup);

    // Crisp caramelized browned lace edge
    const laceGeo = new THREE.RingGeometry(0.72, 1.15, 48);
    const laceMat = new THREE.MeshStandardMaterial({
      color: 0x9c5318,
      roughness: 0.72,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
    });
    const laceMesh = new THREE.Mesh(laceGeo, laceMat);
    laceMesh.rotation.x = -Math.PI / 2;
    laceMesh.position.y = 0.005;
    eggGroup.add(laceMesh);

    // 3D Egg White with natural organic fluid undulations
    const eggWhiteGeo = new THREE.CylinderGeometry(0.88, 1.06, 0.075, 48);
    const posWhite = eggWhiteGeo.attributes.position;
    for (let i = 0; i < posWhite.count; i++) {
      const vx = posWhite.getX(i);
      const vz = posWhite.getZ(i);
      const dist = Math.sqrt(vx * vx + vz * vz);
      if (dist > 0.25) {
        const noise = Math.sin(vx * 6.5) * Math.cos(vz * 6.5) * 0.065;
        posWhite.setX(i, vx + noise);
        posWhite.setZ(i, vz + noise);
      }
    }
    eggWhiteGeo.computeVertexNormals();

    const eggWhitePbrMat = new THREE.MeshPhysicalMaterial({
      color: 0xfcf9f2,
      roughness: 0.13,
      metalness: 0.02,
      clearcoat: 0.88,
      clearcoatRoughness: 0.09,
      reflectivity: 0.9,
    });
    const eggWhiteMesh = new THREE.Mesh(eggWhiteGeo, eggWhitePbrMat);
    eggWhiteMesh.castShadow = true;
    eggWhiteMesh.receiveShadow = true;
    eggGroup.add(eggWhiteMesh);

    // Shiny 3D Glossy Yolk 1
    const yolkGeo1 = new THREE.SphereGeometry(0.34, 36, 28, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const yolkPbrMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      roughness: 0.035,
      metalness: 0.04,
      clearcoat: 0.98,
      clearcoatRoughness: 0.05,
      reflectivity: 0.96,
    });
    const yolkMesh1 = new THREE.Mesh(yolkGeo1, yolkPbrMat);
    yolkMesh1.position.set(0.08, 0.045, -0.05);
    yolkMesh1.castShadow = true;
    eggGroup.add(yolkMesh1);

    // Twin 3D Egg White 2 & Yolk 2
    const eggWhite2Geo = new THREE.CylinderGeometry(0.72, 0.86, 0.065, 36);
    const eggWhite2Mesh = new THREE.Mesh(eggWhite2Geo, eggWhitePbrMat);
    eggWhite2Mesh.position.set(0.55, 0.006, -0.28);
    eggWhite2Mesh.castShadow = true;
    eggWhite2Mesh.receiveShadow = true;
    eggGroup.add(eggWhite2Mesh);

    const yolkGeo2 = new THREE.SphereGeometry(0.29, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const yolkMesh2 = new THREE.Mesh(yolkGeo2, yolkPbrMat);
    yolkMesh2.position.set(0.58, 0.045, -0.26);
    yolkMesh2.castShadow = true;
    eggGroup.add(yolkMesh2);

    // 3D Tellicherry Black Peppercorns
    const pepperGroup = new THREE.Group();
    eggGroup.add(pepperGroup);
    const pepperMat = new THREE.MeshStandardMaterial({
      color: 0x1d1814,
      roughness: 0.78,
      metalness: 0.04,
    });
    for (let i = 0; i < 48; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.12 + Math.random() * 0.85;
      const pepperGeo = new THREE.DodecahedronGeometry(Math.random() * 0.022 + 0.012);
      const pepperMesh = new THREE.Mesh(pepperGeo, pepperMat);
      pepperMesh.position.set(
        Math.cos(angle) * radius,
        0.085 + Math.random() * 0.015,
        Math.sin(angle) * radius
      );
      pepperMesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      pepperGroup.add(pepperMesh);
    }

    // 3D Micro-Snipped Chives
    const chiveMat = new THREE.MeshPhysicalMaterial({
      color: 0x22c55e,
      roughness: 0.32,
      clearcoat: 0.55,
    });
    for (let i = 0; i < 18; i++) {
      const chiveGeo = new THREE.TorusGeometry(0.028, 0.009, 8, 16);
      const chiveMesh = new THREE.Mesh(chiveGeo, chiveMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.18 + Math.random() * 0.68;
      chiveMesh.position.set(Math.cos(angle) * radius, 0.086, Math.sin(angle) * radius);
      chiveMesh.rotation.set(Math.PI / 2 + Math.random() * 0.4, Math.random() * 3, Math.random() * 0.4);
      eggGroup.add(chiveMesh);
    }

    // --- 10. REAL 3D SOURDOUGH TOAST WITH MELTING BUTTER ---
    const toastGroup = new THREE.Group();
    toastGroup.position.set(-0.85, 0.08, -0.55);
    toastGroup.rotation.y = Math.PI / 5;
    plateGroup.add(toastGroup);

    const toastShape = new THREE.Shape();
    toastShape.moveTo(-0.48, -0.48);
    toastShape.lineTo(0.48, -0.48);
    toastShape.quadraticCurveTo(0.55, 0.0, 0.45, 0.48);
    toastShape.quadraticCurveTo(0.0, 0.58, -0.45, 0.48);
    toastShape.quadraticCurveTo(-0.55, 0.0, -0.48, -0.48);

    const toastExtrudeSettings = {
      depth: 0.095,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.025,
    };
    const toastGeo = new THREE.ExtrudeGeometry(toastShape, toastExtrudeSettings);
    const toastPbrMat = new THREE.MeshPhysicalMaterial({
      color: 0xdfa566,
      map: sourdoughTex.albedo,
      bumpMap: sourdoughTex.bump,
      bumpScale: 0.008,
      roughness: 0.60,
      metalness: 0.03,
      clearcoat: 0.15,
      clearcoatRoughness: 0.4,
    });
    const toastMesh1 = new THREE.Mesh(toastGeo, toastPbrMat);
    toastMesh1.rotation.x = Math.PI / 2;
    toastMesh1.scale.set(0.9, 0.9, 0.9);
    toastMesh1.castShadow = true;
    toastMesh1.receiveShadow = true;
    toastGroup.add(toastMesh1);

    const toastMesh2 = toastMesh1.clone();
    toastMesh2.position.set(0.18, 0.075, -0.15);
    toastMesh2.rotation.z = 0.22;
    toastGroup.add(toastMesh2);

    // Melted butter puddle
    const meltedButterGeo = new THREE.CircleGeometry(0.24, 24);
    const meltedButterMat = new THREE.MeshPhysicalMaterial({
      color: 0xfacc15,
      roughness: 0.05,
      clearcoat: 0.96,
      clearcoatRoughness: 0.07,
      transparent: true,
      opacity: 0.82,
    });
    const meltedButterMesh = new THREE.Mesh(meltedButterGeo, meltedButterMat);
    meltedButterMesh.rotation.x = -Math.PI / 2;
    meltedButterMesh.position.set(0.22, 0.142, -0.12);
    toastGroup.add(meltedButterMesh);

    // 3D Butter Cube
    const butterGeo = new THREE.BoxGeometry(0.21, 0.045, 0.21);
    const butterMat = new THREE.MeshPhysicalMaterial({
      color: 0xfde047,
      roughness: 0.17,
      metalness: 0.04,
      clearcoat: 0.72,
      clearcoatRoughness: 0.14,
    });
    const butterMesh = new THREE.Mesh(butterGeo, butterMat);
    butterMesh.position.set(0.22, 0.165, -0.12);
    butterMesh.rotation.y = 0.35;
    butterMesh.castShadow = true;
    toastGroup.add(butterMesh);

    // --- 11. REAL 3D FRENCH CROISSANT / PASTRY ---
    const croissantGroup = new THREE.Group();
    croissantGroup.position.set(0.65, 0.09, 0.55);
    croissantGroup.rotation.y = -Math.PI / 3.5;
    plateGroup.add(croissantGroup);

    const croissantPbrMat = new THREE.MeshPhysicalMaterial({
      color: 0xd98a3b,
      roughness: 0.36,
      metalness: 0.06,
      clearcoat: 0.58,
      clearcoatRoughness: 0.20,
      reflectivity: 0.78,
    });

    // 3D Curved Crescent Geometry using overlapping volumetric ring segments
    const croissantSegments = 14;
    for (let s = 0; s < croissantSegments; s++) {
      const t = s / (croissantSegments - 1);
      const angle = (t - 0.5) * Math.PI * 0.85;
      const radiusArc = 0.62;
      const posX = Math.sin(angle) * radiusArc;
      const posZ = -Math.cos(angle) * radiusArc + radiusArc;
      const scaleSeg = Math.sin(t * Math.PI) * 0.26 + 0.065;

      const segGeo = new THREE.SphereGeometry(scaleSeg, 20, 20);
      segGeo.scale(1.05, 0.88, 1.4);

      const segMesh = new THREE.Mesh(segGeo, croissantPbrMat);
      segMesh.position.set(posX, 0.11, posZ);
      segMesh.rotation.y = angle;
      segMesh.castShadow = true;
      segMesh.receiveShadow = true;
      croissantGroup.add(segMesh);
    }

    // --- 12. REAL 3D AVOCADO SLICES ---
    const avocadoGroup = new THREE.Group();
    avocadoGroup.position.set(-0.1, 0.06, -0.8);
    avocadoGroup.rotation.y = -Math.PI / 4;
    plateGroup.add(avocadoGroup);

    const avocadoSkinMat = new THREE.MeshPhysicalMaterial({
      color: 0x1c3818,
      roughness: 0.6,
      clearcoat: 0.2,
    });
    const avocadoFleshMat = new THREE.MeshPhysicalMaterial({
      color: 0x84cc16,
      roughness: 0.25,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
    });

    for (let slice = 0; slice < 3; slice++) {
      const sliceShape = new THREE.Shape();
      sliceShape.absarc(0, 0, 0.35, 0, Math.PI, false);
      sliceShape.absarc(0, 0, 0.20, Math.PI, 0, true);

      const sliceExtrudeSettings = {
        depth: 0.06,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.012,
        bevelThickness: 0.01,
      };
      const sliceGeo = new THREE.ExtrudeGeometry(sliceShape, sliceExtrudeSettings);

      const sliceMesh = new THREE.Mesh(sliceGeo, avocadoFleshMat);
      sliceMesh.rotation.x = Math.PI / 2;
      sliceMesh.rotation.z = slice * 0.18 - 0.2;
      sliceMesh.position.set(slice * 0.14, 0.02 * slice, slice * 0.06);
      sliceMesh.castShadow = true;
      avocadoGroup.add(sliceMesh);
    }

    // --- 13. REAL 3D GARNISHES: TOMATO & ROSEMARY ---
    const tomatoGroup = new THREE.Group();
    tomatoGroup.position.set(-0.25, 0.08, 0.85);
    plateGroup.add(tomatoGroup);

    const tomatoGeo = new THREE.SphereGeometry(0.185, 28, 24);
    const tomatoPbrMat = new THREE.MeshPhysicalMaterial({
      color: 0xef4444,
      roughness: 0.07,
      metalness: 0.03,
      clearcoat: 0.94,
      clearcoatRoughness: 0.05,
      reflectivity: 0.92,
    });
    const tomatoMesh = new THREE.Mesh(tomatoGeo, tomatoPbrMat);
    tomatoMesh.castShadow = true;
    tomatoGroup.add(tomatoMesh);

    // 3D Calyx star on tomato
    const calyxPbrMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    for (let c = 0; c < 5; c++) {
      const calyxGeo = new THREE.ConeGeometry(0.022, 0.085, 4);
      const calyxMesh = new THREE.Mesh(calyxGeo, calyxPbrMat);
      calyxMesh.position.set(0, 0.175, 0);
      calyxMesh.rotation.z = 1.35;
      calyxMesh.rotation.y = (c * Math.PI * 2) / 5;
      tomatoGroup.add(calyxMesh);
    }

    // 3D Rosemary Sprig
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, 0.06, 0.5),
      new THREE.Vector3(-0.1, 0.085, 0.72),
      new THREE.Vector3(0.22, 0.06, 0.62),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 16, 0.016, 6, false);
    const herbPbrMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.55 });
    const stemMesh = new THREE.Mesh(stemGeo, herbPbrMat);
    stemMesh.castShadow = true;
    plateGroup.add(stemMesh);

    for (let i = 0; i < 22; i++) {
      const needleGeo = new THREE.CylinderGeometry(0.007, 0.012, 0.09, 4);
      const needleMesh = new THREE.Mesh(needleGeo, herbPbrMat);
      const t = 0.1 + (i / 22) * 0.8;
      const pt = stemCurve.getPoint(t);
      needleMesh.position.copy(pt);
      needleMesh.rotation.set(
        Math.random() * 0.6 + 0.3,
        (i * Math.PI) / 3,
        Math.random() * 0.6
      );
      plateGroup.add(needleMesh);
    }

    // 3D Crumbs
    const crumbsGroup = new THREE.Group();
    plateGroup.add(crumbsGroup);
    const toastCrumbMat = new THREE.MeshStandardMaterial({ color: 0xb46522, roughness: 0.8 });
    const pastryCrumbMat = new THREE.MeshStandardMaterial({ color: 0xde9b48, roughness: 0.7 });

    for (let i = 0; i < 34; i++) {
      const isPastry = i % 2 === 0;
      const crumbGeo = new THREE.DodecahedronGeometry(Math.random() * 0.015 + 0.008);
      const crumbMesh = new THREE.Mesh(crumbGeo, isPastry ? pastryCrumbMat : toastCrumbMat);
      const cluster = Math.random();
      if (cluster < 0.6) {
        crumbMesh.position.set(
          -0.85 + (Math.random() - 0.5) * 0.7,
          0.045,
          -0.55 + (Math.random() - 0.5) * 0.6
        );
      } else {
        crumbMesh.position.set(
          0.65 + (Math.random() - 0.5) * 0.65,
          0.045,
          0.55 + (Math.random() - 0.5) * 0.5
        );
      }
      crumbMesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      crumbMesh.castShadow = true;
      crumbsGroup.add(crumbMesh);
    }

    // --- 14. REAL 3D BUTTER KNIFE ---
    const cutleryGroup = new THREE.Group();
    cutleryGroup.position.set(0.68, 0.02, -0.92);
    cutleryGroup.rotation.y = -Math.PI / 3.8;
    turntableGroup.add(cutleryGroup);

    const handleShape = new THREE.Shape();
    handleShape.moveTo(-0.04, -0.7);
    handleShape.lineTo(0.04, -0.7);
    handleShape.lineTo(0.05, 0.1);
    handleShape.lineTo(-0.05, 0.1);
    handleShape.closePath();
    const handleCutleryGeo = new THREE.ExtrudeGeometry(handleShape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    });
    const handleCutleryMesh = new THREE.Mesh(handleCutleryGeo, cutleryPbrMat);
    handleCutleryMesh.rotation.x = Math.PI / 2;
    handleCutleryMesh.castShadow = true;
    cutleryGroup.add(handleCutleryMesh);

    const bladeGeo = new THREE.BoxGeometry(0.075, 0.012, 0.55);
    const bladeMesh = new THREE.Mesh(bladeGeo, cutleryPbrMat);
    bladeMesh.position.set(0, 0.012, 0.38);
    bladeMesh.castShadow = true;
    cutleryGroup.add(bladeMesh);

    // --- 15. REAL 3D MATTE-BLACK CERAMIC CHAI CUP & SAUCER ---
    const cupGroup = new THREE.Group();
    cupGroup.position.set(1.45, 0.02, -0.1);
    turntableGroup.add(cupGroup);

    // Saucer Profile Lathe
    const saucerPoints: THREE.Vector2[] = [];
    saucerPoints.push(new THREE.Vector2(0, 0));
    saucerPoints.push(new THREE.Vector2(0.92, 0));
    saucerPoints.push(new THREE.Vector2(1.18, 0.04));
    saucerPoints.push(new THREE.Vector2(1.38, 0.14));
    saucerPoints.push(new THREE.Vector2(1.42, 0.165));
    saucerPoints.push(new THREE.Vector2(1.39, 0.175));
    saucerPoints.push(new THREE.Vector2(1.22, 0.08));
    saucerPoints.push(new THREE.Vector2(0.86, 0.03));
    saucerPoints.push(new THREE.Vector2(0, 0.02));

    const saucerGeo = new THREE.LatheGeometry(saucerPoints, 64);
    const saucerMesh = new THREE.Mesh(saucerGeo, blackCeramicPbrMat);
    saucerMesh.castShadow = true;
    saucerMesh.receiveShadow = true;
    cupGroup.add(saucerMesh);

    const saucerRimGeo = new THREE.TorusGeometry(1.38, 0.012, 16, 64);
    const saucerRimMesh = new THREE.Mesh(saucerRimGeo, goldPbrMat);
    saucerRimMesh.rotation.x = Math.PI / 2;
    saucerRimMesh.position.y = 0.16;
    cupGroup.add(saucerRimMesh);

    // Tulip Cup Profile Lathe
    const cupPoints: THREE.Vector2[] = [];
    cupPoints.push(new THREE.Vector2(0, 0.03));
    cupPoints.push(new THREE.Vector2(0.48, 0.03));
    cupPoints.push(new THREE.Vector2(0.55, 0.08));
    cupPoints.push(new THREE.Vector2(0.68, 0.35));
    cupPoints.push(new THREE.Vector2(0.82, 0.75));
    cupPoints.push(new THREE.Vector2(0.85, 0.95)); // Outer lip
    cupPoints.push(new THREE.Vector2(0.81, 0.95)); // Inner lip
    cupPoints.push(new THREE.Vector2(0.76, 0.72));
    cupPoints.push(new THREE.Vector2(0.62, 0.35));
    cupPoints.push(new THREE.Vector2(0.48, 0.12));
    cupPoints.push(new THREE.Vector2(0, 0.12));

    const cupGeo = new THREE.LatheGeometry(cupPoints, 64);
    const cupMesh = new THREE.Mesh(cupGeo, blackCeramicPbrMat);
    cupMesh.castShadow = true;
    cupMesh.receiveShadow = true;
    cupGroup.add(cupMesh);

    const cupGoldRimGeo = new THREE.TorusGeometry(0.835, 0.014, 16, 64);
    const cupGoldRimMesh = new THREE.Mesh(cupGoldRimGeo, goldPbrMat);
    cupGoldRimMesh.rotation.x = Math.PI / 2;
    cupGoldRimMesh.position.y = 0.95;
    cupGroup.add(cupGoldRimMesh);

    // Ergonomic 3D Handle
    const handleGeo = new THREE.TorusGeometry(0.33, 0.055, 16, 36, Math.PI * 1.05);
    const handleMesh = new THREE.Mesh(handleGeo, blackCeramicPbrMat);
    handleMesh.position.set(0.85, 0.52, 0);
    handleMesh.rotation.z = -Math.PI / 1.95;
    handleMesh.castShadow = true;
    cupGroup.add(handleMesh);

    // 3D Chai Liquid Surface
    const teaGeo = new THREE.CircleGeometry(0.77, 64);
    const teaPbrMat = new THREE.MeshPhysicalMaterial({
      color: 0xb5783f,
      map: chaiLiquidTex,
      roughness: 0.045,
      metalness: 0.12,
      clearcoat: 0.96,
      clearcoatRoughness: 0.04,
      reflectivity: 0.94,
    });
    const teaMesh = new THREE.Mesh(teaGeo, teaPbrMat);
    teaMesh.rotation.x = -Math.PI / 2;
    teaMesh.position.y = 0.88;
    teaMesh.receiveShadow = true;
    cupGroup.add(teaMesh);

    // Floating 3D Star Anise
    const starGroup = new THREE.Group();
    starGroup.position.set(0.18, 0.89, -0.12);
    cupGroup.add(starGroup);
    const starSpiceMat = new THREE.MeshStandardMaterial({ color: 0x482414, roughness: 0.75 });
    for (let a = 0; a < 8; a++) {
      const starPetalGeo = new THREE.ConeGeometry(0.038, 0.11, 5);
      const petal = new THREE.Mesh(starPetalGeo, starSpiceMat);
      petal.rotation.z = Math.PI / 2;
      petal.rotation.y = (a * Math.PI * 2) / 8;
      starGroup.add(petal);

      const seedGeo = new THREE.SphereGeometry(0.018, 8, 8);
      const seedMesh = new THREE.Mesh(seedGeo, starSpiceMat);
      starGroup.add(seedMesh);
    }

    // Cinnamon stick on saucer
    const cinnamonGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.85, 16);
    const cinnamonMat = new THREE.MeshStandardMaterial({
      color: 0x7c3a1e,
      roughness: 0.8,
      metalness: 0.05,
    });
    const cinnamonMesh = new THREE.Mesh(cinnamonGeo, cinnamonMat);
    cinnamonMesh.rotation.z = Math.PI / 2;
    cinnamonMesh.rotation.y = 0.45;
    cinnamonMesh.position.set(-0.35, 0.09, 0.75);
    cinnamonMesh.castShadow = true;
    cupGroup.add(cinnamonMesh);

    // --- 16. REAL 3D ARTISANAL CERAMIC TEAPOT ---
    const teapotGroup = new THREE.Group();
    teapotGroup.position.set(1.95, 0.02, -1.35);
    teapotGroup.rotation.y = Math.PI / 4;
    turntableGroup.add(teapotGroup);

    // Teapot Body Lathe Profile
    const potPoints: THREE.Vector2[] = [];
    potPoints.push(new THREE.Vector2(0, 0.02));
    potPoints.push(new THREE.Vector2(0.55, 0.02));
    potPoints.push(new THREE.Vector2(0.85, 0.25));
    potPoints.push(new THREE.Vector2(0.92, 0.60));
    potPoints.push(new THREE.Vector2(0.72, 0.95));
    potPoints.push(new THREE.Vector2(0.48, 1.10)); // Neck
    potPoints.push(new THREE.Vector2(0.52, 1.15)); // Flared Lip
    potPoints.push(new THREE.Vector2(0.44, 1.15));
    potPoints.push(new THREE.Vector2(0.42, 1.05));
    potPoints.push(new THREE.Vector2(0, 1.05));

    const potGeo = new THREE.LatheGeometry(potPoints, 64);
    const potMesh = new THREE.Mesh(potGeo, blackCeramicPbrMat);
    potMesh.castShadow = true;
    potMesh.receiveShadow = true;
    teapotGroup.add(potMesh);

    // Gold Trim on Teapot Neck
    const potGoldTrimGeo = new THREE.TorusGeometry(0.52, 0.015, 16, 64);
    const potGoldTrimMesh = new THREE.Mesh(potGoldTrimGeo, goldPbrMat);
    potGoldTrimMesh.rotation.x = Math.PI / 2;
    potGoldTrimMesh.position.y = 1.15;
    teapotGroup.add(potGoldTrimMesh);

    // Teapot Lid
    const lidPoints: THREE.Vector2[] = [];
    lidPoints.push(new THREE.Vector2(0, 1.16));
    lidPoints.push(new THREE.Vector2(0.44, 1.16));
    lidPoints.push(new THREE.Vector2(0.38, 1.25));
    lidPoints.push(new THREE.Vector2(0.18, 1.32));
    lidPoints.push(new THREE.Vector2(0, 1.34));

    const lidGeo = new THREE.LatheGeometry(lidPoints, 48);
    const lidMesh = new THREE.Mesh(lidGeo, blackCeramicPbrMat);
    lidMesh.castShadow = true;
    teapotGroup.add(lidMesh);

    // Teapot Lid Gold Spherical Knob
    const knobGeo = new THREE.SphereGeometry(0.085, 16, 16);
    const knobMesh = new THREE.Mesh(knobGeo, goldPbrMat);
    knobMesh.position.y = 1.39;
    knobMesh.castShadow = true;
    teapotGroup.add(knobMesh);

    // Teapot Curved Spout (3D Tube)
    const spoutCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.65, 0.45, 0.0),
      new THREE.Vector3(1.10, 0.82, 0.0),
      new THREE.Vector3(1.22, 1.05, 0.0),
    ]);
    const spoutGeo = new THREE.TubeGeometry(spoutCurve, 24, 0.09, 16, false);
    const spoutMesh = new THREE.Mesh(spoutGeo, blackCeramicPbrMat);
    spoutMesh.castShadow = true;
    teapotGroup.add(spoutMesh);

    const spoutGoldLipGeo = new THREE.TorusGeometry(0.09, 0.012, 16, 32);
    const spoutGoldLipMesh = new THREE.Mesh(spoutGoldLipGeo, goldPbrMat);
    spoutGoldLipMesh.position.set(1.22, 1.05, 0.0);
    spoutGoldLipMesh.rotation.y = Math.PI / 2;
    teapotGroup.add(spoutGoldLipMesh);

    // Teapot Curved Handle (3D Tube)
    const potHandleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.62, 0.92, 0.0),
      new THREE.Vector3(-1.15, 0.75, 0.0),
      new THREE.Vector3(-1.05, 0.35, 0.0),
      new THREE.Vector3(-0.75, 0.30, 0.0),
    ]);
    const potHandleGeo = new THREE.TubeGeometry(potHandleCurve, 24, 0.065, 16, false);
    const potHandleMesh = new THREE.Mesh(potHandleGeo, blackCeramicPbrMat);
    potHandleMesh.castShadow = true;
    teapotGroup.add(potHandleMesh);

    // Teapot Contact Shadow
    const potShadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const potShadowMesh = new THREE.Mesh(potShadowGeo, plateShadowMat);
    potShadowMesh.rotation.x = -Math.PI / 2;
    potShadowMesh.position.y = 0.005;
    teapotGroup.add(potShadowMesh);

    // --- 17. VOLUMETRIC RISING 3D STEAM PARTICLES ---
    const steamParticleCount = 90;
    const steamTexture = createSteamTexture();

    const steamGeo = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamParticleCount * 3);
    const steamScales = new Float32Array(steamParticleCount);
    const steamAlphas = new Float32Array(steamParticleCount);

    interface SteamParticle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      life: number;
      maxLife: number;
      baseScale: number;
      curlFreq: number;
      curlOffset: number;
    }

    const steamParticles: SteamParticle[] = [];
    for (let i = 0; i < steamParticleCount; i++) {
      const maxLife = 180 + Math.random() * 140;
      const initialAge = Math.random() * maxLife;
      const sp: SteamParticle = {
        x: (Math.random() - 0.5) * 0.36,
        y: 0.92 + (initialAge / maxLife) * 2.6,
        z: (Math.random() - 0.5) * 0.36,
        vx: (Math.random() - 0.5) * 0.002,
        vy: 0.010 + Math.random() * 0.006,
        vz: (Math.random() - 0.5) * 0.002,
        life: initialAge,
        maxLife: maxLife,
        baseScale: 0.32 + Math.random() * 0.24,
        curlFreq: 1.2 + Math.random() * 1.8,
        curlOffset: Math.random() * Math.PI * 2,
      };
      steamParticles.push(sp);
      steamPositions[i * 3] = sp.x;
      steamPositions[i * 3 + 1] = sp.y;
      steamPositions[i * 3 + 2] = sp.z;
      steamScales[i] = sp.baseScale;
      steamAlphas[i] = 0.3;
    }

    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
    steamGeo.setAttribute('scale', new THREE.BufferAttribute(steamScales, 1));
    steamGeo.setAttribute('alpha', new THREE.BufferAttribute(steamAlphas, 1));

    const steamMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: steamTexture },
        uColor: { value: new THREE.Color(0xfcf7f0) },
      },
      vertexShader: `
        attribute float scale;
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = scale * (220.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          float outAlpha = texColor.a * vAlpha * 0.30;
          gl_FragColor = vec4(uColor, outAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const steamPoints = new THREE.Points(steamGeo, steamMaterial);
    cupGroup.add(steamPoints);

    // Responsive Canvas Resizing
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        if (newWidth < 640) {
          camera.fov = 44;
          controlsRef.current.distance = 5.4;
        } else {
          camera.fov = 36;
          controlsRef.current.distance = 4.8;
        }
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };
    handleResize();

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // IntersectionObserver to pause rendering off-screen
    let isIntersecting = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // --- 19. High-Performance Render Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isIntersecting) return;

      const time = clock.getElapsedTime();
      const ctrl = controlsRef.current;

      // Completely fixed camera matching the reference image composition
      ctrl.azimuth = 0.38;
      ctrl.elevation = 0.32;
      ctrl.currentLookAt.copy(ctrl.targetLookAt);

      // Spherical 3D Camera Coordinate System
      const camX =
        ctrl.currentLookAt.x +
        ctrl.distance * Math.cos(ctrl.elevation) * Math.sin(ctrl.azimuth);
      const camY =
        ctrl.currentLookAt.y +
        ctrl.distance * Math.sin(ctrl.elevation);
      const camZ =
        ctrl.currentLookAt.z +
        ctrl.distance * Math.cos(ctrl.elevation) * Math.cos(ctrl.azimuth);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(ctrl.currentLookAt);

      // Volumetric Steam Animation
      const positions = steamGeo.attributes.position.array as Float32Array;
      const scales = steamGeo.attributes.scale.array as Float32Array;
      const alphas = steamGeo.attributes.alpha.array as Float32Array;

      for (let i = 0; i < steamParticleCount; i++) {
        const p = steamParticles[i];
        p.life += 1;

        if (p.life >= p.maxLife) {
          p.life = 0;
          p.x = (Math.random() - 0.5) * 0.38;
          p.y = 0.90;
          p.z = (Math.random() - 0.5) * 0.38;
          p.vx = (Math.random() - 0.5) * 0.002;
          p.vy = 0.010 + Math.random() * 0.006;
          p.vz = (Math.random() - 0.5) * 0.002;
        }

        const progress = p.life / p.maxLife;
        const curl = Math.sin(time * p.curlFreq + p.curlOffset) * 0.0025 * (1 + progress * 2.0);
        const crossWind = Math.cos(time * 0.65 + p.curlOffset) * 0.0014;

        p.x += p.vx + curl;
        p.y += p.vy;
        p.z += p.vz + crossWind;

        let a = 0;
        if (progress < 0.18) {
          a = progress / 0.18;
        } else if (progress > 0.45) {
          a = Math.max(0, 1 - (progress - 0.45) / 0.55);
        } else {
          a = 1.0;
        }

        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
        scales[i] = p.baseScale * (1 + progress * 2.2);
        alphas[i] = a;
      }

      steamGeo.attributes.position.needsUpdate = true;
      steamGeo.attributes.scale.needsUpdate = true;
      steamGeo.attributes.alpha.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();
    if (onSceneReady) onSceneReady();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [onSceneReady]);

  return (
    <div className={`relative w-full h-full select-none max-w-full overflow-hidden ${className}`}>
      {/* Real 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[420px] sm:h-[500px] lg:h-[600px] pointer-events-none relative max-w-full overflow-hidden"
      />
    </div>
  );
};
