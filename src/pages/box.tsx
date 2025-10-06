import { FaChevronDown, FaPlus, FaThLarge, FaSync, FaTimes, FaSort, FaUser, FaCog, FaClipboardList, FaSearch, FaCheck, FaTimesCircle, FaTh, FaMousePointer } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import styles from '../styles/box.module.css';

const Index = () => {
  const navigate = useNavigate();
  const modelRef = useRef<HTMLDivElement | null>(null);

  const handleBackNavigation = () => {
    navigate('/home');
  };

  const partyPokemon = [
    { name: 'Mew', level: 70, hasIcon: true, icon: '/assets/box/mew.png' }
  ];

  const eggSlots = Array(5).fill({ name: 'Egg' });

  const pokemonGrid = [
    { id: 1, hasSprite: true, icon: '/assets/box/azurill.png' },
    { id: 2, hasSprite: true, icon: '/assets/box/bulbasaur.png' },
    { id: 3, hasSprite: true, icon: '/assets/box/gardevoir.png' },
    { id: 4, hasSprite: true, icon: '/assets/box/charmander.png' },
    { id: 5, hasSprite: true, icon: '/assets/box/gallade.png' },
    { id: 6, hasSprite: true, icon: '/assets/box/butterfree-gigantamax.png' },
    { id: 7, hasSprite: true, icon: '/assets/box/jirachi.png' },
    { id: 8, hasSprite: true, icon: '/assets/box/squirtle.png' },
    { id: 9, hasSprite: true, icon: '/assets/box/togetic.png' },
    ...Array(15).fill(null).map((_, index) => ({ id: index + 10, hasSprite: false, icon: '' }))
  ];

  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls;

  useEffect(() => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    (renderer as any).outputEncoding = THREE.LinearToneMapping;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.right = '0';
    renderer.domElement.style.zIndex = '1';
    modelRef.current?.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.enablePan = false;

    const loader = new GLTFLoader();
    loader.load(
      '/assets/box/models/mew/mew.glb',
      (gltf: GLTF) => {
        const model = SkeletonUtils.clone(gltf.scene);
        scene.add(model);

        model.position.set(1.8, -0.8, 0);
        model.rotation.set(0, 5.5, 0);
        model.scale.set(2.1, 2.1, 2.1);

        model.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const oldMat = mesh.material as THREE.MeshStandardMaterial;
            mesh.material = new THREE.MeshBasicMaterial({
              map: oldMat.map,
              transparent: true,
            });
            mesh.material.needsUpdate = true;
          }
        });

        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip: THREE.AnimationClip) => {
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
      (error: unknown) => {
        console.error('Erro ao carregar o modelo:', error);
      }
    );

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    const fillLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
    scene.add(ambientLight, fillLight);

    camera.position.z = 1.9;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (modelRef.current) {
        modelRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const modelConfigurations: Record<string, { position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] }> = {
    mew: { position: [1.8, -0.8, 0], rotation: [0, 5.5, 0], scale: [2.1, 2.1, 2.1] },
    azurill: { position: [1.8, -0.8, 0], rotation: [0, 5.2, 0], scale: [2.9, 2.9, 2.9] },
    bulbasaur: { position: [1.6, -0.7, 0], rotation: [0, 5.2, 0], scale: [1.5, 1.5, 1.5] },
    gardevoir: { position: [1.7, -0.9, 0], rotation: [0, 5.6, 0], scale: [1.3, 1.3, 1.3] },
  };

  const handleHover = (modelPath: string, configKey: string) => {
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf: GLTF) => {
        const model = SkeletonUtils.clone(gltf.scene);
        scene.clear();
        scene.add(model);

        const config = modelConfigurations[configKey];
        model.position.set(...config.position);
        model.rotation.set(...config.rotation);
        model.scale.set(...config.scale);

        model.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const oldMat = mesh.material as THREE.MeshStandardMaterial;
            mesh.material = new THREE.MeshBasicMaterial({
              map: oldMat.map,
              transparent: true,
            });
            mesh.material.needsUpdate = true;
          }
        });

        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip: THREE.AnimationClip) => {
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
      (error: unknown) => {
        console.error('Erro ao carregar o modelo:', error);
      }
    );
  };

  const resetToDefaultModel = () => handleHover('/assets/box/models/mew/mew.glb', 'mew');

  return (
    <div className={styles.pokemonBoxContainer}>
      <div ref={modelRef}></div>

      {/* Top Navigation */}
      <div className={styles.topNav}>
        <div className={styles.topNavLeft}>
          <div className={styles.iconButton}><FaChevronDown /></div>
          <button className={styles.navButton}>
            <FaTh />
            <span>Select</span>
          </button>
          <div className={styles.iconButton}><FaPlus /></div>
          <div className={styles.iconButton}><FaThLarge /></div>
          <div className={styles.iconButton}><FaSync /></div>
        </div>

        <div className={styles.topNavRight}>
          <div className={styles.iconButton} onClick={handleBackNavigation}><FaTimes /></div>
          <button className={styles.navButton}>
            <FaSort />
            <span>Sort Pokémon</span>
          </button>
          <div className={styles.iconButton}><FaUser /></div>
          <div className={styles.iconButton}><FaCog /></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.partyHeader}>Party</div>

          {partyPokemon.map((pokemon, index) => (
            <div key={index} className={`${styles.partySlot} ${styles.partySlotActive}`}>
              <div className={styles.pokemonIcon}>
                <img src={pokemon.icon} alt={pokemon.name} />
              </div>
              <div className={styles.pokemonInfo}>
                <div className={styles.pokemonName}>{pokemon.name}</div>
                <div className={styles.pokemonLevel}>Lv. {pokemon.level}</div>
              </div>
            </div>
          ))}

          {eggSlots.map((egg, index) => (
            <div key={index} className={styles.partySlot}>
              <div className={styles.eggIcon}></div>
              <div className={styles.pokemonInfo}>
                <div className={styles.pokemonName}>{egg.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Box Area */}
        <div className={styles.boxArea}>
          <div className={styles.boxHeader}>
            <div className={styles.boxArrow}><FaChevronDown /></div>
            <div className={styles.boxTitle}>Box 1</div>
            <div className={styles.boxArrow}><FaChevronDown /></div>
          </div>

          <div className={styles.pokemonGrid}>
            {pokemonGrid.map((pokemon) => (
              <div
                key={pokemon.id}
                className={styles.pokemonCell}
                onMouseEnter={() => {
                  if (pokemon.id === 1) handleHover('/assets/box/models/azurill/azurill.glb', 'azurill');
                  if (pokemon.id === 2) handleHover('/assets/box/models/bulbasaur/bulbasaur.glb', 'bulbasaur');
                  if (pokemon.id === 3) handleHover('/assets/box/models/gardevoir/gardevoir.glb', 'gardevoir');
                }}
                onMouseLeave={resetToDefaultModel}
              >
                {pokemon.hasSprite && (
                  <div className={styles.pokemonSprite}>
                    <img src={pokemon.icon} alt={`Pokemon ${pokemon.id}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className={styles.bottomControls}>
        <div className={styles.controlsLeft}>
          <button className={styles.controlButton}>
            <div className={styles.buttonIcon}><FaClipboardList /></div>
            <span>Box List</span>
          </button>
          <button className={styles.controlButton}>
            <div className={styles.buttonIcon}><FaSearch /></div>
            <span>Search</span>
          </button>
        </div>

        <div className={styles.controlsRight}>
          <button className={styles.controlButton}>
            <div className={styles.buttonIcon}><FaCheck /></div>
            <span>Confirm</span>
          </button>
          <button className={styles.controlButton}>
            <div className={styles.buttonIcon}><FaTimesCircle /></div>
            <span>Change Box View</span>
          </button>
          <button className={styles.controlButton}>
            <div className={styles.buttonIcon}><FaMousePointer /></div>
            <span>Change Selection Mode</span>
          </button>
          <button className={styles.controlButton} onClick={handleBackNavigation}>
            <div className={styles.buttonIcon}><FaTimes /></div>
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
