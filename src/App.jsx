import { useState, useEffect, useRef } from 'react';
import { useBinauralBeat } from './hooks/useBinauralBeat';
import { useWakeLock } from './hooks/useWakeLock';
import { categories } from './data/frequencies';
import { sleepSequence } from './data/sleepSequence';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CategoryList } from './components/CategoryList';
import { CustomGenerator } from './components/CustomGenerator';
import { PlayerControls } from './components/PlayerControls';
import { Disclaimer } from './components/Disclaimer';
import { ArrowLeft } from 'lucide-react';
import './App.css';

function App() {
  const { play, stop, isPlaying, volume, setVolume } = useBinauralBeat();
  useWakeLock(isPlaying);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [sequenceStep, setSequenceStep] = useState(0);
  const sequenceTimerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'about', 'custom', 'presets', 'disclaimer'

  // Sleep Sequence Logic
  useEffect(() => {
    if (currentTrack?.id === 'sleep-program-90' && isPlaying) {
      const runSequence = (stepIndex) => {
        const step = sleepSequence[stepIndex];
        if (!step) {
          setSequenceStep(0);
          runSequence(0);
          return;
        }

        setSequenceStep(stepIndex);
        play(step.left, step.right);

        sequenceTimerRef.current = setTimeout(() => {
          runSequence(stepIndex + 1);
        }, step.duration * 1000);
      };

      if (!sequenceTimerRef.current) {
        runSequence(0);
      }

      return () => {
        if (sequenceTimerRef.current) {
          clearTimeout(sequenceTimerRef.current);
          sequenceTimerRef.current = null;
        }
      };
    } else {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
        sequenceTimerRef.current = null;
      }
      setSequenceStep(0);
    }
  }, [currentTrack, isPlaying, play]);

  const handleSelectFrequency = (item) => {
    if (currentTrack?.id === item.id && isPlaying) {
      stop();
      setCurrentTrack(null);
    } else {
      if (item.id === 'sleep-program-90') {
        setCurrentTrack(item);
        play(0, 0);
      } else {
        play(item.left, item.right, item.bothEars || 0);
        setCurrentTrack(item);
      }
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stop();
    } else if (currentTrack) {
      if (currentTrack.id === 'sleep-program-90') {
        play(0, 0);
      } else {
        play(currentTrack.left, currentTrack.right, currentTrack.bothEars || 0);
      }
    }
  };

  const displayTrack = currentTrack?.id === 'sleep-program-90'
    ? { ...currentTrack, title: `${currentTrack.title} - ${sleepSequence[sequenceStep]?.title || 'Starting...'}` }
    : currentTrack;

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  // Render different pages
  if (currentPage === 'home') {
    return (
      <>
        <div className="animated-bg" />
        <HomePage onNavigate={handleNavigate} />
      </>
    );
  }

  if (currentPage === 'about') {
    return (
      <>
        <div className="animated-bg" />
        <AboutPage onBack={handleBack} />
      </>
    );
  }

  if (currentPage === 'disclaimer') {
    return (
      <>
        <div className="animated-bg" />
        <div className="page-container">
          <button className="back-button-top" onClick={handleBack}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <Disclaimer />
        </div>
      </>
    );
  }

  // Custom Generator and Presets pages
  return (
    <>
      <div className="animated-bg" />

      <div className="app-container">
        <button className="back-button-top" onClick={handleBack}>
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <header className="app-header">
          <img src="/omnisync-logo.png" alt="OMNISYNC" className="app-logo" />
          <p className="app-subtitle">Please put on headphones and enjoy 🎧</p>
        </header>

        <main className="app-main">
          {currentPage === 'custom' && (
            <CustomGenerator
              onGenerate={handleSelectFrequency}
              isActive={currentTrack?.id === 'custom-combined' && isPlaying}
            />
          )}

          {currentPage === 'presets' && (
            <CategoryList
              categories={categories}
              onSelectFrequency={handleSelectFrequency}
              activeId={currentTrack?.id}
            />
          )}
        </main>

        <footer className="page-footer-inline">
          © NeoTheory Music LLC & Mixie 2025
        </footer>

        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </div>
    </>
  );
}

export default App;
