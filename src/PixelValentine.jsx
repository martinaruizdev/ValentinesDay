import React, { useState } from 'react';
import { Heart, Music, Map, Mail, Trophy, Volume2, X } from 'lucide-react';

export default function PixelValentine() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [currentSection, setCurrentSection] = useState('home');
  const [showError, setShowError] = useState(false);
/*   const [stars, setStars] = useState([]);
  const [heartParticles, setHeartParticles] = useState([]); */
/* 
  useEffect(() => {
    const generatedHearts = [...Array(8)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 4 + Math.random() * 2,
      delay: i * 0.8
    }));
    setHeartParticles(generatedHearts);
  }, []); 

  // Create twinkling stars
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3
    }));
    setStars(newStars);
  }, []); */
// 1. Corregido: Solo guardamos los datos, no necesitamos la función set
const [heartParticles] = useState(() => {
  return [...Array(8)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: 4 + Math.random() * 2,
    delay: i * 0.8
  }));
});

// 2. Corregido: Solo guardamos los datos de las estrellas
const [stars] = useState(() => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3
  }));
});

// --- ELIMINA LOS useEffect QUE TENÍAS PARA ESTOS DOS ---
// (No los necesitas más)

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
        <div className="sky-gradient"></div>
        <div className="clouds"></div>
        <div className="mountains"></div>
        <div className="trees"></div>
        <div className="grass"></div>

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

        {/* Floating pixel hearts - Versión corregida */}
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
        <GameWorld
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
        />
      )}

      <style jsx>{`
        .pixel-container {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          image-rendering: pixelated;
          font-family: 'Courier New', monospace;
        }

        .pixel-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .sky-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            #1a1832 0%,
            #2d2256 20%,
            #4a3b6e 35%,
            #6b5b95 45%,
            #ff6b9d 60%,
            #ff8fa3 70%,
            #ffa07a 80%,
            #ffb88c 90%,
            #87ceeb 100%
          );
        }

        .clouds {
          position: absolute;
          top: 8%;
          left: 0;
          width: 100%;
          height: 25%;
          background-image: 
            radial-gradient(ellipse 200px 60px at 20% 30%, #ff8fa3 0%, transparent 50%),
            radial-gradient(ellipse 300px 80px at 50% 25%, #ffb88c 0%, transparent 50%),
            radial-gradient(ellipse 250px 70px at 75% 35%, #ffa07a 0%, transparent 50%),
            radial-gradient(ellipse 180px 50px at 85% 28%, #ff9b86 0%, transparent 50%);
          filter: blur(2px);
          opacity: 0.9;
        }

        .mountains {
          position: absolute;
          bottom: 35%;
          left: 0;
          width: 100%;
          height: 30%;
          background-image:
            linear-gradient(to top, transparent 0%, #2d2256 30%),
            polygon(0% 100%, 15% 40%, 25% 60%, 35% 30%, 50% 50%, 65% 25%, 75% 45%, 85% 35%, 100% 55%, 100% 100%);
          clip-path: polygon(
            0% 100%, 
            8% 75%, 15% 65%, 22% 70%, 30% 55%, 
            38% 60%, 45% 45%, 52% 50%, 60% 40%, 
            68% 55%, 75% 50%, 82% 60%, 90% 55%, 
            100% 65%, 100% 100%
          );
          background-color: #2d2256;
        }

        .trees {
          position: absolute;
          bottom: 20%;
          left: 0;
          width: 100%;
          height: 25%;
          background-image: repeating-linear-gradient(
            90deg,
            #1a4d2e 0px,
            #1a4d2e 8px,
            transparent 8px,
            transparent 15px,
            #1a4d2e 15px,
            #1a4d2e 22px,
            transparent 22px,
            transparent 35px,
            #1a4d2e 35px,
            #1a4d2e 40px,
            transparent 40px,
            transparent 50px
          );
          opacity: 0.8;
        }

        .grass {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 20%;
          background: linear-gradient(to bottom, #4a7c59 0%, #2d5016 100%);
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
      `}</style>
    </div>
  );
}

function PasscodeScreen({ passcode, setPasscode, checkPasscode, showError }) {
  return (
    <div className="passcode-overlay">
      <div className="pixel-window">
        <div className="pixel-title">
          FOR MY VALENTINE,<br />ALWAYS 💗
        </div>
        <div className="pixel-subtitle">
          OPEN GENTLY. IT'S MEANT FOR YOU.
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

        <button className="pixel-button" onClick={checkPasscode}>
          <Heart className="button-heart" size={20} fill="#fff" />
          PLAY TOGETHER
          <Heart className="button-heart" size={20} fill="#fff" />
        </button>

        {showError && (
          <div className="pixel-error">
            ❌ TRY AGAIN, MY LOVE
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
          font-size: 48px;
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
          font-size: 18px;
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

function GameWorld({ currentSection, setCurrentSection }) {
  const [hasSeenMessage, setHasSeenMessage] = useState(false);

  if (currentSection === 'home') {
    return (
      <HomeMenu
        setCurrentSection={setCurrentSection}
        hasSeenMessage={hasSeenMessage}
        setHasSeenMessage={setHasSeenMessage}
      />
    );
  }

  return (
    <>
      <div className="game-section">
        <button className="pixel-back-btn" onClick={() => setCurrentSection('home')}>
          <span className="arrow">←</span> VOLVER
        </button>

        {currentSection === 'music' && <MusicSection />}
        {currentSection === 'map' && <MapSection />}
        {currentSection === 'letter' && <LetterSection />}
        {currentSection === 'photos' && <PhotosSection />}
        {currentSection === 'barca' && <BarcaSection />}

        <style jsx>{`
          .game-section {
            position: relative;
            z-index: 10;
            min-height: 100vh;
            padding: 40px 20px;
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

      {/* Skipper aparecerá en todas las secciones excepto el menú principal */}
      <SkipperCompanion />
    </>
  );
}

function HomeMenu({ setCurrentSection, hasSeenMessage, setHasSeenMessage }) {
  const [showBrowser, setShowBrowser] = useState(!hasSeenMessage);
  const [browserClosing, setBrowserClosing] = useState(false);

  const menuItems = [
    { id: 'music', label: 'SONGS FOR YOU', icon: '🎵', color: '#ff6b9d' },
    { id: 'map', label: 'OUR DISTANCE', icon: '🗺️', color: '#ffd700' },
    { id: 'letter', label: 'LOVE LETTER', icon: '💌', color: '#ff8fa3' },
    { id: 'photos', label: 'OUR MEMORIES', icon: '📸', color: '#87ceeb' },
    { id: 'barca', label: 'BARÇA VS MADRID', icon: '⚽', color: '#a50044' }
  ];

  const closeBrowser = () => {
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
            <div className="browser-title">Message.txt</div>
          </div>

          <div className="browser-content">
            <div className="welcome-message">
              <p>This is for you.</p>
              <p>For the person I choose</p>
              <p>in every version of the day.</p>
              <p>Near or far,</p>
              <p>you are where my heart goes first.</p>
            </div>

            <button className="close-message-btn" onClick={closeBrowser}>
              Continue ➜
            </button>
          </div>
        </div>
      )}

      {/* Desktop with Folders */}
      {!showBrowser && (
        <div className="desktop-screen">
          <div className="desktop-title">Surprise Files</div>
          <div className="desktop-subtitle">Love unfolds one click at a time 💕</div>

          <div className="folders-grid">
            {menuItems.map((item, index) => (
              <div
                key={item.id}
                className="pixel-folder"
                onClick={() => setCurrentSection(item.id)}
                style={{
                  '--folder-color': item.color,
                  animationDelay: `${index * 0.15}s`
                }}
              >
                <div className="folder-icon">📁</div>
                <div className="folder-emoji">{item.icon}</div>
                <div className="folder-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .home-menu {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
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
          font-size: 20px;
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
          background: rgba(255, 255, 255, 0.1);
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
    { title: 'Mil Vidas', artist: 'Mora', color: '#ff6b9d' },
    { title: 'Mi Vida Entera', artist: 'Morat', color: '#ffd700' },
    { title: 'Valió La Pena', artist: 'Marc Anthony', color: '#ff8fa3' },
    { title: 'If I Could Fly', artist: 'One Direction', color: '#87ceeb' }
  ];

  return (
    <div className="music-section">
      <div className="section-title">
        <span className="title-icon">🎵</span>
        OUR PLAYLIST
      </div>

      <div className="songs-container">
        {songs.map((song, index) => (
          <div
            key={index}
            className="pixel-song-card"
            style={{
              '--song-color': song.color,
              animationDelay: `${index * 0.15}s`
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
          </div>
        ))}
      </div>

      <a
        href="https://open.spotify.com/playlist/2vhRKNyj9TSQ5RVu98m41Z?si=35af8e9582b54279&pt=dd748dc3ada1dba32a4b12b277aadc59"
        target="_blank"
        rel="noopener noreferrer"
        className="spotify-button"
      >
        <span className="spotify-icon">🎧</span>
        ESCUCHAR EN SPOTIFY
        <span className="spotify-icon">💚</span>
      </a>

      <div className="music-note">
        These still make me smile 💕
      </div>

      <style jsx>{`
        .music-section {
          max-width: 800px;
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

        .songs-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
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
          background: #1DB954;
          border: 4px solid #1aa34a;
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
        <span className="title-icon">🗺️</span>
        2,490 KM APART
      </div>

      <div className="map-window">
        <div className="map-header">Distance Calculator</div>
        <div className="map-content">
          <div className="location-marker venezuela">
            <div className="marker-pin">📍</div>
            <div className="marker-label">
              <div className="flag">🇻🇪</div>
              <div className="city">Valencia</div>
            </div>
          </div>

          <div className="connection">
            <div className="distance-display">2,490 KM</div>
            <div className="dotted-line"></div>
          </div>

          <div className="location-marker florida">
            <div className="marker-pin">📍</div>
            <div className="marker-label">
              <div className="flag">🇺🇸</div>
              <div className="city">Clearwater</div>
            </div>
          </div>

          <div className="heart-center">
            <Heart size={60} fill="#ff6b9d" color="#ff6b9d" />
            <div className="heart-text">SOON TOGETHER</div>
          </div>
        </div>
      </div>

      <div className="map-message">
        But our love knows no borders 💕
      </div>

      <style jsx>{`
        .map-section {
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

        .map-window {
          background: white;
          border: 4px solid #2d2256;
          box-shadow: 12px 12px 0 0 rgba(0, 0, 0, 0.3);
        }

        .map-header {
          background: linear-gradient(to bottom, #87ceeb, #5fa3d0);
          border-bottom: 4px solid #2d2256;
          padding: 15px;
          font-weight: 900;
          font-size: 18px;
          color: white;
          text-align: center;
          letter-spacing: 2px;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
        }

        .map-content {
          height: 500px;
          background: linear-gradient(to bottom, #87ceeb 0%, #5fa3d0 50%, #4a7c59 70%, #2d5016 100%);
          position: relative;
          overflow: hidden;
        }

        .location-marker {
          position: absolute;
          text-align: center;
          animation: marker-bounce 2s ease-in-out infinite;
        }

        .location-marker.venezuela {
          bottom: 40%;
          left: 20%;
        }

        .location-marker.florida {
          top: 25%;
          right: 20%;
        }

        @keyframes marker-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .marker-pin {
          font-size: 60px;
          filter: drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.3));
          margin-bottom: 10px;
        }

        .marker-label {
          background: white;
          border: 3px solid #2d2256;
          padding: 10px 20px;
          box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .flag {
          font-size: 24px;
        }

        .city {
          font-weight: 900;
          color: #2d2256;
          font-size: 16px;
          letter-spacing: 1px;
        }

        .connection {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60%;
          text-align: center;
        }

        .distance-display {
          background: #ff6b9d;
          border: 4px solid #c44569;
          color: white;
          font-size: 32px;
          font-weight: 900;
          padding: 15px 30px;
          box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.3);
          display: inline-block;
          margin-bottom: 20px;
          letter-spacing: 3px;
        }

        .dotted-line {
          height: 4px;
          background-image: repeating-linear-gradient(
            90deg,
            #2d2256 0px,
            #2d2256 15px,
            transparent 15px,
            transparent 30px
          );
        }

        .heart-center {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }

        .heart-center svg {
          filter: drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.3));
          animation: heart-pulse 1.5s ease-in-out infinite;
        }

        @keyframes heart-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .heart-text {
          margin-top: 15px;
          color: white;
          font-weight: 900;
          font-size: 18px;
          letter-spacing: 3px;
          text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
        }

        .map-message {
          margin-top: 30px;
          text-align: center;
          font-size: 24px;
          color: white;
          font-family: 'Courier New', monospace;
          background: rgba(255, 107, 157, 0.3);
          border: 3px solid white;
          padding: 25px;
          box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 28px;
          }

          .map-content {
            height: 400px;
          }

          .marker-pin {
            font-size: 40px;
          }

          .distance-display {
            font-size: 24px;
            padding: 12px 20px;
          }

          .heart-center svg {
            width: 40px;
            height: 40px;
          }

          .heart-text {
            font-size: 14px;
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
        <span className="title-icon">💌</span>
        FOR YOU, CARLOS
      </div>

      <div className="pixel-letter">
        <div className="letter-header">
          <div className="stamp">💕</div>
          <div className="to-label">To: Carlos</div>
          <div className="from-label">From: Dalel</div>
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
            <p className="signature-name">Dalel ❤️</p>
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
          background: linear-gradient(to bottom, #ff8fa3, #ff6b9d);
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

function PhotosSection() {
  return (
    <div className="photos-section">
      <div className="section-title">
        <span className="title-icon">📸</span>
        OUR PHOTO MEMORY
      </div>

      <div className="photo-frame-window">
        <div className="window-bar">
          <div className="cursor-icon">👆</div>
          Our Memories
        </div>

        <div className="photos-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="photo-slot">
              <div className="photo-border">
                <div className="photo-placeholder">
                  <Heart size={40} fill="#ff6b9d" color="#ff6b9d" />
                  <div className="photo-text">Memory #{i + 1}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="photo-caption">
          These still make me smile 💕
        </div>
      </div>

      <style jsx>{`
        .photos-section {
          max-width: 1100px;
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

        .photo-frame-window {
          background: white;
          border: 4px solid #2d2256;
          box-shadow: 12px 12px 0 0 rgba(0, 0, 0, 0.3);
        }

        .window-bar {
          background: linear-gradient(to bottom, #ffd700, #ffb700);
          border-bottom: 4px solid #2d2256;
          padding: 15px;
          font-weight: 900;
          font-size: 18px;
          color: #2d2256;
          text-align: center;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .cursor-icon {
          font-size: 24px;
          animation: point 1s ease-in-out infinite;
        }

        @keyframes point {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .photos-grid {
          padding: 40px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
          background: #e8b4d9;
        }

        .photo-slot {
          animation: photo-appear 0.6s ease-out backwards;
        }

        .photo-slot:nth-child(1) { animation-delay: 0.1s; }
        .photo-slot:nth-child(2) { animation-delay: 0.2s; }
        .photo-slot:nth-child(3) { animation-delay: 0.3s; }
        .photo-slot:nth-child(4) { animation-delay: 0.4s; }
        .photo-slot:nth-child(5) { animation-delay: 0.5s; }
        .photo-slot:nth-child(6) { animation-delay: 0.6s; }
        .photo-slot:nth-child(7) { animation-delay: 0.7s; }
        .photo-slot:nth-child(8) { animation-delay: 0.8s; }

        @keyframes photo-appear {
          from {
            opacity: 0;
            transform: scale(0.8) rotate(-5deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        .photo-border {
          background: white;
          border: 4px solid #2d2256;
          padding: 12px;
          box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);
          transition: all 0.2s;
        }

        .photo-border:hover {
          transform: rotate(3deg) scale(1.05);
          box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.3);
        }

        .photo-placeholder {
          aspect-ratio: 1;
          background: linear-gradient(135deg, #ff8fa3, #ffc1cc);
          border: 2px solid #2d2256;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .photo-text {
          font-size: 14px;
          font-weight: 900;
          color: #2d2256;
          letter-spacing: 1px;
        }

        .photo-caption {
          background: #ff6b9d;
          border-top: 4px solid #2d2256;
          padding: 20px;
          text-align: center;
          font-size: 20px;
          font-weight: 900;
          color: white;
          letter-spacing: 2px;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 32px;
          }

          .photos-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 20px;
            gap: 15px;
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

  const nextPhrase = () => {
    setCurrentPhrase((prev) => (prev + 1) % phrases.length);
  };

  return (
    <div className="barca-section">
      <div className="section-title">
        <span className="title-icon">⚽</span>
        NUESTRO PARTIDO
      </div>

      <div className="match-window">
        <div className="match-header">
          <div className="team-badge barca">💙</div>
          <div className="vs-text">VS</div>
          <div className="team-badge madrid">⚪</div>
        </div>

        <div className="match-illustration">
          <div className="illustration-placeholder">
            <div className="field-lines"></div>
            <div className="ball">⚽</div>
            <div className="hearts-field">
              <span>💙</span>
              <span>❤️</span>
              <span>💙</span>
            </div>
          </div>
        </div>

        <div className="phrase-container">
          <div className="phrase-text">
            "{phrases[currentPhrase]}"
          </div>

          <button className="next-phrase-btn" onClick={nextPhrase}>
            {currentPhrase === 0 ? 'SIGUIENTE FRASE ➜' : '← FRASE ANTERIOR'}
          </button>
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
          background: linear-gradient(to right, #004d98 0%, #004d98 45%, #ffffff 45%, #ffffff 55%, #ffffff 55%, #ffffff 100%);
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

        .team-badge.barca {
          filter: drop-shadow(4px 4px 0 rgba(0, 77, 152, 0.5));
        }

        .team-badge.madrid {
          filter: drop-shadow(4px 4px 0 rgba(255, 255, 255, 0.5));
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
          background: linear-gradient(to bottom, #87ceeb 0%, #4a7c59 70%, #2d5016 100%);
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
          margin-bottom: 35px;
          padding: 30px;
          background: white;
          border: 3px solid #ff6b9d;
          border-radius: 8px;
          box-shadow: 4px 4px 0 0 rgba(255, 107, 157, 0.3);
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
          color: #ffd700;
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

function SkipperCompanion() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="skipper-companion"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="skipper-penguin">🐧</div>

      {showTooltip && (
        <div className="skipper-tooltip">
          ¡Hola! Soy Skipper 💙
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
