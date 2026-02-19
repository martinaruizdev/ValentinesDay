import React, { useState, useEffect, useRef } from 'react';
import { Heart, Music, Map, Mail, Trophy, Volume2, X } from 'lucide-react';

// Hook para reproducir sonido de click
const useClickSound = () => {
  const playClick = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.5; // Volumen al 50%
    audio.play().catch(err => console.log('Error playing sound:', err));
  };
  return playClick;
};

// Hook para música de fondo
const useBackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio('/background-music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Volumen al 30% para que no moleste

    // Intentar reproducir automáticamente con sonido
    const attemptAutoplay = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.log('Autoplay bloqueado, esperando interacción del usuario');
        // Si falla el autoplay, intentar reproducir con la primera interacción
        const playOnInteraction = async () => {
          try {
            await audioRef.current.play();
            setIsPlaying(true);
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('keydown', playOnInteraction);
          } catch (e) {
            console.log('Error al reproducir:', e);
          }
        };
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('keydown', playOnInteraction, { once: true });
      }
    };

    attemptAutoplay();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => console.log('Error al reproducir:', err));
      }
    }
  };

  const pauseMusic = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
  };

  const resumeMusic = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  };

  return { isPlaying, toggleMusic, pauseMusic, resumeMusic };
};

export default function PixelValentine() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [currentSection, setCurrentSection] = useState('home');
  const [showError, setShowError] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);
  const { isPlaying, toggleMusic, pauseMusic, resumeMusic } = useBackgroundMusic();

  const [heartParticles] = useState(() => {
    return [...Array(8)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 4 + Math.random() * 2,
      delay: i * 0.8
    }));
  });

  const [stars] = useState(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3
    }));
  });

  const checkPasscode = () => {
    const validCodes = ['25/12/25', '251225', '25-12-25'];
    if (validCodes.includes(passcode)) {
      setIsUnlocked(true);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
    }
  };

  return (
    <div className="pixel-container">
      {/* Pixel art background */}
      <div className="pixel-background">

        {/* Twinkling stars */}
        <div className="stars">
          {stars.map(star => (
            <div
              key={star.id}
              className="star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`
              }}
            />
          ))}
        </div>

        <div className="pixel-hearts-float">
          {heartParticles.map((heart) => (
            <div
              key={heart.id}
              className="pixel-heart-particle"
              style={{
                left: `${heart.left}%`,
                animationDelay: `${heart.delay}s`,
                animationDuration: `${heart.duration}s`
              }}
            >
              💗
            </div>
          ))}
        </div>
      </div>

      {!isUnlocked ? (
        <PasscodeScreen
          passcode={passcode}
          setPasscode={setPasscode}
          checkPasscode={checkPasscode}
          showError={showError}
        />
      ) : (
        <>
          <GameWorld
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            completedLevels={completedLevels}
            setCompletedLevels={setCompletedLevels}
            pauseMusic={pauseMusic}
            resumeMusic={resumeMusic}
          />
          
          {/* Botón de control de música */}
          <button className="music-control-btn" onClick={toggleMusic}>
            {isPlaying ? '🔊' : '🔇'}
          </button>
        </>
      )}

      <style jsx>{`
        .pixel-container {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          image-rendering: pixelated;
          font-family: 'Courier New', monospace;
          width: 100%;
        }

        .pixel-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background-image: url('/fondo2.gif');
          background-size: cover; 
          background-position: center; 
          background-repeat: no-repeat;
        }

        .pixel-background::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.3); 
          z-index: 1;
        }

        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
          box-shadow: 0 0 4px white;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .pixel-hearts-float {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .pixel-heart-particle {
          position: absolute;
          font-size: 20px;
          animation: float-heart 5s linear infinite;
          filter: drop-shadow(0 0 5px rgba(255, 107, 157, 0.6));
        }

        @keyframes float-heart {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        .music-control-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ff6b9d;
          border: 4px solid #c44569;
          box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.3);
          font-size: 28px;
          cursor: pointer;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .music-control-btn:hover {
          transform: scale(1.1);
          box-shadow: 8px 8px 0 0 rgba(0, 0, 0, 0.3);
        }

        .music-control-btn:active {
          transform: scale(0.95);
          box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .music-control-btn {
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}

function PasscodeScreen({ passcode, setPasscode, checkPasscode, showError }) {
  const playClick = useClickSound();
  return (
    <div className="passcode-overlay">
      <div className="pixel-window">
        <div className="pixel-title">
          PARA MI AMOR,<br />SIEMPRE 💗
        </div>
        <div className="pixel-subtitle">
          INGRESA LA CONTRASEÑA Y ABRE CON CARIÑO. ES PARA TI.
        </div>

        <div className="passcode-box">
          <input
            type="text"
            className={`pixel-input ${showError ? 'shake' : ''}`}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkPasscode()}
            placeholder="DD/MM/YY"
            maxLength={8}
          />
        </div>

        <button className="pixel-button" onClick={() => { playClick(); checkPasscode(); }}>
          <Heart className="button-heart" size={20} fill="#fff" />
          JUGAR JUNTOS
          <Heart className="button-heart" size={20} fill="#fff" />
        </button>

        {showError && (
          <div className="pixel-error">
            ❌ INTENTA OTRA VEZ, MI AMOR
          </div>
        )}
      </div>

      <style jsx>{`
        .passcode-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }

        .pixel-window {
          text-align: center;
          animation: window-appear 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes window-appear {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(-100px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .pixel-title {
          font-size: 56px;
          font-weight: 900;
          color: white;
          text-shadow: 
            4px 4px 0px #ff6b9d,
            8px 8px 0px rgba(0, 0, 0, 0.3);
          margin-bottom: 20px;
          letter-spacing: 3px;
          line-height: 1.3;
          image-rendering: pixelated;
          font-family: 'Courier New', monospace;
        }

        .pixel-subtitle {
          font-size: 20px;
          color: white;
          text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
          margin-bottom: 40px;
          letter-spacing: 2px;
        }

        .passcode-box {
          margin-bottom: 30px;
        }

        .pixel-input {
          font-size: 32px;
          padding: 20px 30px;
          background: rgba(255, 255, 255, 0.95);
          border: 4px solid #2d2256;
          box-shadow: 
            0 0 0 4px white,
            0 0 0 8px #2d2256,
            8px 8px 0 8px rgba(0, 0, 0, 0.3);
          color: #2d2256;
          text-align: center;
          font-family: 'Courier New', monospace;
          font-weight: 900;
          letter-spacing: 8px;
          width: 100%;
          max-width: 350px;
          image-rendering: pixelated;
        }

        .pixel-input:focus {
          outline: none;
          animation: input-pulse 0.5s ease-in-out;
        }

        @keyframes input-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .pixel-input.shake {
          animation: shake 0.5s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-15px); }
          75% { transform: translateX(15px); }
        }

        .pixel-input::placeholder {
          color: rgba(45, 34, 86, 0.3);
        }

        .pixel-button {
          background: #ff6b9d;
          border: 4px solid #c44569;
          box-shadow: 
            0 0 0 4px #ff6b9d,
            8px 8px 0 0 rgba(0, 0, 0, 0.3);
          color: white;
          font-size: 20px;
          font-weight: 900;
          padding: 18px 40px;
          cursor: pointer;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          display: inline-flex;
          align-items: center;
          gap: 15px;
          transition: all 0.1s;
          image-rendering: pixelated;
        }

        .pixel-button:hover {
          transform: translate(2px, 2px);
          box-shadow: 
            0 0 0 4px #ff6b9d,
            6px 6px 0 0 rgba(0, 0, 0, 0.3);
        }

        .pixel-button:active {
          transform: translate(4px, 4px);
          box-shadow: 
            0 0 0 4px #ff6b9d,
            4px 4px 0 0 rgba(0, 0, 0, 0.3);
        }

        .button-heart {
          animation: heart-beat 1.5s ease-in-out infinite;
        }

        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .pixel-error {
          margin-top: 25px;
          color: #ff3366;
          font-size: 18px;
          font-weight: 900;
          text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
          letter-spacing: 2px;
          animation: error-blink 0.5s;
        }

        @keyframes error-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @media (max-width: 768px) {
          .pixel-title {
            font-size: 32px;
          }

          .pixel-subtitle {
            font-size: 14px;
          }

          .pixel-input {
            font-size: 24px;
            padding: 15px 20px;
            max-width: 280px;
          }

          .pixel-button {
            font-size: 16px;
            padding: 15px 30px;
          }
        }
      `}</style>
    </div>
  );
}

function GameWorld({ currentSection, setCurrentSection, completedLevels, setCompletedLevels, pauseMusic, resumeMusic }) {
  const [hasSeenMessage, setHasSeenMessage] = useState(false);
  const playClick = useClickSound();

  if (currentSection === 'home') {
    return (
      <HomeMenu
        setCurrentSection={setCurrentSection}
        hasSeenMessage={hasSeenMessage}
        setHasSeenMessage={setHasSeenMessage}
        completedLevels={completedLevels}
        setCompletedLevels={setCompletedLevels}
      />
    );
  }

  return (
    <>
      <div className="game-section">
        <button className="pixel-back-btn" onClick={() => {
          playClick();
          setCurrentSection('home');
        }}>
          <span className="arrow">←</span> VOLVER
        </button>

        {currentSection === 'music' && <MusicSection />}
        {currentSection === 'map' && <MapSection />}
        {currentSection === 'letter' && <LetterSection />}
        {currentSection === 'photos' && <PhotosSection />}
        {currentSection === 'barca' && <BarcaSection />}
        {currentSection === 'lovereasons' && <LoveReasonsSection pauseMusic={pauseMusic} resumeMusic={resumeMusic} />}
        {currentSection === 'whosmorelikely' && <WhoIsMoreSection />}
        {currentSection === 'movies' && <MoviesSection />}
        

        <style jsx>{`
          .game-section {
            position: relative;
            z-index: 10;
            min-height: 100vh;
            padding: 40px 20px;
            width: 100%;  
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .pixel-back-btn {
            position: fixed;
            top: 30px;
            left: 30px;
            background: white;
            border: 4px solid #2d2256;
            box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);
            color: #2d2256;
            font-size: 16px;
            font-weight: 900;
            padding: 12px 24px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            transition: all 0.1s;
          }

          .pixel-back-btn:hover {
            transform: translate(1px, 1px);
            box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.3);
          }

          .pixel-back-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.3);
          }

          .arrow {
            font-size: 20px;
          }

          @media (max-width: 768px) {
            .pixel-back-btn {
              top: 20px;
              left: 20px;
              padding: 10px 16px;
              font-size: 14px;
            }
          }
        `}</style>
      </div>

      <SkipperCompanion />
    </>
  );
}

function HomeMenu({ setCurrentSection, hasSeenMessage, setHasSeenMessage, completedLevels, setCompletedLevels }) {
  const [showBrowser, setShowBrowser] = useState(!hasSeenMessage);
  const [browserClosing, setBrowserClosing] = useState(false);
  const [activeSurprise, setActiveSurprise] = useState(null);
  const playClick = useClickSound();

  const menuItems = [
    { 
      id: 'music', 
      label: 'SORPRESA 1', 
      color: '#ff6b9d',
      challenge: {
        type: 'question',
        question: '¿Qué canción me hace pensar en ti?',
        options: ['Mil Vidas', 'Un Verano Sin Ti', 'Me Rehúso', 'La Pregunta'],
        correctAnswer: 'Mil Vidas'
      }
    },
    { 
      id: 'map', 
      label: 'SORPRESA 2', 
      color: '#fd7e84ff',
      challenge: {
        type: 'puzzle',
        question: '¿Cuántos kilómetros nos separan?',
        answer: '2490'
      }
    },
    { 
      id: 'letter', 
      label: 'SORPRESA 3', 
      color: '#ff8fa3',
      challenge: {
        type: 'question',
        question: '¿Qué es lo más importante en nuestro amor?',
        options: ['La distancia', 'Los recuerdos', 'Nuestro corazón', 'El tiempo'],
        correctAnswer: 'Nuestro corazón'
      }
    },
    { 
      id: 'barca', 
      label: 'SORPRESA 4', 
      color: '#a50044',
      challenge: {
        type: 'puzzle',
        question: 'Completa: "Juntos somos un ______"',
        answer: 'equipo'
      }
    },
    { 
      id: 'lovereasons', 
      label: 'SORPRESA 5', 
      color: '#d946ef',
      challenge: {
        type: 'wordsearch',
        question: 'Encuentra todos los apodos en la sopa de letras:',
        words: ['CACHETONA', 'AMOR', 'MIVIDA', 'MAMI']
      }
    },
    { 
      id: 'whosmorelikely', 
      label: 'SORPRESA 6', 
      color: '#f59e0b',
      challenge: {
        type: 'whosmorelikely',
        questions: [
          {
            question: '¿Quién se pondría celoso más rápido?',
            options: ['Carlos', 'Dalel', 'Ambos'],
            correctAnswer: 'Carlos'
          },
          {
            question: '¿Quién lloraría durante una película?',
            options: ['Carlos', 'Dalel', 'Ambos'],
            correctAnswer: 'Dalel'
          },
          {
            question: '¿Quién haría lo que fuera por la otra persona?',
            options: ['Carlos', 'Dalel', 'Ambos'],
            correctAnswer: 'Ambos'
          }
        ]
      }
    },
    {
      id: 'movies',
      label: 'PELÍCULAS 🎬',
      color: '#7c3aed',
      noChallenge: true
    }
  ];

  const isSurpriseUnlocked = (index) => {
    if (index === 0) return true;
    if (menuItems[index].noChallenge) return true;
    return completedLevels.includes(menuItems[index - 1].id);
  };

  const handleFolderClick = (item, index) => {
    if (!isSurpriseUnlocked(index)) return;
    
    playClick(); // Reproducir sonido de click
    
    if (item.noChallenge || completedLevels.includes(item.id)) {
      setCurrentSection(item.id);
    } else {
      setActiveSurprise(item);
    }
  };

  const handleChallengeSuccess = (itemId) => {
    if (!completedLevels.includes(itemId)) {
      setCompletedLevels([...completedLevels, itemId]);
    }
    setActiveSurprise(null);
    setCurrentSection(itemId);
  };

  const closeBrowser = () => {
    playClick(); // Reproducir sonido de click
    setBrowserClosing(true);
    setTimeout(() => {
      setShowBrowser(false);
      setHasSeenMessage(true);
    }, 500);
  };

  return (
    <div className="home-menu">
      {/* Browser Window with Message */}
      {showBrowser && (
        <div className={`pixel-browser ${browserClosing ? 'closing' : ''}`}>
          <div className="browser-header">
            <div className="browser-dots">
              <span className="dot red" onClick={closeBrowser}></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="browser-title">Mensaje.txt</div>
          </div>

          <div className="browser-content">
            <div className="welcome-message">
              <p>Esto es para ti.</p>
              <p>Para la persona que elijo</p>
              <p>en cada versión del día.</p>
              <p>Cerca o lejos,</p>
              <p>eres donde mi corazón va primero.</p>
            </div>

            <button className="close-message-btn" onClick={closeBrowser}>
              Continuar ➜
            </button>
          </div>
        </div>
      )}

      {/* Desktop with Folders */}
      {!showBrowser && (
        <div className="desktop-screen">
          <div className="desktop-title">Archivos Sorpresa</div>
          <div className="desktop-subtitle">El amor se despliega un click a la vez 💕</div>

          <div className="folders-grid">
            {menuItems.map((item, index) => {
              const isUnlocked = isSurpriseUnlocked(index);
              const isCompleted = completedLevels.includes(item.id);
              
              return (
                <div
                  key={item.id}
                  className={`pixel-folder ${!isUnlocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleFolderClick(item, index)}
                  style={{
                    '--folder-color': item.color,
                    animationDelay: `${index * 0.15}s`,
                    cursor: isUnlocked ? 'pointer' : 'not-allowed'
                  }}
                >
                  <div className="folder-icon">
                    {!isUnlocked ? (
                      <div style={{ fontSize: '50px' }}>🔒</div>
                    ) : (
                      <img
                        src="/carpeta.png"
                        alt="Icono de carpeta"
                        style={{ width: '50px', height: '50px' }}
                      />
                    )}
                  </div>
                  <div className="folder-label">
                    {isUnlocked ? item.label : `NIVEL ${index + 1} BLOQUEADO`}
                  </div>
                  {isCompleted && (
                    <div className="completed-badge">✓ COMPLETADO</div>
                  )}
                  {!isUnlocked && (
                    <div className="unlock-hint">Completa el nivel anterior</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSurprise && (
        <ChallengeModal
          surprise={activeSurprise}
          onClose={() => setActiveSurprise(null)}
          onSuccess={() => handleChallengeSuccess(activeSurprise.id)}
        />
      )}

      <style jsx>{`
        .home-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }

        .pixel-browser {
          width: 100%;
          max-width: 700px;
          background: rgba(255, 255, 255, 0.98);
          border: 4px solid #2d2256;
          box-shadow: 12px 12px 0 0 rgba(0, 0, 0, 0.3);
          animation: browser-appear 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
        }

        .pixel-browser.closing {
          animation: browser-close 0.5s ease-out forwards;
        }

        @keyframes browser-appear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(50px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes browser-close {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.9) translateY(-30px);
          }
        }

        .browser-header {
          background: linear-gradient(to bottom, #e8b4d9, #d89cc9);
          border-bottom: 4px solid #2d2256;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .browser-dots {
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.2s;
        }

        .dot:hover {
          transform: scale(1.2);
        }

        .dot.red { 
          background: #ff5f56;
        }
        
        .dot.red:hover {
          box-shadow: 0 0 10px #ff5f56;
        }
        
        .dot.yellow { background: #ffbd2e; }
        .dot.green { background: #27c93f; }

        .browser-title {
          flex: 1;
          text-align: center;
          font-weight: 900;
          font-size: 18px;
          color: #2d2256;
          letter-spacing: 1px;
        }

        .browser-content {
          padding: 60px 50px;
          text-align: center;
        }

        .welcome-message {
          background: white;
          border: 3px solid #d89cc9;
          border-radius: 8px;
          padding: 40px 30px;
          margin-bottom: 40px;
          box-shadow: 4px 4px 0 0 rgba(216, 156, 201, 0.3);
        }

        .welcome-message p {
          font-size: 22px;
          color: #6b5b95;
          margin: 12px 0;
          font-family: 'Courier New', monospace;
          line-height: 1.6;
          font-weight: 600;
        }

        .close-message-btn {
          background: #ff6b9d;
          border: 4px solid #c44569;
          box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.3);
          color: white;
          font-size: 18px;
          font-weight: 900;
          padding: 16px 50px;
          cursor: pointer;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          transition: all 0.1s;
        }

        .close-message-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);
        }

        .close-message-btn:active {
          transform: translate(4px, 4px);
          box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.3);
        }

        /* Desktop View */
        .desktop-screen {
          width: 100%;
          max-width: 1200px;
          animation: desktop-appear 0.8s ease-out;
        }

        @keyframes desktop-appear {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .desktop-title {
          font-size: 56px;
          font-weight: 900;
          color: white;
          text-align: center;
          margin-bottom: 15px;
          text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
          letter-spacing: 4px;
        }

        .desktop-subtitle {
          text-align: center;
          font-size: 22px;
          color: white;
          margin-bottom: 50px;
          font-family: 'Courier New', monospace;
          font-weight: 600;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
        }

        .folders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 40px;
          padding: 20px;
        }

        .pixel-folder {
          cursor: pointer;
          text-align: center;
          padding: 30px 20px;
          border: 4px solid transparent;
          border-radius: 12px;
          transition: all 0.2s;
          animation: folder-appear 0.6s ease-out backwards;
          position: relative;
          background: rgba(255, 255, 255, 0.3);
        }

        @keyframes folder-appear {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .pixel-folder:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: var(--folder-color);
          transform: translateY(-10px) scale(1.05);
          box-shadow: 8px 8px 0 0 rgba(0, 0, 0, 0.3);
        }

        .folder-icon {
          font-size: 100px;
          margin-bottom: 15px;
          filter: drop-shadow(6px 6px 0 rgba(0, 0, 0, 0.2));
          transition: transform 0.2s;
        }

        .pixel-folder:hover .folder-icon {
          transform: scale(1.1);
        }

        .pixel-folder.locked {
          opacity: 0.5;
          background: rgba(100, 100, 100, 0.4);
        }

        .pixel-folder.locked:hover {
          transform: none;
          box-shadow: none;
        }

        .pixel-folder.completed {
          border-color: #4CAF50;
          background: rgba(76, 175, 80, 0.1);
        }

        .completed-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #4CAF50;
          color: white;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .unlock-hint {
          margin-top: 8px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          font-style: italic;
        }

        .folder-emoji {
          font-size: 40px;
          margin-bottom: 15px;
          filter: drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.2));
        }

        .folder-label {
          font-size: 16px;
          font-weight: 900;
          color: white;
          letter-spacing: 2px;
          font-family: 'Courier New', monospace;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .browser-content {
            padding: 40px 25px;
          }

          .welcome-message {
            padding: 30px 20px;
          }

          .welcome-message p {
            font-size: 18px;
          }

          .close-message-btn {
            font-size: 16px;
            padding: 14px 35px;
          }

          .desktop-title {
            font-size: 36px;
          }

          .desktop-subtitle {
            font-size: 16px;
          }

          .folders-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
          }

          .pixel-folder {
            padding: 25px 15px;
          }

          .folder-icon {
            font-size: 70px;
          }

          .folder-emoji {
            font-size: 30px;
          }

          .folder-label {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

function MusicSection() {
  const songs = [
    { title: 'Mil Vidas', artist: 'Mora', color: '#ff6b9d', link: 'https://youtu.be/RTu9GDfGwks?si=y5-Asn7el500Z5id' },
    { title: 'Mi Vida Entera', artist: 'Morat', color: '#ff7076', link: 'https://youtu.be/ooCnP_s0K6s?si=I_F2L-R7Gkdng6rT'  },
    { title: 'Valió La Pena', artist: 'Marc Anthony', color: '#d359da', link: 'https://youtu.be/ogxwJFsRhNM?si=RgA-BeLEOWdmMQoo'  },
    { title: 'If I Could Fly', artist: 'One Direction', color: '#322167',link: 'https://youtu.be/L47mRyhxsBw?si=iawUkeJ0bOLlrQvy'  }
  ];

  return (
    <div className="music-section">
      <div className="section-title">
        CANCIONES QUE ME RECUERDAN A TI
      </div>

      <div className="songs-container">
        {songs.map((song, index) => (
          <a
href={song.link}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            className="pixel-song-card"
            style={{
              '--song-color': song.color,
              animationDelay: `${index * 0.15}s`,
              textDecoration: 'none', // Quita el subrayado
              color: 'inherit',       // Mantiene el color original
              display: 'flex'         // Mantiene el diseño flexbox
            }}
          >
            <div className="song-number">#{index + 1}</div>
            <div className="song-info">
              <div className="song-title">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
            <div className="song-visualizer">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </a>
        ))}
      </div>

      <a
        href="https://open.spotify.com/playlist/2vhRKNyj9TSQ5RVu98m41Z?si=35af8e9582b54279&pt=dd748dc3ada1dba32a4b12b277aadc59"
        target="_blank"
        rel="noopener noreferrer"
        className="spotify-button"
      >
        <span className="spotify-icon">💗</span>
        ESCUCHAR EN SPOTIFY
        <span className="spotify-icon">💗</span>
      </a>
      <div className="music-note">
        Me recuerdan a ti y me hacen sonreir 💕
      </div> 

      <style jsx>{`
        .music-section {
          position: relative; 
          width: 100%;
          
          min-height: 100vh; 
          
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 100;

          padding: 40px 20px; 
          box-sizing: border-box; 
        }

        .section-title {
          font-size: 48px;
          font-weight: 900;
          color: white;
          text-align: center;
          margin-bottom: 50px;
          text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
          letter-spacing: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .title-icon {
          font-size: 56px;
        }

        .songs-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
          width: 100%;
          max-width: 600px; 
        }

        .pixel-song-card {
          background: white;
          border: 4px solid #2d2256;
          box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.3);
          padding: 25px 30px;
          display: flex;
          align-items: center;
          gap: 25px;  
          transition: all 0.2s;
          animation: card-slide 0.6s ease-out backwards;
          position: relative;
          overflow: hidden;
        }

        .pixel-song-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 6px;
          height: 100%;
          background: var(--song-color);
        }

        @keyframes card-slide {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .pixel-song-card:hover {
          transform: translateX(8px);
          box-shadow: 8px 8px 0 0 rgba(0, 0, 0, 0.3);
        }

        .song-number {
          font-size: 32px;
          font-weight: 900;
          color: var(--song-color);
          font-family: 'Courier New', monospace;
          min-width: 60px;
        }

        .song-info {
          flex: 1;
        }

        .song-title {
          font-size: 22px;
          font-weight: 900;
          color: #2d2256;
          margin-bottom: 5px;
          font-family: 'Courier New', monospace;
        }

        .song-artist {
          font-size: 16px;
          color: #6b5b95;
          font-family: 'Courier New', monospace;
        }

        .song-visualizer {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 50px;
        }

        .bar {
          width: 8px;
          background: var(--song-color);
          animation: bar-bounce 0.8s ease-in-out infinite;
          border-radius: 2px;
        }

        .bar:nth-child(1) { animation-delay: 0s; }
        .bar:nth-child(2) { animation-delay: 0.2s; }
        .bar:nth-child(3) { animation-delay: 0.4s; }
        .bar:nth-child(4) { animation-delay: 0.6s; }

        @keyframes bar-bounce {
          0%, 100% { height: 15px; }
          50% { height: 45px; }
        }

        .spotify-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          background: #ff6b9d;
          border: 4px solid #c44569;
          box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.3);
          color: white;
          font-size: 20px;
          font-weight: 900;
          padding: 20px 40px;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          text-decoration: none;
          transition: all 0.2s;
          margin-bottom: 30px;
        }

        .spotify-button:hover {
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);
        }

        .spotify-button:active {
          transform: translate(4px, 4px);
          box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.3);
        }

        .spotify-icon {
          font-size: 28px;
        }

        .music-note {
          margin-top: 40px;
          text-align: center;
          font-size: 20px;
          color: white;
          font-family: 'Courier New', monospace;
          background: rgba(255, 107, 157, 0.3);
          border: 3px solid white;
          padding: 20px;
          box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 32px;
            gap: 15px;
          }

          .pixel-song-card {
            padding: 20px;
            gap: 15px;
          }

          .song-number {
            font-size: 24px;
            min-width: 40px;
          }

          .song-title {
            font-size: 18px;
          }

          .song-artist {
            font-size: 14px;
          }

          .spotify-button {
            font-size: 16px;
            padding: 16px 30px;
          }
        }
      `}</style>
    </div>
  );
}

function MapSection() {
  return (
    <div className="map-section">
        <div className="section-title">
        NUESTRA DISTANCIA
      </div>
      <div className="distance-card">
        {/* Distancia en KM arriba */}
        <div className="km-badge">
          <span className="km-number">2,490</span>
          <span className="km-label">km</span>
        </div>

        {/* Contenedor principal con mapa de fondo */}
        <div className="map-container">
          {/* Fondo de mapa satelital/ilustración */}
          <div className="map-background">

            {/* Efecto de líneas de mapa */}
            <svg className="map-lines" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(200,200,200,0.3)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Curva que representa la ruta */}
              <path 
                d="M 100,300 Q 300,100 500,200" 
                fill="none" 
                stroke="#ff6b9d" 
                strokeWidth="3" 
                strokeDasharray="8,8"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Fotos de perfil con conexión */}
          <div className="profiles-connection">
            {/* Foto izquierda - Venezuela */}
            <div className="profile-container">
              <div className="profile-wrapper">
                <img 
                  src="/Dalel.jpg" 
                  alt="Dalel"
                  className="profile-photo"
                />
                <div className="profile-flag">🇻🇪</div>
              </div>
              <div className="location-text">
                <div className="location-name">Dalel</div>
                <div className="location-place">Valencia, Venezuela</div>
              </div>
            </div>

            {/* Línea punteada conectora */}
            <div className="connection-line">
              <div className="dotted-connector"></div>
              <Heart className="heart-connector" size={32} fill="#ff6b9d" color="#ff6b9d" />
            </div>

            {/* Foto derecha - Florida */}
            <div className="profile-container">
              <div className="profile-wrapper">
                <img 
                  src="/Carlos.jpg" 
                  alt="Carlos"
                  className="profile-photo"
                />
                <div className="profile-flag">🇺🇸</div>
              </div>
              <div className="location-text">
                <div className="location-name">Carlos</div>
                <div className="location-place">Clearwater, Florida</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de texto descriptivo */}
        <div className="distance-message">
          Distancia entre
          <strong> Dalel</strong> y <strong>Carlos</strong>
        </div>

        {/* Mensaje de amor */}
        <div className="love-message">
          Pero nuestro amor no tiene fronteras 💕
        </div>
      </div>

      <style jsx>{`

        .section-title {
          font-size: 48px;
          font-weight: 900;
          color: white;
          text-align: center;
          margin-bottom: 50px;
          text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
          letter-spacing: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .map-section {
          max-width: 700px;
          width: 100%;
          margin: 0 auto;
          padding: 20px;
        }

        .distance-card {
          background: linear-gradient(135deg, #f5f3ed 0%, #ede9dd 100%);
          border-radius: 24px;
          padding: 40px 30px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          border: 4px solid #2d2256;
        }

        .km-badge {
          background-color: #ff6b9d;
          color: white;
          padding: 12px 32px;
          border-radius: 50px;
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          margin: 0 auto 30px;
          display: flex;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          border: 3px solid rgba(255, 255, 255, 0.4);
          font-family: 'Courier New', monospace;
          font-weight: 900;
        }

        .km-number {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .km-label {
          font-size: 18px;
          font-weight: 700;
          opacity: 0.95;
        }

        .map-container {
          background: white;
          border-radius: 20px;
          padding: 40px 30px;
          position: relative;
          overflow: hidden;
          margin-bottom: 25px;
          border: 3px solid #2d2256;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .map-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          z-index: 0;
          background-image: url('/mapa.jpg');
          background-size: cover;      
          background-position: center; 
          background-repeat: no-repeat; 
        }

        .map-lines {
          width: 100%;
          height: 100%;
        }

        .profiles-connection {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          z-index: 1;
        }

        .profile-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          flex: 0 0 auto;
        }

        .profile-wrapper {
          position: relative;
        }

        .profile-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid white;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          background: #f0f0f0;
        }

        .profile-flag {
          position: absolute;
          bottom: -5px;
          right: -5px;
          font-size: 32px;
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
        }

        .location-text {
          text-align: center;
        }

        .location-name {
          font-size: 18px;
          font-weight: 900;
          color: #2d2256;
          margin-bottom: 4px;
          font-family: 'Courier New', monospace;
        }

        .location-place {
          font-size: 13px;
          color: #666;
          font-weight: 600;
        }

        .connection-line {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin: 0 -10px;
        }

        .dotted-connector {
          position: absolute;
          width: 100%;
          height: 3px;
          background-image: repeating-linear-gradient(
            90deg,
            #2d2256 0px,
            #2d2256 12px,
            transparent 12px,
            transparent 24px
          );
          opacity: 0.6;
        }

        .heart-connector {
          position: relative;
          z-index: 2;
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
          animation: heart-pulse 2s ease-in-out infinite;
        }

        @keyframes heart-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .distance-message {
          text-align: center;
          font-size: 18px;
          color: #2d2256;
          line-height: 1.6;
          font-weight: 500;
          margin-bottom: 20px;
          font-family: 'Courier New', monospace;
        }

        .distance-message strong {
          font-weight: 900;
          color: #ff6b9d;
        }

        .love-message {
          background: rgba(255, 107, 157, 0.15);
          border: 3px solid #ff6b9d;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          font-size: 20px;
          color: #2d2256;
          font-weight: 700;
          font-family: 'Courier New', monospace;
        }

        @media (max-width: 768px) {
          .distance-card {
            padding: 30px 20px;
          }

          .km-badge {
            padding: 10px 24px;
          }

          .km-number {
            font-size: 24px;
          }

          .km-label {
            font-size: 16px;
          }

          .map-container {
            padding: 30px 20px;
          }

          .profiles-connection {
            flex-direction: column;
            gap: 30px;
          }

          .profile-photo {
            width: 100px;
            height: 100px;
          }

          .profile-flag {
            font-size: 28px;
          }

          .connection-line {
            width: 3px;
            height: 60px;
            margin: 0;
          }

          .dotted-connector {
            width: 3px;
            height: 100%;
            background-image: repeating-linear-gradient(
              180deg,
              #2d2256 0px,
              #2d2256 12px,
              transparent 12px,
              transparent 24px
            );
          }

          .distance-message {
            font-size: 16px;
          }

          .love-message {
            font-size: 18px;
            padding: 18px;
          }
        }

        @media (max-width: 480px) {
          .profile-photo {
            width: 85px;
            height: 85px;
          }

          .location-name {
            font-size: 16px;
          }

          .location-place {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}



function LetterSection() {
  return (
    <div className="letter-section">
      <div className="section-title">
        PARA TI, CARLOS
      </div>

      <div className="pixel-letter">
        <div className="letter-header">
          <div className="stamp">💕</div>
        </div>

        <div className="letter-body">
          <p className="letter-greeting">Carlos,</p>

          <p>Mi amor por ti no sabe de tiempos, tengo la certeza de que llegaste para cambiarlo todo. Me devolviste la esperanza, trajiste luz a mi vida y me hiciste amarte con una intensidad que todavía me revuelve los sentidos.</p>

          <p>Eres mi pensamiento más constante. Por eso, aun cuando tenemos nuestras diferencias, mi paz se altera por completo, porque mi refugio es estar bien contigo.</p>

          <p>Sé que Dios nos puso esta prueba de la distancia, pero considerando que eres tú, todo vale la pena. Cada conversación, cada desvelada, cada partida de COD, nuestras charlas sobre el futuro, las videollamadas y, por supuesto, nuestro pequeño Skipper. Para mí, todo lo que tenga que ver contigo es sagrado.</p>

          <p>Eres mi presente y el dueño de mi futuro. Hoy te escribo esto con lágrimas en los ojos, deseando que pronto estas palabras digitales se conviertan en una carta escrita a mano. Mientras tanto, dejaré que mis sentimientos crucen cualquier frontera para recordarte que aquí estoy, siempre presente para ti.</p>

          <p>Siento un orgullo inmenso por ti, no solo por lo que haces, sino por el hombre que eres y el esfuerzo que le pones a cada uno de tus días. Gracias por ser tan especial, por traer tanta felicidad a mi mundo, por entenderme y, sobre todo, por amarme así.</p>

          <p>Eres el hombre de mis sueños, hoy, mañana y siempre. Gracias por dejarme acompañarte en esta vida.</p>

          <p>Nos vemos en unos años, mi amor, para construir finalmente esa vida que tanto hemos soñado juntos.</p>

          <div className="letter-signature">
            <p>Con todo mi amor,</p>
            <p className="signature-name">Dalel 💗</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .letter-section {
          max-width: 900px;
          margin: 80px auto 40px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 900;
          color: white;
          text-align: center;
          margin-bottom: 50px;
          text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
          letter-spacing: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .title-icon {
          font-size: 56px;
        }

        .pixel-letter {
          background: white;
          border: 4px solid #2d2256;
          box-shadow: 12px 12px 0 0 rgba(0, 0, 0, 0.3);
          animation: letter-unfold 0.8s ease-out;
        }

        @keyframes letter-unfold {
          from {
            opacity: 0;
            transform: perspective(1000px) rotateX(-20deg);
          }
          to {
            opacity: 1;
            transform: perspective(1000px) rotateX(0);
          }
        }

        .letter-header {
          background-color: #ff6b9d;
          border-bottom: 4px solid #2d2256;
          padding: 20px 30px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stamp {
          font-size: 40px;
          background: white;
          border: 3px dashed #c44569;
          padding: 8px 12px;
          border-radius: 4px;
        }

        .to-label,
        .from-label {
          font-weight: 900;
          color: white;
          font-size: 16px;
          letter-spacing: 1px;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
        }

        .letter-body {
          padding: 50px 40px;
          background: repeating-linear-gradient(
            transparent,
            transparent 39px,
            rgba(255, 107, 157, 0.1) 39px,
            rgba(255, 107, 157, 0.1) 40px
          );
        }

        .letter-greeting {
          font-size: 32px;
          font-weight: 900;
          color: #ff6b9d;
          margin-bottom: 30px;
        }

        .letter-body p {
          font-size: 18px;
          line-height: 2;
          color: #2d2256;
          margin-bottom: 25px;
          font-family: 'Courier New', monospace;
          text-align: justify;
        }

        .letter-signature {
          margin-top: 50px;
          text-align: right;
        }

        .letter-signature p {
          margin-bottom: 10px;
          text-align: right;
        }

        .signature-name {
          font-size: 36px !important;
          font-weight: 900 !important;
          color: #ff6b9d !important;
          font-family: cursive !important;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 32px;
          }

          .letter-body {
            padding: 30px 25px;
          }

          .letter-greeting {
            font-size: 24px;
          }

          .letter-body p {
            font-size: 16px;
            line-height: 1.8;
          }

          .signature-name {
            font-size: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}

function BarcaSection() {
  const [currentPhrase, setCurrentPhrase] = useState(0);

  console.log('BarcaSection rendering, currentPhrase:', currentPhrase);

  const phrases = [
    "Que la distancia sea como un fuera de juego: algo que vamos a superar para terminar goleando juntos. Nos vemos pronto para seguir construyendo nuestro propio estadio.",
    "Si el amor es un partido, contigo acepto ir a la prórroga y hasta a los penaltis. Eres el único madridista que tiene permiso de entrar en mi corazón azulgrana."
  ];

  // Cambio automático de frases cada 5 segundos
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 8000); // Cambia cada 5 segundos

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, [phrases.length]);

  const nextPhrase = () => {
    setCurrentPhrase((prev) => (prev + 1) % phrases.length);
  };

  return (
    <div className="barca-section">
      <div className="section-title">
        NUESTRO PARTIDO
      </div>

      <div className="match-window">
        <div className="match-header">
          
          <img src="/Dalel.jpg" alt="FC Barcelona" className="team-badge barca profile-photo" />
          <div className="vs-text">VS</div>
           <img src="/Carlos.jpg" alt="FC Barcelona" className="team-badge madrid profile-photo" />
        </div>

        <div className="match-illustration">
          <div className="illustration-placeholder">
            <div className="field-lines"></div>
            <div className="ball">⚽</div>
            <div className="hearts-field">
              <span>💗</span>
              <span>💗</span>
              <span>💗</span>
            </div>
          </div>
        </div>

        <div className="couple-photo-section">
          <div className="couple-photo-container">
            <img 
              src="/pareja.png" 
              alt="Nosotros"
              className="couple-image"
            />
            <div className="photo-frame"></div>
          </div>
        </div>

        <div className="phrase-container">
          <div className="phrase-text">
            "{phrases[currentPhrase]}"
          </div>

          {/* Indicador de frase actual */}
          <div className="phrase-indicator">
            {phrases.map((_, index) => (
              <span 
                key={index} 
                className={`indicator-dot ${index === currentPhrase ? 'active' : ''}`}
                onClick={() => setCurrentPhrase(index)}
              />
            ))}
          </div>

        </div>

        <div className="score-display">
          <div className="score-item">
            <span className="score-label">AMOR</span>
            <span className="score-number">∞</span>
          </div>
          <div className="score-divider">-</div>
          <div className="score-item">
            <span className="score-label">DISTANCIA</span>
            <span className="score-number">0</span>
          </div>
        </div>
      </div>

      <style jsx>{`

        .profile-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid white;
          background: #f0f0f0;
        }

        .barca-section {
          max-width: 1000px;
          margin: 80px auto 40px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 900;
          color: white;
          text-align: center;
          margin-bottom: 50px;
          text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
          letter-spacing: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .title-icon {
          font-size: 56px;
        }

        .match-window {
          background: white;
          border: 4px solid #2d2256;
          box-shadow: 12px 12px 0 0 rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .match-header {
          background: linear-gradient(to right, #ff6b9d 0%, #ff6b9d 45%, #ffffff 45%, #ffffff 55%, #ffffff 55%, #ffffff 100%);
          border-bottom: 4px solid #2d2256;
          padding: 30px;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        .team-badge {
          font-size: 80px;
          animation: badge-float 2s ease-in-out infinite;
        }

        @keyframes badge-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .vs-text {
          font-size: 48px;
          font-weight: 900;
          color: #2d2256;
          letter-spacing: 4px;
          background: white;
          padding: 15px 30px;
          border: 4px solid #2d2256;
          box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);
        }

        .match-illustration {
          height: 400px;
          background: linear-gradient(135deg, #ffd1dc 0%, #ffb3d9 50%, #ff8fa3 100%);
          position: relative;
          overflow: hidden;
          border-bottom: 4px solid #2d2256;
        }

        .illustration-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .couple-photo-section {
          background: white;
          padding: 40px;
          border-bottom: 4px solid #2d2256;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .couple-photo-container {
          position: relative;
          animation: photo-float 3s ease-in-out infinite;
        }

        @keyframes photo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .couple-image {
          width: 280px;
          height: 280px;
          border-radius: 20px;
          border: 8px solid white;
          box-shadow: 
            0 0 0 6px #ff6b9d,
            0 0 0 10px white,
            12px 12px 0 10px rgba(0, 0, 0, 0.3);
          object-fit: contain;
          display: block;
        }

        .photo-frame {
          position: absolute;
          top: -12px;
          left: -12px;
          right: -12px;
          bottom: -12px;
          border: 4px dashed rgba(255, 107, 157, 0.4);
          border-radius: 24px;
          animation: rotate-frame 20s linear infinite;
        }

        @keyframes rotate-frame {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .field-lines {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 4px;
          background: white;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .field-lines::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 150px;
          height: 150px;
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .ball {
          font-size: 60px;
          animation: ball-roll 3s linear infinite;
          filter: drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.3));
          z-index: 10;
        }

        @keyframes ball-roll {
          0% {
            transform: translateX(-200px) rotate(0deg);
          }
          100% {
            transform: translateX(200px) rotate(360deg);
          }
        }

        .hearts-field {
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 30px;
          font-size: 40px;
        }

        .hearts-field span {
          animation: heart-bounce 1.5s ease-in-out infinite;
        }

        .hearts-field span:nth-child(1) { animation-delay: 0s; }
        .hearts-field span:nth-child(2) { animation-delay: 0.3s; }
        .hearts-field span:nth-child(3) { animation-delay: 0.6s; }

        @keyframes heart-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.2); }
        }

        .phrase-container {
          padding: 50px 40px;
          background: #f5f5f5;
          border-bottom: 4px solid #2d2256;
        }

        .phrase-text {
          font-size: 22px;
          line-height: 1.8;
          color: #2d2256;
          font-family: 'Courier New', monospace;
          font-weight: 600;
          text-align: center;
          font-style: italic;
          margin-bottom: 25px;
          padding: 30px;
          background: white;
          border: 3px solid #ff6b9d;
          border-radius: 8px;
          box-shadow: 4px 4px 0 0 rgba(255, 107, 157, 0.3);
          animation: phrase-fade-in 0.5s ease-out;
        }

        @keyframes phrase-fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Indicador de frase */
        .phrase-indicator {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .indicator-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #d1d1d1;
          border: 2px solid #c44569;
          cursor: pointer;
          transition: all 0.3s;
        }

        .indicator-dot:hover {
          background: #ff8fa3;
          transform: scale(1.2);
        }

        .indicator-dot.active {
          background: #ff6b9d;
          transform: scale(1.3);
          box-shadow: 0 0 10px rgba(255, 107, 157, 0.6);
        }

        .next-phrase-btn {
          background: #ff6b9d;
          border: 4px solid #c44569;
          box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.3);
          color: white;
          font-size: 18px;
          font-weight: 900;
          padding: 16px 40px;
          cursor: pointer;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          display: block;
          margin: 0 auto;
          transition: all 0.1s;
        }

        .next-phrase-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);
        }

        .next-phrase-btn:active {
          transform: translate(4px, 4px);
          box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.3);
        }

        .score-display {
          background: #2d2256;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }

        .score-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .score-label {
          font-size: 16px;
          color: #ff6b9d;
          font-weight: 900;
          letter-spacing: 3px;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
        }

        .score-number {
          font-size: 72px;
          font-weight: 900;
          color: white;
          font-family: 'Courier New', monospace;
          text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
        }

        .score-divider {
          font-size: 48px;
          color: #ff6b9d;
          font-weight: 900;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 32px;
          }

          .match-header {
            padding: 20px;
          }

          .team-badge {
            font-size: 60px;
          }

          .vs-text {
            font-size: 32px;
            padding: 10px 20px;
          }

          .match-illustration {
            height: 300px;
          }

          .couple-photo-section {
            padding: 30px 20px;
          }

          .couple-image {
            width: 200px;
            height: 200px;
            border: 6px solid white;
            box-shadow: 
              0 0 0 4px #ff6b9d,
              0 0 0 8px white,
              8px 8px 0 8px rgba(0, 0, 0, 0.3);
          }

          .couple-caption {
            font-size: 20px;
            letter-spacing: 2px;
          }

          .phrase-container {
            padding: 30px 20px;
          }

          .phrase-text {
            font-size: 18px;
            padding: 20px;
          }

          .next-phrase-btn {
            font-size: 14px;
            padding: 14px 30px;
          }

          .score-number {
            font-size: 56px;
          }
        }
      `}</style>
    </div>
  );
}


function WhoIsMoreSection() {
  return (
    <div className="whoismore-section">
      <div className="section-title">
        ¿QUIÉN ES MÁS PROBABLE?
      </div>

      <div className="whoismore-container">

        <div className="results-grid">
          <div className="result-card">
            <div className="question-text">¿Quién se pondría celoso más rápido?</div>
            <div className="answer-reveal">
              <div className="answer-badge carlos">Carlos</div>
            </div>
          </div>

          <div className="result-card">
            <div className="question-text">¿Quién lloraría durante una película?</div>
            <div className="answer-reveal">
              <div className="answer-badge dalel">Dalel</div>
            </div>
          </div>

          <div className="result-card">
            <div className="question-text">¿Quién haría lo que fuera por la otra persona?</div>
            <div className="answer-reveal">
              <div className="answer-badge both">Ambos</div>
            </div>
          </div>
        </div>

        <div className="final-message">
                          <img 
                  src="/snoopy.jpeg" 
                  alt="Snoopy"
                  className="snoopy"
                />

        </div>
      </div>

      <style jsx>{`
        .whoismore-section {
          max-width: 900px;
          margin: 80px auto 40px;
          padding: 20px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 900;
          color: white;
          text-align: center;
          margin-bottom: 50px;
          text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
          letter-spacing: 4px;
        }

        .whoismore-container {
          background: white;
          border: 4px solid #2d2256;
          box-shadow: 12px 12px 0 rgba(0, 0, 0, 0.3);
          padding: 40px;
        }

        .results-grid {
          display: flex;
          flex-direction: column;
          gap: 25px;
          margin-bottom: 40px;
        }

        .result-card {
          background: #f5f5f5;
          border: 4px solid #2d2256;
          border-radius: 8px;
          padding: 25px;
          animation: card-appear 0.5s ease-out backwards;
        }

        .result-card:nth-child(1) { animation-delay: 0.1s; }
        .result-card:nth-child(2) { animation-delay: 0.3s; }
        .result-card:nth-child(3) { animation-delay: 0.5s; }

        @keyframes card-appear {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .question-text {
          font-size: 22px;
          font-weight: 900;
          color: #2d2256;
          font-family: 'Courier New', monospace;
          margin-bottom: 15px;
          text-align: center;
        }

        .answer-reveal {
          display: flex;
          justify-content: center;
          margin-top: 15px;
        }

        .answer-badge {
          font-size: 24px;
          font-weight: 900;
          padding: 15px 30px;
          border-radius: 50px;
          font-family: 'Courier New', monospace;
          border: 4px solid;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
          animation: badge-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
        }

        .result-card:nth-child(1) .answer-badge { animation-delay: 0.3s; }
        .result-card:nth-child(2) .answer-badge { animation-delay: 0.5s; }
        .result-card:nth-child(3) .answer-badge { animation-delay: 0.7s; }

        @keyframes badge-pop {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .answer-badge.carlos {
          background: #ff6b9d;
          color: white;
          border-color: #c44569;
        }

        .answer-badge.dalel {
          background: #ff6b9d;
          color: white;
          border-color: #c44569;
        }

        .answer-badge.both {
          background: #ff6b9d;
          color: white;
          border-color: #c44569;
        }

        .final-message {
          background: #fff5f8;
          border: 4px solid #ff6b9d;
          border-radius: 8px;
          padding: 30px;
          margin-top: 30px;
        }

        .final-text {
          font-size: 18px;
          color: #2d2256;
          line-height: 1.8;
          margin-bottom: 20px;
          font-family: 'Courier New', monospace;
          text-align: center;
        }

        .snoopy {
            display: block;
            width: 500px;
            height: 500px;
            object-fit: cover;
            border-radius: 5%;
            border: 4px solid #ff6b9d;
            box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15);
            margin: 0 auto;
        }


        @media (max-width: 768px) {
          .section-title {
            font-size: 32px;
          }

          .whoismore-container {
            padding: 25px 20px;
          }

          .intro-text {
            font-size: 16px;
            padding: 15px;
          }

          .question-text {
            font-size: 18px;
          }

          .answer-badge {
            font-size: 20px;
            padding: 12px 24px;
          }

          .final-text {
            font-size: 16px;
          }

            .snoopy {
    width: 300px;
    height: 300px;
  }
        }
      `}</style>
    </div>
  );
}

function LoveReasonsSection({ pauseMusic, resumeMusic }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      if (pauseMusic) pauseMusic();
    };

    const handlePause = () => {
      if (resumeMusic) resumeMusic();
    };

    const handleEnded = () => {
      if (resumeMusic) resumeMusic();
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [pauseMusic, resumeMusic]);

  const loveReasons = [
    "Tu dedicación y ganas de salir adelante",
    "Lo paciente, amoroso y comprensivo que eres",
    "Tienes un enorme corazón",
    "Sabes lo que quieres y vas por ello, eres muy decisivo",
    "Tu seguridad, sabiduría e inteligencia",
    "Tu carisma y sentido del humor",
    "Tu habilidad de solucionar cualquier cosa",
    "Lo detallista que eres",
    "Tu honestidad y transparencia",
    "Tu cuerpo, tu rostro, tú, completamente"
  ];

  return (
    <div className="lovereasons-section">
      <div className="section-title">
        10 COSAS QUE AMO DE TI
      </div>

      <div className="reward-section">
        <div className="love-reasons-list">
          {loveReasons.map((reason, index) => (
            <div key={index} className="love-reason-item">
              <span className="reason-number">{index + 1}</span>
              <span className="reason-text">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Video al final */}
      <div className="video-section">
        <h3 className="video-title">💗 UN VIDEO ESPECIAL PARA TI 💗</h3>
        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="video-frame"
            controls
            controlsList="nodownload"
            preload="metadata"
            playsInline
          >
            <source src="/video.mp4" type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      </div>

      <style jsx>{`
        .lovereasons-section {
          max-width: 900px;
          margin: 80px auto 40px;
          padding: 20px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 900;
          color: white;
          text-align: center;
          margin-bottom: 50px;
          text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
          letter-spacing: 4px;
        }

        .reward-section {
          background: white;
          border: 4px solid #2d2256;
          box-shadow: 12px 12px 0 rgba(0, 0, 0, 0.3);
          padding: 40px;
          margin-bottom: 40px;
        }

        .love-reasons-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .love-reason-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          padding: 20px;
          background: #fff5f8;
          border: 3px solid #ff6b9d;
          border-radius: 8px;
          animation: reason-appear 0.5s ease-out backwards;
        }

        .love-reason-item:nth-child(1) { animation-delay: 0.1s; }
        .love-reason-item:nth-child(2) { animation-delay: 0.2s; }
        .love-reason-item:nth-child(3) { animation-delay: 0.3s; }
        .love-reason-item:nth-child(4) { animation-delay: 0.4s; }
        .love-reason-item:nth-child(5) { animation-delay: 0.5s; }
        .love-reason-item:nth-child(6) { animation-delay: 0.6s; }
        .love-reason-item:nth-child(7) { animation-delay: 0.7s; }
        .love-reason-item:nth-child(8) { animation-delay: 0.8s; }
        .love-reason-item:nth-child(9) { animation-delay: 0.9s; }
        .love-reason-item:nth-child(10) { animation-delay: 1s; }

        @keyframes reason-appear {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .reason-number {
          font-size: 28px;
          font-weight: 900;
          color: #ff6b9d;
          min-width: 40px;
          font-family: 'Courier New', monospace;
        }

        .reason-text {
          font-size: 18px;
          color: #2d2256;
          line-height: 1.6;
          font-weight: 600;
          font-family: 'Courier New', monospace;
        }

        .video-section {
          background: white;
          border: 4px solid #2d2256;
          box-shadow: 12px 12px 0 rgba(0, 0, 0, 0.3);
          padding: 40px;
        }

        .video-title {
          font-size: 32px;
          font-weight: 900;
          color: #ff6b9d;
          text-align: center;
          margin-top: 0px;
          margin-bottom: 30px;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
        }

        .video-frame {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 4px solid #2d2256;
          border-radius: 8px;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 32px;
          }

          .reward-section {
            padding: 25px 20px;
          }

          .reason-number {
            font-size: 22px;
            min-width: 35px;
          }

          .reason-text {
            font-size: 15px;
          }

          .video-title {
            font-size: 24px;
          }

          .video-section {
            padding: 25px 20px;
          }
        }
      `}</style>
    </div>
  );
}

function ChallengeModal({ surprise, onClose, onSuccess }) {
  const [answer, setAnswer] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const playClick = useClickSound();
  
  // Estados para la sopa de letras
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // Estados para ¿Quién es más probable?
  const [wmlCurrentQuestion, setWmlCurrentQuestion] = useState(0);
  const [wmlSelected, setWmlSelected] = useState(null);
  const [wmlShowResult, setWmlShowResult] = useState(false);
  const [wmlCorrect, setWmlCorrect] = useState(false);

  const handleWmlAnswer = (option) => {
    if (wmlShowResult) return;
    playClick();
    setWmlSelected(option);
    const isCorrect = option === surprise.challenge.questions[wmlCurrentQuestion].correctAnswer;
    setWmlCorrect(isCorrect);
    setWmlShowResult(true);

    if (isCorrect) {
      const nextQuestion = wmlCurrentQuestion + 1;
      if (nextQuestion >= surprise.challenge.questions.length) {
        // All questions answered correctly
        setTimeout(() => {
          setShowSuccess(true);
          setTimeout(() => onSuccess(), 1500);
        }, 1200);
      } else {
        setTimeout(() => {
          setWmlCurrentQuestion(nextQuestion);
          setWmlSelected(null);
          setWmlShowResult(false);
          setWmlCorrect(false);
        }, 1200);
      }
    } else {
      setTimeout(() => {
        setWmlSelected(null);
        setWmlShowResult(false);
        setWmlCorrect(false);
        setShowError(true);
        setTimeout(() => setShowError(false), 1000);
      }, 1200);
    }
  };

  const checkAnswer = () => {
    playClick(); // Reproducir sonido al verificar respuesta
    let isCorrect = false;

    if (surprise.challenge.type === 'question') {
      isCorrect = answer === surprise.challenge.correctAnswer;
    } else if (surprise.challenge.type === 'puzzle') {
      isCorrect = answer.toLowerCase().trim() === surprise.challenge.answer.toLowerCase();
    }

    if (isCorrect) {
      setShowSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setShowError(true);
      setAnswer('');
      setTimeout(() => setShowError(false), 1000);
    }
  };

  // Lógica para la sopa de letras
  const grid = [
    ['C', 'A', 'C', 'H', 'E', 'T', 'O', 'N', 'A', 'X', 'M', 'Z'],
    ['R', 'M', 'K', 'L', 'P', 'Q', 'W', 'E', 'R', 'T', 'A', 'Y'],
    ['A', 'M', 'O', 'R', 'N', 'M', 'X', 'S', 'D', 'F', 'M', 'U'],
    ['Z', 'Q', 'T', 'Y', 'U', 'I', 'O', 'P', 'L', 'K', 'I', 'I'],
    ['W', 'R', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'O'],
    ['M', 'I', 'V', 'I', 'D', 'A', 'Z', 'X', 'C', 'V', 'B', 'P'],
    ['N', 'M', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'A'],
    ['P', 'L', 'K', 'J', 'H', 'G', 'F', 'D', 'S', 'A', 'Q', 'S'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'L', 'K', 'J', 'H', 'D'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'F'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'G'],
    ['C', 'V', 'B', 'N', 'M', 'Q', 'W', 'E', 'R', 'T', 'Y', 'H']
  ];

  const wordPositions = {
    'CACHETONA': [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8]],
    'AMOR': [[2, 0], [2, 1], [2, 2], [2, 3]],
    'MIVIDA': [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]],
    'MAMI': [[0, 10], [1, 10], [2, 10], [3, 10]]
  };

  const handleMouseDown = (row, col) => {
    // Sistema de click individual - agregar o quitar celda
    const cellIndex = selectedCells.findIndex(([r, c]) => r === row && c === col);
    
    if (cellIndex !== -1) {
      // Si la celda ya está seleccionada, quitarla
      setSelectedCells(prev => prev.filter((_, i) => i !== cellIndex));
    } else {
      // Si no está seleccionada, agregarla
      const newSelectedCells = [...selectedCells, [row, col]];
      setSelectedCells(newSelectedCells);

      // Verificación automática al llegar al largo exacto de alguna palabra
      if (surprise.challenge.words) {
        let wordFound = false;
        surprise.challenge.words.forEach(word => {
          if (foundWords.includes(word)) return;
          const positions = wordPositions[word];
          if (!positions || positions.length !== newSelectedCells.length) return;

          const wordPositionsSet = new Set(positions.map(([r, c]) => `${r},${c}`));
          const areEqual = newSelectedCells.every(([r, c]) => wordPositionsSet.has(`${r},${c}`));

          if (areEqual) {
            const newFoundWords = [...foundWords, word];
            setFoundWords(newFoundWords);
            setSelectedCells([]);
            wordFound = true;

            if (newFoundWords.length === surprise.challenge.words.length) {
              setShowSuccess(true);
              setTimeout(() => onSuccess(), 1500);
            }
          }
        });
      }
    }
  };

  const handleMouseEnter = (row, col) => {
    // Ya no usamos esto para el sistema de click individual
    return;
  };

  const handleMouseUp = () => {
    // Ya no usamos esto para el sistema de click individual
    return;
  };

  const checkWordSearch = () => {
    if (selectedCells.length === 0) return;
    
    // Crear un conjunto de las posiciones seleccionadas para comparar fácilmente
    const selectedPositionsSet = new Set(
      selectedCells.map(([r, c]) => `${r},${c}`)
    );
    
    console.log('Posiciones seleccionadas:', selectedCells);
    console.log('Palabras a buscar:', surprise.challenge.words);
    
    let wordFound = false;
    
    if (surprise.challenge.words) {
      surprise.challenge.words.forEach(word => {
        const positions = wordPositions[word];
        
        if (!positions || foundWords.includes(word)) return;
        
        // Verificar si las posiciones seleccionadas coinciden exactamente con las de la palabra
        if (positions.length === selectedCells.length) {
          const wordPositionsSet = new Set(
            positions.map(([r, c]) => `${r},${c}`)
          );
          
          // Verificar si todos los elementos son iguales (sin importar orden)
          const areEqual = 
            selectedCells.length === positions.length &&
            selectedCells.every(([r, c]) => wordPositionsSet.has(`${r},${c}`));
          
          if (areEqual) {
            console.log('¡Palabra encontrada!:', word);
            const newFoundWords = [...foundWords, word];
            setFoundWords(newFoundWords);
            setSelectedCells([]); // Limpiar solo si encontró la palabra
            wordFound = true;
            
            if (newFoundWords.length === surprise.challenge.words.length) {
              setShowSuccess(true);
              setTimeout(() => {
                onSuccess();
              }, 1500);
            }
          }
        }
      });
      
      // Si no encontró la palabra, mostrar error
      if (!wordFound) {
        console.log('Palabra no encontrada');
        const selectedWord = selectedCells.map(([r, c]) => grid[r][c]).join('');
        console.log('Letras formadas:', selectedWord);
        setShowError(true);
        setTimeout(() => setShowError(false), 1000);
      }
    }
  };

  const isCellSelected = (row, col) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const isCellFound = (row, col) => {
    return foundWords.some(word => {
      return wordPositions[word]?.some(([r, c]) => r === row && c === col);
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="challenge-header">
          <div className="challenge-icon">{surprise.challenge.type === 'wordsearch' ? '🔍' : surprise.challenge.type === 'whosmorelikely' ? '🤔' : '🎯'}</div>
          <h2 className="challenge-title">{surprise.challenge.type === 'whosmorelikely' ? '¿QUIÉN ES MÁS PROBABLE?' : '¡DESAFÍO DE AMOR!'}</h2>
        </div>
        
        {surprise.challenge.type !== 'whosmorelikely' && (
          <p className="challenge-question">{surprise.challenge.question}</p>
        )}

        {surprise.challenge.type === 'whosmorelikely' ? (
          <div className="wml-challenge">
            <div className="wml-progress">
              {surprise.challenge.questions.map((_, i) => (
                <div key={i} className={`wml-dot ${i < wmlCurrentQuestion ? 'done' : i === wmlCurrentQuestion ? 'active' : ''}`} />
              ))}
            </div>
            <p className="challenge-question">{surprise.challenge.questions[wmlCurrentQuestion].question}</p>
            <div className="wml-options">
              {surprise.challenge.questions[wmlCurrentQuestion].options.map((option) => {
                let btnClass = 'wml-option-btn';
                if (wmlShowResult && wmlSelected === option) {
                  btnClass += wmlCorrect ? ' correct' : ' wrong';
                }
                return (
                  <button
                    key={option}
                    className={btnClass}
                    onClick={() => handleWmlAnswer(option)}
                    disabled={wmlShowResult}
                  >
                    {option === 'Carlos' ? 'Carlos' : option === 'Dalel' ? 'Dalel' : 'Ambos'}
                  </button>
                );
              })}
            </div>
          </div>
        ) : surprise.challenge.type === 'wordsearch' ? (
          <div className="wordsearch-challenge">
            <div className="words-to-find-modal">
              {surprise.challenge.words.map(word => (
                <div 
                  key={word} 
                  className={`word-item-modal ${foundWords.includes(word) ? 'found' : ''}`}
                >
                  {foundWords.includes(word) ? '✓ ' : '○ '}
                  {word === 'MIVIDA' ? 'MI VIDA' : word}
                </div>
              ))}
            </div>

            <div 
              className="grid-container-modal"
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="grid-row-modal">
                  {row.map((letter, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`grid-cell-modal ${isCellSelected(rowIndex, colIndex) ? 'selected' : ''} ${isCellFound(rowIndex, colIndex) ? 'found' : ''}`}
                      onClick={() => handleMouseDown(rowIndex, colIndex)}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button 
                className="submit-challenge-btn"
                onClick={() => {
                  playClick();
                  checkWordSearch();
                }}
                disabled={selectedCells.length === 0}
                style={{ flex: 1 }}
              >
                ✓ VERIFICAR PALABRA
              </button>
              <button 
                className="submit-challenge-btn"
                onClick={() => {
                  playClick();
                  setSelectedCells([]);
                }}
                disabled={selectedCells.length === 0}
                style={{ flex: 1, background: '#95a5a6', borderColor: '#7f8c8d' }}
              >
                ✕ LIMPIAR
              </button>
            </div>
          </div>
        ) : surprise.challenge.type === 'question' ? (
          <div className="options-container">
            {surprise.challenge.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${answer === option ? 'selected' : ''}`}
                onClick={() => {
                  playClick();
                  setAnswer(option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <input
            type="text"
            className={`challenge-input ${showError ? 'shake-error' : ''}`}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            placeholder="Escribe tu respuesta..."
          />
        )}

        {surprise.challenge.type !== 'wordsearch' && surprise.challenge.type !== 'whosmorelikely' && (
          <button 
            className="submit-challenge-btn"
            onClick={checkAnswer}
            disabled={!answer}
          >
            💗 VERIFICAR RESPUESTA 💗
          </button>
        )}

        {showError && (
          <div className="error-challenge-message">
            ❌ ¡Inténtalo de nuevo, mi amor!
          </div>
        )}

        {showSuccess && (
          <div className="success-challenge-message">
          ¡CORRECTO! ¡Desbloqueado!
          </div>
        )}

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
            animation: overlay-fade-in 0.3s ease-out;
            overflow-y: auto;
          }

          @keyframes overlay-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .modal-content {
            background: white;
            border: 6px solid #2d2256;
            box-shadow: 12px 12px 0 rgba(0, 0, 0, 0.4);
            padding: 40px;
            max-width: 500px;
            width: 100%;
            position: relative;
            animation: modal-pop-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            margin: auto;
          }

          @keyframes modal-pop-in {
            from {
              opacity: 0;
              transform: scale(0.8) translateY(-50px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .close-modal-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #ff6b9d;
            border: 3px solid #c44569;
            color: white;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            width: 40px;
            height: 40px;
          }

          .close-modal-btn:hover {
            transform: scale(1.1) rotate(90deg);
            background: #c44569;
          }

          .challenge-header {
            text-align: center;
            margin-bottom: 25px;
          }

          .challenge-icon {
            font-size: 70px;
            margin-bottom: 15px;
            animation: icon-bounce 1.5s ease-in-out infinite;
          }

          @keyframes icon-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }

          .challenge-title {
            font-size: 26px;
            font-weight: 900;
            color: #2d2256;
            letter-spacing: 2px;
            font-family: 'Courier New', monospace;
          }

          .challenge-question {
            font-size: 19px;
            color: #2d2256;
            text-align: center;
            margin-bottom: 30px;
            line-height: 1.6;
            font-weight: 700;
            font-family: 'Courier New', monospace;
          }

          .options-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 25px;
          }

          .option-btn {
            background: white;
            border: 4px solid #2d2256;
            padding: 15px 20px;
            font-size: 16px;
            font-weight: 700;
            color: #2d2256;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
            font-family: 'Courier New', monospace;
          }

          .option-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.2);
          }

          .option-btn.selected {
            background: #ff6b9d;
            border-color: #c44569;
            color: white;
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.2);
          }

          .challenge-input {
            width: 93%;
            font-size: 18px;
            padding: 15px;
            border: 4px solid #2d2256;
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
            font-family: 'Courier New', monospace;
            font-weight: 700;
            color: #2d2256;
            margin-bottom: 25px;
          }

          .challenge-input:focus {
            outline: none;
            border-color: #ff6b9d;
          }

          .challenge-input.shake-error {
            animation: shake-input 0.5s;
          }

          @keyframes shake-input {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }

          .wordsearch-challenge {
            margin-bottom: 20px;
          }

          .wml-challenge {
            margin-bottom: 20px;
          }

          .wml-progress {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
          }

          .wml-dot {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #e0e0e0;
            border: 3px solid #ccc;
            transition: all 0.3s;
          }

          .wml-dot.active {
            background: #ff6b9d;
            border-color: #c44569;
            transform: scale(1.2);
          }

          .wml-dot.done {
            background: #4CAF50;
            border-color: #2e7d32;
          }

          .wml-options {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .wml-option-btn {
            width: 100%;
            padding: 16px;
            font-size: 18px;
            font-weight: 900;
            font-family: 'Courier New', monospace;
            letter-spacing: 1px;
            cursor: pointer;
            border: 4px solid #2d2256;
            background: white;
            color: #2d2256;
            box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
            transition: all 0.15s;
          }

          .wml-option-btn:hover:not(:disabled) {
            background: #fff0f5;
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0 rgba(0,0,0,0.2);
          }

          .wml-option-btn:disabled {
            cursor: not-allowed;
          }

          .wml-option-btn.correct {
            background: #4CAF50;
            color: white;
            border-color: #2e7d32;
            animation: success-pulse 0.5s ease-out;
          }

          .wml-option-btn.wrong {
            background: #ff5252;
            color: white;
            border-color: #d32f2f;
            animation: shake-input 0.5s;
          }

          .words-to-find-modal {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }

          .word-item-modal {
            font-size: 14px;
            font-weight: 900;
            color: #2d2256;
            padding: 6px 14px;
            border: 3px solid #2d2256;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            transition: all 0.3s;
          }

          .word-item-modal.found {
            background: #4CAF50;
            color: white;
            border-color: #2e7d32;
          }

          .grid-container-modal {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            user-select: none;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: fit-content;
          }

          .grid-row-modal {
            display: flex;
          }

          .grid-cell-modal {
            width: 32px;
            height: 32px;
            border: 2px solid #2d2256;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            font-weight: 900;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            background: white;
            color: #2d2256;
            transition: all 0.2s;
          }

          .grid-cell-modal:hover {
            background: #ffe6f0;
          }

          .grid-cell-modal.selected {
            background: #ffb3d9;
            transform: scale(1.05);
          }

          .grid-cell-modal.found {
            background: #4CAF50;
            color: white;
            border-color: #2e7d32;
          }

          .submit-challenge-btn {
            width: 100%;
            background-color: #ff6b9d;
            border: 4px solid #c44569;
            box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
            color: white;
            font-size: 18px;
            font-weight: 900;
            padding: 16px;
            cursor: pointer;
            letter-spacing: 2px;
            transition: all 0.2s;
            font-family: 'Courier New', monospace;
          }

          .submit-challenge-btn:hover:not(:disabled) {
            transform: translate(-2px, -2px);
            box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.3);
          }

          .submit-challenge-btn:active:not(:disabled) {
            transform: translate(2px, 2px);
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
          }

          .submit-challenge-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }

          .error-challenge-message, .success-challenge-message {
            margin-top: 20px;
            padding: 15px;
            text-align: center;
            font-weight: 900;
            font-size: 15px;
            letter-spacing: 1px;
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
            font-family: 'Courier New', monospace;
          }

          .error-challenge-message {
            background: #ff5252;
            color: white;
            border: 3px solid #d32f2f;
            animation: shake-input 0.5s;
          }

          .success-challenge-message {
            background: #4CAF50;
            color: white;
            border: 3px solid #2e7d32;
            animation: success-pulse 0.6s;
          }

          @keyframes success-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          @media (max-width: 768px) {
            .modal-content {
              padding: 30px 20px;
            }

            .challenge-icon {
              font-size: 55px;
            }

            .challenge-title {
              font-size: 20px;
            }

            .challenge-question {
              font-size: 16px;
            }

            .submit-challenge-btn {
              font-size: 15px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const sbFetch = (path, options = {}) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options.headers || {})
    }
  });

function MoviesSection() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState('');
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await sbFetch('movies?select=*&order=id.asc');
        const data = await res.json();
        setMovies(data);
      } catch (e) {
        setError('No se pudo conectar a la base de datos');
      }
      setLoading(false);
    };
    load();
  }, []);

  const addMovie = async () => {
    const title = newMovie.trim();
    if (!title) return;
    try {
      const res = await sbFetch('movies', {
        method: 'POST',
        body: JSON.stringify({ title, rating: 0 })
      });
      const data = await res.json();
      setMovies(prev => [...prev, data[0]]);
      setNewMovie('');
    } catch (e) {
      setError('Error al agregar la película');
    }
  };

  const setRating = async (id, rating) => {
    const newRating = movies.find(m => m.id === id)?.rating === rating ? 0 : rating;
    setMovies(prev => prev.map(m => m.id === id ? { ...m, rating: newRating } : m));
    try {
      await sbFetch(`movies?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ rating: newRating })
      });
    } catch (e) {
      setError('Error al guardar el rating');
    }
  };

  const removeMovie = async (id) => {
    setMovies(prev => prev.filter(m => m.id !== id));
    try {
      await sbFetch(`movies?id=eq.${id}`, { method: 'DELETE' });
    } catch (e) {
      setError('Error al eliminar la película');
    }
  };

  return (
    <div className="movies-section">
      <div className="movies-card">
        <div className="movies-title">NUESTRA LISTA DE PELIS</div>
        <div className="movies-subtitle">¿Cuántas nos quedan por ver juntos? 💜</div>

        {error && (
          <div className="movies-error" onClick={() => setError(null)}>{error} ✕</div>
        )}

        <div className="movies-add-row">
          <input
            className="movies-input"
            type="text"
            placeholder="Agregar película..."
            value={newMovie}
            onChange={(e) => setNewMovie(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addMovie()}
            maxLength={60}
          />
          <button className="movies-add-btn" onClick={addMovie}>+ AGREGAR</button>
        </div>

        {loading ? (
          <div className="movies-loading">Cargando lista...</div>
        ) : movies.length === 0 ? (
          <div className="movies-empty">¡Agrega la primera peli!</div>
        ) : (
          <ul className="movies-list">
            {movies.map((movie) => (
              <li
                key={movie.id}
                className="movie-item"
                onMouseEnter={() => setHover(movie.id)}
                onMouseLeave={() => setHover(null)}
              >
                <span className="movie-title-text">{movie.title}</span>
                <div className="movie-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star-btn ${star <= movie.rating ? 'active' : ''}`}
                      onClick={() => setRating(movie.id, star === movie.rating ? 0 : star)}
                    >★</span>
                  ))}
                </div>
                {hover === movie.id && (
                  <button className="movie-remove-btn" onClick={() => removeMovie(movie.id)}>✕</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        .movies-section {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          padding-top: 80px;
        }

        .movies-card {
          background: rgba(255, 255, 255, 0.97);
          border: 4px solid #2d2256;
          box-shadow: 10px 10px 0 0 rgba(0,0,0,0.25);
          padding: 36px 32px;
          font-family: 'Courier New', monospace;
        }

        .movies-title {
          font-size: 26px;
          font-weight: 900;
          color: #2d2256;
          letter-spacing: 2px;
          margin-bottom: 6px;
        }

        .movies-subtitle {
          font-size: 14px;
          color: #7c3aed;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 28px;
        }

        .movies-add-row {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
        }

        .movies-input {
          flex: 1;
          font-family: 'Courier New', monospace;
          font-size: 15px;
          font-weight: 700;
          padding: 12px 16px;
          border: 3px solid #2d2256;
          color: #2d2256;
          outline: none;
          box-shadow: 4px 4px 0 0 rgba(0,0,0,0.15);
        }

        .movies-input:focus {
          border-color: #7c3aed;
          box-shadow: 4px 4px 0 0 rgba(124,58,237,0.2);
        }

        .movies-add-btn {
          background: #7c3aed;
          border: 3px solid #4c1d95;
          box-shadow: 4px 4px 0 0 rgba(0,0,0,0.2);
          color: white;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: 900;
          padding: 12px 18px;
          cursor: pointer;
          letter-spacing: 1px;
          white-space: nowrap;
          transition: all 0.1s;
        }

        .movies-add-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 0 rgba(0,0,0,0.2);
        }

        .movies-add-btn:active {
          transform: translate(4px, 4px);
          box-shadow: none;
        }

        .movies-empty {
          text-align: center;
          color: #9ca3af;
          font-size: 16px;
          font-weight: 700;
          padding: 30px 0;
          letter-spacing: 1px;
        }

        .movies-loading {
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
          padding: 20px 0;
        }

        .movies-error {
          background: #ff5252;
          border: 3px solid #d32f2f;
          color: white;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 14px;
          margin-bottom: 16px;
          cursor: pointer;
          letter-spacing: 0.5px;
        }

        .movies-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .movie-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 3px solid #e5e7eb;
          background: #faf5ff;
          transition: border-color 0.2s;
          position: relative;
        }

        .movie-item:hover {
          border-color: #7c3aed;
        }

        .movie-title-text {
          flex: 1;
          font-size: 15px;
          font-weight: 700;
          color: #2d2256;
          letter-spacing: 0.5px;
          word-break: break-word;
        }

        .movie-stars {
          display: flex;
          gap: 4px;
        }

        .star-btn {
          font-size: 22px;
          cursor: pointer;
          color: #d1d5db;
          transition: color 0.15s, transform 0.1s;
          line-height: 1;
          user-select: none;
        }

        .star-btn:hover {
          color: #f59e0b;
          transform: scale(1.2);
        }

        .star-btn.active {
          color: #f59e0b;
        }

        .movie-remove-btn {
          background: #ff5252;
          border: 2px solid #d32f2f;
          color: white;
          font-size: 13px;
          font-weight: 900;
          width: 26px;
          height: 26px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: 'Courier New', monospace;
          transition: all 0.1s;
        }

        .movie-remove-btn:hover {
          background: #d32f2f;
        }

        @media (max-width: 768px) {
          .movies-section {
            padding-top: 70px;
          }

          .movies-card {
            padding: 24px 16px;
          }

          .movies-title {
            font-size: 20px;
          }

          .movies-add-row {
            flex-direction: column;
          }

          .movies-add-btn {
            width: 100%;
          }

          .star-btn {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}

function SkipperCompanion() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="skipper-companion"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <img 
    src="/skipper.jpg" 
    alt="Skipper el Pingüino" 
    className="skipper-penguin"
  />

      {showTooltip && (
        <div className="skipper-tooltip">
          ¡Hola! Soy Skipper
        </div>
      )}

      <style jsx>{`
        .skipper-companion {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 10000;
          cursor: pointer;
        }

        .skipper-penguin {
          font-size: 70px;
          animation: skipper-waddle 3s ease-in-out infinite;
          filter: drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.3));
          transition: transform 0.3s;
          width: 110px;
          height: auto;
          border-radius: 50%;
        }

        .skipper-penguin:hover {
          transform: scale(1.2) rotate(10deg);
        }

        @keyframes skipper-waddle {
          0%, 100% {
            transform: translateY(0) rotate(-5deg);
          }
          25% {
            transform: translateY(-10px) rotate(5deg);
          }
          50% {
            transform: translateY(-20px) rotate(-5deg);
          }
          75% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        .skipper-tooltip {
          position: absolute;
          bottom: 90px;
          right: 0;
          background: white;
          border: 3px solid #2d2256;
          border-radius: 8px;
          padding: 12px 18px;
          color: #2d2256;
          font-size: 16px;
          font-weight: 900;
          white-space: nowrap;
          box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);
          animation: tooltip-appear 0.3s ease-out;
          font-family: 'Courier New', monospace;
        }

        .skipper-tooltip::after {
          content: '';
          position: absolute;
          bottom: -12px;
          right: 20px;
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 12px solid #2d2256;
        }

        .skipper-tooltip::before {
          content: '';
          position: absolute;
          bottom: -8px;
          right: 22px;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid white;
          z-index: 1;
        }

        @keyframes tooltip-appear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .skipper-companion {
            bottom: 20px;
            right: 20px;
          }

          .skipper-penguin {
            font-size: 50px;
          }

          .skipper-tooltip {
            font-size: 14px;
            bottom: 70px;
          }
        }
      `}</style>
    </div>
  );
}