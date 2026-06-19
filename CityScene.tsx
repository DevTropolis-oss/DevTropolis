import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Building {
  mesh: THREE.Mesh;
  light: THREE.PointLight;
  originalY: number;
}

interface TrafficParticle {
  mesh: THREE.Mesh;
  path: THREE.Vector3[];
  currentIndex: number;
  speed: number;
  progress: number;
}

export default function CityScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    buildings: Building[];
    trafficParticles: TrafficParticle[];
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (sceneRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03045E);
    scene.fog = new THREE.FogExp2(0x03045E, 0.012);

    // Camera - isometric-like perspective
    const camera = new THREE.PerspectiveCamera(20, width / height, 0.1, 1000);
    camera.position.set(60, 45, 60);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 30;
    controls.maxDistance = 120;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minPolarAngle = Math.PI / 6;
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0077B6, 0.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xFF9E00, 0.6);
    dirLight.position.set(50, 80, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -80;
    dirLight.shadow.camera.right = 80;
    dirLight.shadow.camera.top = 80;
    dirLight.shadow.camera.bottom = -80;
    scene.add(dirLight);

    const hemisphereLight = new THREE.HemisphereLight(0x0077B6, 0xFF5400, 0.2);
    scene.add(hemisphereLight);

    // Grid floor with custom shader for distance fade
    const gridSize = 120;
    const gridDivisions = 60;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x0077B6, 0x00496C);
    gridHelper.position.y = -0.1;
    
    // Make grid material semi-transparent and glowing
    const gridMaterial = gridHelper.material as THREE.Material;
    if (gridMaterial) {
      gridMaterial.transparent = true;
      gridMaterial.opacity = 0.4;
    }
    scene.add(gridHelper);

    // Secondary grid (finer) for tech feel
    const fineGrid = new THREE.GridHelper(gridSize * 0.5, gridDivisions * 2, 0x00B4D8, 0x005A87);
    fineGrid.position.y = -0.05;
    const fineGridMaterial = fineGrid.material as THREE.Material;
    if (fineGridMaterial) {
      fineGridMaterial.transparent = true;
      fineGridMaterial.opacity = 0.15;
    }
    scene.add(fineGrid);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x03045E,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Building configurations
    const buildings: Building[] = [];
    const buildingColors = [0x03045E, 0x051040, 0x0A2050, 0x081838];
    const emissiveColors = [0xFF9E00, 0xFF5400, 0x00B4D8, 0xFF9E00];
    
    // District clusters
    const districts = [
      { cx: -20, cz: -15, count: 20, spread: 18 },
      { cx: 20, cz: -10, count: 18, spread: 16 },
      { cx: -10, cz: 20, count: 22, spread: 20 },
      { cx: 25, cz: 25, count: 15, spread: 14 },
      { cx: 0, cz: 0, count: 12, spread: 10 },
      { cx: -30, cz: 15, count: 10, spread: 12 },
    ];

    const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
    
    districts.forEach((district, dIdx) => {
      for (let i = 0; i < district.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * district.spread;
        const x = district.cx + Math.cos(angle) * radius;
        const z = district.cz + Math.sin(angle) * radius;
        
        // Skip if too close to other buildings
        const tooClose = buildings.some(b => {
          const dx = b.mesh.position.x - x;
          const dz = b.mesh.position.z - z;
          return Math.sqrt(dx * dx + dz * dz) < 3;
        });
        if (tooClose) continue;

        const height = 2 + Math.random() * 12;
        const width = 1.5 + Math.random() * 2;
        const depth = 1.5 + Math.random() * 2;

        const colorIdx = Math.floor(Math.random() * buildingColors.length);
        const emissiveColor = emissiveColors[dIdx % emissiveColors.length];
        const emissiveIntensity = 0.1 + Math.random() * 0.3;

        const material = new THREE.MeshStandardMaterial({
          color: buildingColors[colorIdx],
          emissive: emissiveColor,
          emissiveIntensity: emissiveIntensity,
          roughness: 0.4,
          metalness: 0.6,
        });

        const mesh = new THREE.Mesh(buildingGeometry, material);
        mesh.position.set(x, height / 2, z);
        mesh.scale.set(width, height, depth);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        // Point light on top of building
        const light = new THREE.PointLight(emissiveColor, 0.8 + Math.random() * 0.5, 15);
        light.position.set(x, height + 0.5, z);
        scene.add(light);

        buildings.push({
          mesh,
          light,
          originalY: height / 2,
        });

        // Add window lights (small emissive planes on building sides)
        if (height > 4) {
          const windowRows = Math.floor(height / 1.5);
          const windowCols = Math.floor(Math.random() * 3) + 1;
          
          for (let wr = 1; wr < windowRows; wr++) {
            for (let wc = 0; wc < windowCols; wc++) {
              if (Math.random() > 0.6) {
                const windowGeo = new THREE.PlaneGeometry(0.2, 0.3);
                const windowMat = new THREE.MeshBasicMaterial({
                  color: Math.random() > 0.5 ? 0xFF9E00 : 0x00B4D8,
                  transparent: true,
                  opacity: 0.6 + Math.random() * 0.4,
                  side: THREE.DoubleSide,
                });
                const windowMesh = new THREE.Mesh(windowGeo, windowMat);
                
                // Place on front face
                const wx = x + (wc - windowCols / 2 + 0.5) * 0.4;
                const wy = wr * 1.5;
                const wz = z + depth / 2 + 0.01;
                
                windowMesh.position.set(wx, wy, wz);
                scene.add(windowMesh);
              }
            }
          }
        }
      }
    });

    // Special "command center" building in center
    const commandGeo = new THREE.CylinderGeometry(3, 4, 8, 8);
    const commandMat = new THREE.MeshStandardMaterial({
      color: 0x03045E,
      emissive: 0xFF9E00,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9,
    });
    const commandBuilding = new THREE.Mesh(commandGeo, commandMat);
    commandBuilding.position.set(0, 4, 0);
    commandBuilding.castShadow = true;
    scene.add(commandBuilding);
    
    const commandLight = new THREE.PointLight(0xFF9E00, 2, 25);
    commandLight.position.set(0, 9, 0);
    scene.add(commandLight);
    buildings.push({ mesh: commandBuilding, light: commandLight, originalY: 4 });

    // Orbiting rings around command center
    const ringGeometry = new THREE.RingGeometry(5, 5.2, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF9E00,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.position.set(0, 2, 0);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ring2Geometry = new THREE.RingGeometry(6.5, 6.7, 64);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0x00B4D8,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.position.set(0, 5, 0);
    ring2.rotation.x = Math.PI / 2.2;
    scene.add(ring2);

    // Traffic/Data stream particles
    const trafficParticles: TrafficParticle[] = [];
    const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xFF5400 });

    // Create road paths (straight lines along grid)
    const roadPaths: THREE.Vector3[][] = [];
    for (let i = -50; i <= 50; i += 10) {
      roadPaths.push([
        new THREE.Vector3(i, 0.3, -50),
        new THREE.Vector3(i, 0.3, 50),
      ]);
      roadPaths.push([
        new THREE.Vector3(-50, 0.3, i),
        new THREE.Vector3(50, 0.3, i),
      ]);
    }

    // Create particles that follow road paths
    for (let i = 0; i < 40; i++) {
      const mesh = new THREE.Mesh(particleGeometry, particleMaterial.clone());
      const pathIdx = Math.floor(Math.random() * roadPaths.length);
      const path = roadPaths[pathIdx];
      const startX = path[0].x + (Math.random() - 0.5) * 2;
      const startZ = path[0].z + (Math.random() - 0.5) * 2;
      mesh.position.set(startX, 0.3, startZ);
      scene.add(mesh);

      trafficParticles.push({
        mesh,
        path: [
          new THREE.Vector3(startX, 0.3, path[0].z),
          new THREE.Vector3(startX, 0.3, path[1].z),
        ],
        currentIndex: 0,
        speed: 0.1 + Math.random() * 0.3,
        progress: Math.random(),
      });
    }

    // Floating data nodes (small cubes that pulse)
    const dataNodes: { mesh: THREE.Mesh; baseY: number; phase: number }[] = [];
    const dataNodeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    for (let i = 0; i < 15; i++) {
      const dataMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x00B4D8 : 0xFF9E00,
        transparent: true,
        opacity: 0.7,
      });
      const dataMesh = new THREE.Mesh(dataNodeGeo, dataMat);
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      const y = 15 + Math.random() * 20;
      dataMesh.position.set(x, y, z);
      scene.add(dataMesh);
      dataNodes.push({ mesh: dataMesh, baseY: y, phase: Math.random() * Math.PI * 2 });
    }

    // Stars / particles in sky
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 300;
      starPositions[i * 3 + 1] = 50 + Math.random() * 100;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x90E0EF,
      size: 0.3,
      transparent: true,
      opacity: 0.6,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Store scene reference
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      buildings,
      trafficParticles,
      animationId: 0,
    };

    // Animation loop
    let time = 0;
    const animate = () => {
      sceneRef.current!.animationId = requestAnimationFrame(animate);
      time += 0.016;

      // Update controls
      controls.update();

      // Animate building lights (subtle pulsing)
      buildings.forEach((building, i) => {
        const pulse = Math.sin(time * 0.5 + i * 0.3) * 0.2 + 1;
        building.light.intensity = (0.8 + Math.random() * 0.3) * pulse;
      });

      // Animate traffic particles
      trafficParticles.forEach(particle => {
        particle.progress += particle.speed * 0.01;
        if (particle.progress >= 1) {
          particle.progress = 0;
          // Occasionally switch paths
          if (Math.random() > 0.7) {
            const newPathIdx = Math.floor(Math.random() * roadPaths.length);
            particle.path = roadPaths[newPathIdx];
          }
        }
        const start = particle.path[0];
        const end = particle.path[1];
        particle.mesh.position.lerpVectors(start, end, particle.progress);
      });

      // Animate floating data nodes
      dataNodes.forEach(node => {
        node.mesh.position.y = node.baseY + Math.sin(time + node.phase) * 2;
        node.mesh.rotation.y += 0.01;
        node.mesh.rotation.x += 0.005;
        const mat = node.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.4 + Math.sin(time * 2 + node.phase) * 0.3;
      });

      // Rotate rings
      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.001;

      // Subtle star twinkle
      starMaterial.opacity = 0.4 + Math.sin(time * 0.5) * 0.2;

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

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        renderer.dispose();
        controls.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
