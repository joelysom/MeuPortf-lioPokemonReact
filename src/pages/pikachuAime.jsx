import React, { useEffect, useRef, useState } from 'react';
import '../styles/paime.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { useNavigate } from 'react-router-dom';
import TrainerCard from '../components/trainercard';
import Tamagochi from '../components/tamagochi';

const PAime = () => {
  const mountRef = useRef(null);
  const navigate = useNavigate();
  const [showTrainerCard, setShowTrainerCard] = useState(false);
  const [showTamagochi, setShowTamagochi] = useState(false);

  // Editable configuration for zoom, position, and rotation
  const modelConfig = {
    initialPosition: { x: 2, y: -3.4, z: -0.9 },
    initialRotation: { x: 0.1, y: -0.3, z: 0 },
    initialZoom: 1.7,
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.shadowMap.enabled = false; // sem sombras
    renderer.domElement.classList.add('paime-canvas');
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.enablePan = false;

    const loader = new GLTFLoader();
    loader.load(
      '/assets/Ready/Pikachu-Aime/pikachu-aime.glb',
      (gltf) => {
        const model = SkeletonUtils.clone(gltf.scene);
        scene.add(model);

        // 🟡 Posição e rotação iniciais
        model.position.set(2, -3.4, -0.9);
        model.rotation.set(0.1, -0.3, 0);

        // 🧩 Remove emissive e sombras, mostra textura pura
        model.traverse((child) => {
          if (child.isMesh) {
            const oldMat = child.material;
            child.material = new THREE.MeshBasicMaterial({
              map: oldMat.map,
              transparent: true,
            });
            child.material.needsUpdate = true;
          }
        });

        // 🎞️ Ativa animações (loop infinito)
        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
        });

        const clock = new THREE.Clock();

        const animate = () => {
          requestAnimationFrame(animate);
          const delta = clock.getDelta();
          mixer.update(delta);
          controls.update();
          renderer.render(scene, camera);
        };

        animate();
      },
      undefined,
      (error) => {
        console.error('Erro ao carregar modelo:', error);
      }
    );

    // 💡 Iluminação branca total (sem sombras, sem tons)
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
    scene.add(ambientLight, hemiLight);

    // 🎥 Zoom e câmera
    camera.position.z = 1.7;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* Ensure blackout is removed after navigation and reload the page */
  const handleBackButtonClick = () => {
    const blackout = document.createElement('div');
    blackout.style.position = 'fixed';
    blackout.style.top = '0';
    blackout.style.left = '0';
    blackout.style.width = '100%';
    blackout.style.height = '100%';
    blackout.style.backgroundColor = 'black';
    blackout.style.zIndex = '9999';
    blackout.style.opacity = '0';
    blackout.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(blackout);

    // Trigger the fade-in effect
    requestAnimationFrame(() => {
      blackout.style.opacity = '1';
    });

    // Navigate to home after the fade-in effect
    setTimeout(() => {
      blackout.style.opacity = '0'; // Fade out the blackout
      setTimeout(() => {
        document.body.removeChild(blackout); // Remove blackout from DOM
        navigate('/home');
        window.location.reload(); // Reload the page
      }, 500); // Wait for fade-out to complete
    }, 500);
  };

  const handleHappyButtonClick = () => {
    setShowTrainerCard(true);
  };

  const closeTrainerCard = (e) => {
    if (e.target.classList.contains('trainer-card-modal')) {
      setShowTrainerCard(false);
    }
  };

  const handleCupcakeButtonClick = () => {
    setShowTamagochi(true);
  };

  const closeTamagochi = (e) => {
    if (e.target.classList.contains('tamagochi-modal')) {
      setShowTamagochi(false);
    }
  };

  return (
    <div className="paime-container" ref={mountRef}>
      <div className="background"></div>
      <img
        src="/assets/UI/cupcake_btn.png"
        alt="Cupcake Button"
        className="button top-left"
        onClick={handleCupcakeButtonClick}
      />
      <img src="/assets/UI/song_btn.png" alt="Song Button" className="button top-right" />
      <img
        src="/assets/UI/happy_btn.png"
        alt="Happy Button"
        className="button bottom-left"
        onClick={handleHappyButtonClick}
      />
      <img
        src="/assets/UI/back_btn.png"
        alt="Back Button"
        className="button bottom-right"
        onClick={handleBackButtonClick}
      />
      {showTrainerCard && (
        <div className="trainer-card-modal" onClick={closeTrainerCard}>
          <TrainerCard />
        </div>
      )}
      {showTamagochi && (
        <div className="tamagochi-modal" onClick={closeTamagochi}>
          <Tamagochi onClose={() => setShowTamagochi(false)} />
        </div>
      )}
    </div>
  );
};

export default PAime;