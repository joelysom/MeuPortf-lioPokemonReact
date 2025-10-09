import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'; // <- aqui
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function PokeballModel({ animationName, id, hoveredCardIndex }) {
  const { scene: glbScene, animations } = useGLTF('/assets/Ready/Pokeball/pokeball.glb');
  const scene = useRef(SkeletonUtils.clone(glbScene)); // <- clone correto
  const mixerRef = useRef(null);
  const actionRef = useRef(null);

  useEffect(() => {
    mixerRef.current = new THREE.AnimationMixer(scene.current);

    const initialAnim = animations.find(a => a.name === animationName) || animations[0];
    actionRef.current = mixerRef.current.clipAction(initialAnim);
    actionRef.current.reset().play();

    return () => mixerRef.current?.stopAllAction();
  }, [animations, animationName]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);
  });

  useEffect(() => {
    scene.current.traverse((child) => {
      if (child.isMesh) {
        const oldMat = child.material;
        child.material = new THREE.MeshBasicMaterial({
          map: oldMat.map,
          emissive: hoveredCardIndex === id ? new THREE.Color('gold') : new THREE.Color('black'),
          emissiveIntensity: hoveredCardIndex === id ? 1 : 0, // Increased intensity for visibility
          emissiveMap: oldMat.map, // Ensure emissive effect overlays the texture
        });
        child.material.needsUpdate = true;
      }
    });
  }, [hoveredCardIndex]);

  useEffect(() => {
    if (!mixerRef.current || !actionRef.current) return;

    const newAnim = animations.find(a => a.name === animationName);
    if (!newAnim) return;

    // Se já estiver tocando a animação certa, não faz nada
    if (actionRef.current.getClip().name === animationName) return;

    const newAction = mixerRef.current.clipAction(newAnim);

    // Define loop de acordo com o tipo da animação
    if (animationName === 'shaking') {
      newAction.setLoop(THREE.LoopRepeat, Infinity); // loop infinito para shaking
    } else {
      newAction.setLoop(THREE.LoopOnce, 1); // animação única para static
      newAction.clampWhenFinished = true; // mantém frame final
    }

    actionRef.current.fadeOut(0.2);
    newAction.reset().fadeIn(0.2).play();
    actionRef.current = newAction;
  }, [animationName, animations]);

  return <primitive object={scene.current} />;
}


function Card({ cameraPosition, animationName, id, hoveredCardIndex }) {
  return (
    <div className="card">
      <div className={`canvas-glow ${hoveredCardIndex === id ? 'glow-active' : ''}`} />
      <Canvas
        className="canvas"
        style={{ background: 'none' }}
        camera={{ position: cameraPosition, fov: 15 }}
      >
        <Suspense fallback={null}>
          <PokeballModel animationName={animationName} id={id} hoveredCardIndex={hoveredCardIndex} />
        </Suspense>
        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [sphereStyle, setSphereStyle] = useState(null);
  const [pokemonVisible, setPokemonVisible] = useState(false);
  const [pokemonSrc, setPokemonSrc] = useState(null);

  const cards = [
    { id: 0, position: [0.5, 0.4, 0.7] },
    { id: 1, position: [0, 0.3, 0.7] },
    { id: 2, position: [-0.5, 0.4, 0.7] },
  ];

  const pokemonMap = {
    0: 'assets/pkmn/mew.gif',      // Trabalhos
    1: 'assets/pkmn/pikachu.gif',  // Sobre Mim
    2: 'assets/pkmn/togepi.gif',   // Contato
  };

  // Ao clicar em um card
  const handleCardClick = (index) => {
    const card = document.querySelectorAll('.card-wrapper')[index];
    const rect = card.getBoundingClientRect();

    // Calcula a posição inicial (centro do card)
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    setActiveCard(index);
    setSphereStyle({
      left: `${startX}px`,
      top: `${startY}px`,
      transform: 'translate(-50%, -50%) scale(0)',
    });

    // Inicia animação com pequeno atraso
    setTimeout(() => {
      setSphereStyle({
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) scale(1)',
      });

      // mostra o gif levemente depois que a esfera cresce
      setTimeout(() => {
        setPokemonSrc(pokemonMap[index]);
        setPokemonVisible(true);
      }, 600);
    }, 50);
  };

  const animateSphereBack = () => {
    if (activeCard !== null) {
      // primeiro some o gif
      setPokemonVisible(false);

      setTimeout(() => {
        const card = document.querySelectorAll('.card-wrapper')[activeCard];
        const rect = card.getBoundingClientRect();

        // Calcula a posição final (centro do card)
        const endX = rect.left + rect.width / 2;
        const endY = rect.top + rect.height / 2;

        setSphereStyle({
          left: `${endX}px`,
          top: `${endY}px`,
          transform: 'translate(-50%, -50%) scale(0)',
        });

        // depois esconde tudo
        setTimeout(() => {
          setActiveCard(null);
          setSphereStyle(null);
          setPokemonSrc(null);
        }, 800); // Tempo deve coincidir com a duração da animação CSS
      }, 400); // espera fade-out do gif
    }
  };

  // Fechar a esfera clicando fora
  const handleClose = () => {
    animateSphereBack();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') handleClose();
    };

    const handleRightClick = (event) => {
      event.preventDefault(); // Evita abrir o menu do navegador
      handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleRightClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  const getDialogueText = () => {
    if (activeCard !== null) {
      const options = ['Trabalhos', 'Sobre Mim', 'Contato'];
      return (
        <>
          <div className="choice-container">
            <button className="choice-button" onClick={() => handleChoice('yes')}>Sim</button>
            <button className="choice-button" onClick={() => handleChoice('no')}>Nao</button>
          </div>
          Você tem certeza que deseja escolher <br /> '{options[activeCard]}'?
        </>
      );
    }

    if (hoveredCardIndex === 1) return 'Sobre Mim';
    if (hoveredCardIndex === 0) return 'Trabalhos';
    if (hoveredCardIndex === 2) return 'Contato';

    return (
      <>
        PROF. BIRCH is in trouble!<br />
        Release a POKéMON and rescue him!
      </>
    );
  };

  const handleChoice = (choice) => {
    if (choice === 'no') {
      animateSphereBack();
    } else if (choice === 'yes') {
      if (activeCard === 1) {
        // Trigger animation for 'Sobre Mim'
        const animationContainer = document.createElement('div');
        animationContainer.className = 'animation-container';
        document.body.appendChild(animationContainer);

        let frameIndex = 0;
        const frames = [
          ...Array(34).fill(0).map((_, i) => `public/assets/yellow/frame_${String(i).padStart(2, '0')}_delay-0.02s.png`),
          ...Array(13).fill(0).map((_, i) => `public/assets/yellow/frame_${String(i + 34).padStart(2, '0')}_delay-0.06s.png`),
          'public/assets/yellow/frame_47_delay-0.5s.png',
          'public/assets/yellow/frame_48_delay-1s.png',
        ];

        const showNextFrame = () => {
          if (frameIndex < frames.length) {
            const img = new Image();
            img.src = frames[frameIndex];
            img.onload = () => {
              animationContainer.style.backgroundImage = `url(${frames[frameIndex]})`;
              const delay = parseFloat(frames[frameIndex].match(/delay-([\d.]+)s/)[1]) * 1000;
              frameIndex++;
              setTimeout(showNextFrame, delay);
            };
          } else {
            // Keep the last frame visible until the flash effect
            setTimeout(() => {
              animationContainer.classList.add('fadeout');
              setTimeout(() => {
                document.body.removeChild(animationContainer);
                window.location.href = '/pikachu-aime';
              }, 1000);
            }, 1000); // Wait for the last frame's delay
          }
        };

        showNextFrame();
      } else if (activeCard === 0) {
        navigate('/box'); // Navigate to the /box page for 'Trabalhos'
      } else if (activeCard === 2) {
        navigate('/pokedex'); // Redireciona para a página /pokedex para 'Contato'
      }
    }
  };

  return (
    <div className="home-container">
      <img
        src="assets/bg/hand.svg"
        alt="Hand Icon"
        className={`hover-icon ${hoveredCardIndex !== null ? 'visible' : ''}`}
        style={{
          position: 'absolute',
          top:
            hoveredCardIndex !== null
              ? document.querySelectorAll('.card')[hoveredCardIndex].getBoundingClientRect().top +
                window.scrollY -
                40
              : 0,
          left:
            hoveredCardIndex !== null
              ? document.querySelectorAll('.card')[hoveredCardIndex].getBoundingClientRect().left +
                document.querySelectorAll('.card')[hoveredCardIndex].getBoundingClientRect().width / 2 -
                30
              : 0,
          transform: 'translate(-40%, -100%) scale(1.2)',
          transition: 'top 0.3s, left 0.3s, transform 0.3s',
        }}
      />

      <div className="card-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="card-wrapper"
            onMouseEnter={() => setHoveredCardIndex(index)}
            onMouseLeave={() => setHoveredCardIndex(null)}
            onClick={() => handleCardClick(index)}
          >
            <Card
              cameraPosition={card.position}
              animationName={hoveredCardIndex === index ? 'shaking' : 'static'}
              id={card.id}
              hoveredCardIndex={hoveredCardIndex}
            />
          </div>
        ))}
      </div>

      <div className="dialogue-box" style={{ textAlign: 'left', paddingLeft: '20px', zIndex: 100 }}>
        {getDialogueText()}
      </div>

      {/* Overlay escurecido e esfera central animada */}
      {activeCard !== null && (
        <>
          <div className="dark-overlay" onClick={handleClose}></div>
          <div className="expanding-sphere" style={sphereStyle}></div>
          {pokemonSrc && (
            <img
              src={pokemonSrc}
              alt="Pokemon"
              className={`pokemon-gif ${pokemonVisible ? 'visible' : ''}`}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Home;
