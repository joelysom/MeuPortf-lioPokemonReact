import React, { useEffect, useState, useRef } from 'react';
import styles from './professorTutorial.module.css';

const ProfessorTutorial: React.FC = () => {
	const mainFrameCount = 10; // main animation frames 00..09 (public/assets/professor/animation/)
	// Build public URLs for main animation frames
	const mainFrames = Array.from({ length: mainFrameCount }, (_, i) =>
		`/assets/professor/animation/frame_${String(i).padStart(2, '0')}_delay-${i === 0 || i === 9 ? 0.2 : 0.1}s.png`
	);

	// durations in milliseconds for main animation: frames 0 and 9 => 200ms, others => 100ms
	const mainDurations = mainFrames.map((_, i) => (i === 0 || i === mainFrameCount - 1 ? 200 : 100));

	// Talk animation (played while typing): 4 frames located in public/assets/professor/talk/
	const talkFrameCount = 4; // frame_0 .. frame_3
	const talkFrames = Array.from({ length: talkFrameCount }, (_, i) =>
		`/assets/professor/talk/frame_${String(i).padStart(1, '0')}_delay-0.18s.png`
	);
	// talk durations: 180ms each
	const talkDurations = talkFrames.map(() => 180);

	const [index, setIndex] = useState(0);

	// Chatbox / audio state
	const [started, setStarted] = useState(false);
	// fullMessage is the complete line we want to type; typedText is what's currently shown
	const [fullMessage, setFullMessage] = useState<string | null>(null);
	const [typedText, setTypedText] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const [step, setStep] = useState(0); // 0 = before greeting, 1 = showed greeting, 2 = second message shown
	const [name, setName] = useState('');
	const [confirmedName, setConfirmedName] = useState<string | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [overlayVisible, setOverlayVisible] = useState(true);
	const [overlayFading, setOverlayFading] = useState(false);
	const [showStartScene, setShowStartScene] = useState(false);
	const [flashVisible, setFlashVisible] = useState(false);
	const finalRedirectMessage = 'aagora você está pronto(a), para começar, seja bem vindo(a) ao mundo pokémon.';
	// tutorial card sequence state
	const tutorialImages = [
		'/assets/professor/tutorial/1. pokebolas.PNG',
		'/assets/professor/tutorial/2. pokebola escolhida.PNG',
		'/assets/professor/tutorial/3. escolha sim ou não.PNG',
		'/assets/professor/tutorial/4. os botões.PNG',
		'/assets/professor/tutorial/5. botões box.PNG',
		'/assets/professor/tutorial/6. stick.PNG',
	];
	const tutorialMessages = [
		'PPara usar o portfolio, inicialmente você verá 3 pokebolas.',
		'AAo passar o mouse pela Pokebola, ela irá pulsar um brilho e indicação!',
		'AApós selecionar, um pokémon aparece junto as opções "sim" ou "não" para prosseguir.',
		'OOs botões dentro de cada pokebola, contém informações sobre Joelyson.',
		'OOs botões clicáveis para exibir os projetos são apenas 4.',
		'NNa página de contatos, você moverá o conteúdo pelas setas CIMA E BAIXO.'
	];
	const [cardIndex, setCardIndex] = useState(0);

	// Animation ticker: choose between talk animation (while typing) and main animation
	useEffect(() => {
		let mounted = true;
		const tick = () => {
			if (!mounted) return;
			const currentFrames = isTyping ? talkFrames : mainFrames;
			const currentDurations = isTyping ? talkDurations : mainDurations;
			// ensure index is valid via modulo in next set
			const delay = currentDurations[index % currentDurations.length] ?? 120;
			const timer = window.setTimeout(() => {
				if (!mounted) return;
				setIndex((prev) => (prev + 1) % currentFrames.length);
			}, delay);
			return () => clearTimeout(timer);
		};

		const cleanup = tick();
		return () => {
			mounted = false;
			if (cleanup) cleanup();
		};
		// include isTyping so the ticker switches to the talkFrames when typing starts/stops
	}, [index, isTyping]);

	// When the animation mode changes (typing <-> idle), reset frame index to 0 so the
	// new animation starts from its first frame.
	useEffect(() => {
		setIndex(0);
	}, [isTyping]);

	// cleanup audio on unmount
	useEffect(() => {
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
				audioRef.current = null;
			}
		};
	}, []);

	const handleStart = async () => {
		if (started) return;
		// start overlay fade-to-white and hide it smoothly
		setOverlayFading(true);
		setTimeout(() => setOverlayVisible(false), 2500);
		setStarted(true);
		setFullMessage(null); // blank for 3s (clears typedText via effect)

		// Play audio in loop - use encodeURI to handle spaces/special chars
		const audioSrc = '/assets/professor/1-04. Now for the Adventure!.mp3';
		audioRef.current = new Audio(encodeURI(audioSrc));
		audioRef.current.loop = true;
		// Attempt to play; some browsers block autoplay without interaction — this is an explicit user action.
		try {
			await audioRef.current.play();
		} catch (e) {
			// ignore play failure; user will have interacted so it should usually work
			console.error('audio play failed', e);
		}

		// after 3 seconds set the full message (typing effect will begin)
		setTimeout(() => {
			setFullMessage('oolá, me chamo professora juniper!');
			setStep(1);
		}, 3000);
	};

	const handleNext = () => {
		// progress conversation based on current step
		switch (step) {
			case 1:
				setFullMessage('sseja bem vindo ao portfolio de Joelyson alcantara!');
				setStep(2);
				break;
			case 2:
				setFullMessage('EEu vou ser sua guia para o uso dele.');
				setStep(3);
				break;
			case 3:
				setFullMessage('JJoelyson desenvolveu o Portfolio focando no tema pokemon!');
				setStep(4);
				break;
			case 4:
				setFullMessage('oo universo pokemon é grande e vive expandindo, assim como ele.');
				setStep(5);
				break;
			case 5:
				// ask for the player's name and re-enable the overlay/blur
				setFullMessage('aantes de começar, qual seu nome?');
				setOverlayVisible(true);
				setOverlayFading(false);
				setStep(6); // step 6 = waiting for input
				break;
			case 7:
				// after confirming the name, proceed to the final prompt
				if (confirmedName) {
					setFullMessage(`TTreinador(a) ${confirmedName}, vamos começar!!`);
					setStep(8);
				}
				break;
			// tutorial card sequence (steps 9..13)
			case 9:
				// move to image 2
				setCardIndex(1);
				setFullMessage(tutorialMessages[1]);
				setStep(10);
				break;
			case 10:
				setCardIndex(2);
				setFullMessage(tutorialMessages[2]);
				setStep(11);
				break;
			case 11:
				setCardIndex(3);
				setFullMessage(tutorialMessages[3]);
				setStep(12);
				break;
			case 12:
				setCardIndex(4);
				setFullMessage(tutorialMessages[4]);
				setStep(13);
				break;
			case 13:
				setCardIndex(5);
				setFullMessage(tutorialMessages[5]);
				// show last tutorial card/message; wait for user to click the arrow to finish
				setStep(14);
				break;
			case 14:
				// user clicked the arrow on the final tutorial message
				// hide the start card (sprite will move back) and then show the final redirect message
				setShowStartScene(false);
				// give the card a short moment to begin its hide transition before changing the chat line
				setTimeout(() => {
					setFullMessage(finalRedirectMessage);
					setStep(15);
				}, 300);
				break;
			case 15:
				// final arrow click: flash and redirect to /home
				setFlashVisible(true);
				setTimeout(() => {
					window.location.href = '/home';
				}, 700);
				break;
			default:
				break;
		}
	};

	const confirmName = () => {
		const clean = name.trim() || 'Treinador';
		setConfirmedName(clean);
		// remove blur/overlay immediately on confirm
		setOverlayVisible(false);
		setOverlayFading(false);
		// acknowledge name
		setFullMessage(`eentendi, então seu nome é ${clean}`);
		setStep(7);
	};

	// Typing effect: when fullMessage changes, type it into typedText
	useEffect(() => {
		let timer: number | undefined;
		let i = 0;
		if (fullMessage === null) {
			setTypedText('');
			setIsTyping(false);
			return;
		}
		setTypedText('');
		setIsTyping(true);
		const speed = 40; // ms per character
		const typeNext = () => {
			if (i <= fullMessage.length - 1) {
				setTypedText((s) => s + fullMessage.charAt(i));
				i += 1;
				timer = window.setTimeout(typeNext, speed);
			} else {
				setIsTyping(false);
			}
		};
		typeNext();
		return () => {
			if (timer) window.clearTimeout(timer);
		};
	}, [fullMessage]);

	// choose which frame set to use for rendering
	const currentFrames = isTyping ? talkFrames : mainFrames;
	const currentFrameSrc = currentFrames.length > 0 ? currentFrames[index % currentFrames.length] : '';

	// When the professor finishes saying "{nome}, vamos começar!!" (step 8) trigger the start scene:
	// shift the sprite to the right and reveal a left-side card, then change the chat line.
	useEffect(() => {
		if (step === 8 && !isTyping) {
			// show scene (sprite shift + card)
			setShowStartScene(true);
			setCardIndex(0);
			// after a short delay, change the chatbox message to the usage hint
			const t = window.setTimeout(() => {
				setFullMessage(tutorialMessages[0]);
				setStep(9);
			}, 600);
			return () => window.clearTimeout(t);
		}
		// no cleanup for other cases
	}, [step, isTyping]);

	// NOTE: final tutorial flow (hiding card and redirect) is handled by user clicks in handleNext

	// If the professor acknowledged the name (step 7) and typing finished, auto-advance
	// to the "Treinador(a) {name}, vamos começar!!" line so the start scene triggers without
	// requiring the user to click the arrow.
	useEffect(() => {
		if (step === 7 && !isTyping) {
			const t = window.setTimeout(() => {
				if (confirmedName) {
					setFullMessage(`TTreinador(a) ${confirmedName}, vamos começar!!`);
					setStep(8);
				}
			}, 300);
			return () => window.clearTimeout(t);
		}
	}, [step, isTyping, confirmedName]);

	return (
		<div className={styles.professorPageWrapper}>
			{/* overlay behind chatbox while Start is visible */}
			{overlayVisible ? (
				<div className={`${styles.overlay} ${overlayFading ? styles.overlayWhiteFade : ''}`} />
			) : null}
			{flashVisible ? <div className={styles.screenFlash} /> : null}
					{/* start card that appears when starting the tutorial */}
					<div className={`${styles.startCard} ${showStartScene ? styles.startCardVisible : ''}`} aria-hidden={!showStartScene}>
						<div className={styles.startCardContent}>
							<h3>Instruções</h3>
							{/* tutorial image (from tutorialImages array) */}
							<img
								src={encodeURI(tutorialImages[cardIndex] ?? tutorialImages[0])}
								alt="Tutorial"
								className={styles.startCardImage}
							/>
						</div>
					</div>
					<div className={`${styles.professorAnimationBox} ${showStartScene ? styles.shiftRight : ''}`} role="img" aria-label="Animação do professor">
					<img
						src={currentFrameSrc}
						alt={`Professor frame ${String(index).padStart(2, '0')}`}
						className={styles.professorAnimationImage}
						draggable={false}
					/>
				</div>

			{/* Chatbox: estilo inspirado no DS (Pokemon Black & White) */}
			<div className={styles.professorChatboxWrapper} aria-live="polite">
				<div className={styles.professorChatbox} role="dialog" aria-label="Caixa de diálogo da professora">
						<div className={`${styles.professorChatboxText} ${isTyping ? styles.typing : ''}`} aria-hidden={fullMessage === null}>
							{typedText === '' ? '\u00A0' : typedText}
					</div>
							<div className={styles.professorChatboxActions}>
								{!started ? (
									<button className={`${styles.professorChatboxButton} ${overlayVisible ? styles.highlightButton : ''}`} onClick={handleStart}>
										Começar
									</button>
								) : null}

								{/* Name input shown when we're asking for the player's name (step 6) and typing finished */}
								{step === 6 && !isTyping ? (
									<div className={styles.nameInputWrapper}>
										<input
											type="text"
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="Seu nome..."
											className={styles.nameInput}
											aria-label="Nome do jogador"
										/>
										<button className={styles.nameConfirmButton} onClick={confirmName}>
											Confirmar
										</button>
									</div>
								) : null}
							</div>
					{/* next arrow button appears after messages and after typing finished (hidden during name input step 6) */}
					{(step !== 6 && step !== 8 && step >= 1) && !isTyping ? (
						<button
							className={styles.professorChatboxNext}
							onClick={handleNext}
							aria-label="Próximo"
						>
							<span className={styles.professorChev} aria-hidden />
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default ProfessorTutorial;
