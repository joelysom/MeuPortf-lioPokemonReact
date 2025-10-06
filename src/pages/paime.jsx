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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.classList.add('paime-canvas');
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false; // Disable zoom
    controls.enableRotate = false; // Disable rotation
    controls.enablePan = false; // Disable position changes

    const loader = new GLTFLoader();
    loader.load(
      '/assets/Ready/Pikachu-Aime/pikachu-aime.glb',
      (gltf) => {
        const model = SkeletonUtils.clone(gltf.scene);
        scene.add(model);

        // Apply initial position and rotation
        model.position.set(
          modelConfig.initialPosition.x,
          modelConfig.initialPosition.y,
          modelConfig.initialPosition.z
        );
        model.rotation.set(
          modelConfig.initialRotation.x,
          modelConfig.initialRotation.y,
          modelConfig.initialRotation.z
        );

        // Apply texture and emissive settings
        model.traverse((child) => {
          if (child.isMesh) {
            const oldMat = child.material;
            child.material = new THREE.MeshStandardMaterial({
              map: oldMat.map,
              emissive: new THREE.Color('gold'),
              emissiveIntensity: 0.5,
              emissiveMap: oldMat.map,
              transparent: true, // Enable transparency
              alphaTest: 0.5, // Discard pixels with low alpha
            });
            child.material.needsUpdate = true;
          }
        });

        // Enable animations if available
        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat, 109); // Loop for 109 frames
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
        console.error('An error occurred while loading the model:', error);
      }
    );

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // soft white light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(ambientLight, directionalLight);

    // Set initial zoom
    camera.position.z = modelConfig.initialZoom;

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