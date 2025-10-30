// fallback to a static path for the placeholder image to avoid TS asset typing issues
const milceryImage = "/src/assets/milcery.png";
import "../styles/PokemonInfo.css";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three-stdlib";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as { modelPath?: string; configKey?: string; name?: string };
  const modelRef = useRef<HTMLDivElement | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    if (!state.modelPath || !modelRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    (renderer as any).outputEncoding = THREE.LinearToneMapping;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.right = '0';
    renderer.domElement.style.zIndex = '1';
    modelRef.current.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.enablePan = false;

    const loader = new GLTFLoader();
    loader.load(
      state.modelPath,
      (gltf: GLTF) => {
        const model = SkeletonUtils.clone(gltf.scene);
        scene.add(model);

        // apply defaults or per-model configuration when available
        const modelConfigurations: Record<string, { position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] }> = {
          mew: { position: [1.8, -0.8, 0], rotation: [0, 5.5, 0], scale: [2.1, 2.1, 2.1] },
          azurill: { position: [1.8, -0.8, 0], rotation: [0, 5.2, 0], scale: [2.9, 2.9, 2.9] },
          bulbasaur: { position: [1.6, -0.7, 0], rotation: [0, 5.2, 0], scale: [1.5, 1.5, 1.5] },
          gardevoir: { position: [1.7, -0.9, 0], rotation: [0, 5.6, 0], scale: [1.3, 1.3, 1.3] },
          charmander: { position: [1.7, -0.8, 0], rotation: [0, 5.4, 0], scale: [1.8, 1.8, 1.8] },
          squirtle: { position: [1.6, -0.7, 0], rotation: [0, 5.2, 0], scale: [1.6, 1.6, 1.6] },
          togetic: { position: [1.7, -0.8, 0], rotation: [0, 5.5, 0], scale: [2.0, 2.0, 2.0] },
          gallade: { position: [1.7, -0.9, 0], rotation: [0, 5.0, 0], scale: [1.2, 1.2, 1.2] },
          butterfree: { position: [1.3, -0.7, 0], rotation: [0, 5.2, 0], scale: [1.3, 1.3, 1.3] },
          jirachi: { position: [1.6, -0.7, 0], rotation: [0, 5.3, 0], scale: [1.7, 1.7, 1.7] },
        };

        const config = state.configKey ? modelConfigurations[state.configKey] : modelConfigurations.mew;
        model.position.set(...config.position);
        model.rotation.set(...config.rotation);
        model.scale.set(...config.scale);

        model.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const oldMat = mesh.material as any;
            mesh.material = new THREE.MeshBasicMaterial({ map: oldMat?.map, transparent: true });
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
        setModelLoaded(true);
      },
      undefined,
      (error: unknown) => {
        console.error('Erro ao carregar o modelo no summary:', error);
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
      if (modelRef.current) modelRef.current.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, [state.modelPath]);

  const goBack = () => navigate("/box");
  const onBackKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") goBack();
  };

  return (
    <div className="pokemon-container">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="nav-left">
          <div className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
          <div className="nav-icon circle-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="nav-icon hexagon-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div className="nav-icon star-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="nav-icon clipboard-icon active">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="M9 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="nav-icon gear-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6m-5.2-10.8l4.2 4.2m3.6 3.6l4.2 4.2M1 12h6m6 0h6M6.8 6.8l4.2 4.2m3.6 3.6l4.2 4.2" />
            </svg>
          </div>
          <div className="nav-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5l8 7-8 7V5z" />
            </svg>
          </div>
        </div>
        <div className="diagonal-overlay"></div>
      </div>

      {/* Main Content Area */}
      <div className="content-wrapper">
        {/* Left Panel - Text Information */}
        <div className="info-panel">
          <div className="info-content">
            {state.configKey === 'azurill' ? (
              <>
                <img
                  src="/assets/box/models/Projetos/RecnPlay2023.jpeg"
                  alt="RecnPlay 2023"
                  className="project-image"
                  style={{ maxWidth: '88%', maxHeight: 310, objectFit: 'contain', marginBottom: 12, borderRadius: 12 }}
                />
                <p className="info-text">
                  Oficina de Manutenção realizada no <span className="highlight-blue">recnplay de 2023</span>, atuei dando conselhos, ensinando a dar manutenção e como manusear de forma correta os <span className="highlight-blue">Perifericos de um Computador</span>, assim como o <span className="highlight-blue">descarte correto</span>.
                </p>
              </>
            ) : state.configKey === 'gardevoir' ? (
              <>
                <div>
                  <div className="prodtech-slider">
                    <div className="prodtech-track">
                      <img src="/assets/box/models/Projetos/Prodtech_0.jpeg" alt="Prodtech 0" />
                      <img src="/assets/box/models/Projetos/Prodtech_1.jpeg" alt="Prodtech 1" />
                    </div>
                  </div>
                  <p className="info-text">
                    Desenvolvi um Sistema de <span className="highlight-blue">gestão de chamados</span> com funcionalidades como (chat, feedback, sistema inteligênte de retorno e atendimento). como finalização do <span className="highlight-blue">curso de T.I</span>
                  </p>
                </div>
              </>
            ) : state.configKey === 'charmander' ? (
              <>
                <div>
                  <img
                    src="/assets/box/models/Projetos/HackerCidadao.jpg"
                    alt="Hacker Cidadão"
                    className="project-image"
                    style={{ maxWidth: '88%', maxHeight: 360, objectFit: 'contain', marginBottom: 12, borderRadius: 12 }}
                  />
                  <p className="info-text">
                    Desenvolvemos juntos, uma <span className="highlight-blue">inteligência artificial</span> que utiliza <span className="highlight-blue">visão computacional</span> para identificar descartes incorretos de resíduos e guardar no banco de dados, ajudando no combate ao <span className="highlight-blue">descarte prejudicial e criminoso</span> (o descarte irregular de resíduos é crime ambiental, previsto na <span className="highlight-blue">Lei nº 9.605/1998</span> - Lei de Crimes Ambientais).
                  </p>
                </div>
              </>
            ) : state.configKey === 'bulbasaur' ? (
              <>
                <div className="solidario-card">
                  <div className="solidario-slider">
                    <div className="solidario-track">
                      <img src="/assets/box/models/Projetos/ProjetoSolidario_0.jpeg" alt="Projeto Solidario 0" />
                      <img src="/assets/box/models/Projetos/ProjetoSolidario_1.jpeg" alt="Projeto Solidario 1" />
                      <img src="/assets/box/models/Projetos/ProjetoSolidario_2.jpeg" alt="Projeto Solidario 2" />
                      <img src="/assets/box/models/Projetos/ProjetoSolidario_3.jpeg" alt="Projeto Solidario 3" />
                    </div>
                  </div>
                  <div className="solidario-text">
                    <p className="info-text">
                      Realizamos Projetos Solidários como <span className="highlight-blue">ONG</span> auxiliando na manutenção, reparo e limpeza de computadores para a <span className="highlight-blue">ONG SAMARITANOS</span>. também, extendemos nossa oficina, dando aulas em <span className="highlight-blue">escolas publicas</span> sobre manutenção e <span className="highlight-blue">descarte correto</span>, praticando a <span className="highlight-blue">inclusão</span>.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="info-text">
                  This Pokémon is pretty <span className="highlight-blue">Lax</span> by nature.
                </p>
                <p className="info-text">
                  We first met one another on 10/06/2025,
                  <br />
                  and it was <span className="highlight-blue">on Route 4</span>!
                </p>
                <p className="info-text">At the time, this Pokémon was Lv. 13.</p>
                <p className="info-text">It's highly curious!</p>
              </>
            )}
          </div>
          <div className="diagonal-red-bottom"></div>
        </div>

        {/* Right Panel - Pokemon Display */}
        <div className="pokemon-display">
          <div className="pokemon-header">
            <div className="header-bg">
              <div className="pokeball-icon"></div>
              <div className="pokemon-name">{state.name ?? 'Milcery'}</div>
              <div className="pokemon-level">{state.name ? 'Lv. 15' : 'Lv. 15'}</div>
              <div className="notification-badge"></div>
            </div>
            <div className="header-arrow"></div>
          </div>
          
          <div className="pokemon-scene">
            <div className="background-circle"></div>
            {/* If a modelPath was passed via navigation state, render a canvas here */}
            {state.modelPath ? (
              <div ref={modelRef} className="model-canvas" style={{ width: "100%", height: "100%" }} />
            ) : (
              <img src={milceryImage} alt="Milcery" className="pokemon-sprite" />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bottom-nav">
        <div
          className="back-button"
          role="button"
          tabIndex={0}
          onClick={goBack}
          onKeyDown={onBackKey}
          style={{ cursor: "pointer" }}
          aria-label="Back to box"
        >
          <span className="back-icon">B</span>
          <span className="back-text">Back</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
