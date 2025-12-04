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
import { ColorNoisesPage } from './pages/ColorNoisesPage';
import { SoundscapesPage } from './pages/SoundscapesPage';
import { EnergyProfilesPage } from './pages/EnergyProfilesPage';
import { EnergyCleanseMode } from './pages/EnergyCleanseMode';
import { JourneysPage } from './pages/JourneysPage';
import { JourneyPlayer } from './components/JourneyPlayer';
import { Visualizer } from './components/Visualizer';
import { CosmicAlignmentPage } from './pages/CosmicAlignmentPage';
import { InnerSyncPage } from './pages/InnerSyncPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { SettingsPage } from './pages/SettingsPage';
import './App.css';

function App() {
  const { play, stop, isPlaying, volume, setVolume } = useBinauralBeat();
  useWakeLock(isPlaying);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [sequenceStep, setSequenceStep] = useState(0);
  const sequenceTimerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'about', 'custom', 'presets', 'disclaimer', 'journeys', 'journey-player'
  const [selectedJourney, setSelectedJourney] = useState(null);

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
        play(
          item.left || 0,
          item.right || 0,
          item.bothEars || 0,
          item.noiseType || null,
          item.type || null, // Soundscape type
          item.volumes || {},
          item.layers || []
        );
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
        play(
          currentTrack.left || 0,
          currentTrack.right || 0,
          currentTrack.bothEars || 0,
          currentTrack.noiseType || null,
          currentTrack.type || null,
          currentTrack.volumes || {},
          currentTrack.layers || []
        );
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
    setSelectedJourney(null);
  };

  const handleSelectJourney = (journey) => {
    setSelectedJourney(journey);
    setCurrentPage('journey-player');
  };

  // Render different pages
  if (currentPage === 'home') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <HomePage onNavigate={handleNavigate} />
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'about') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <AboutPage onBack={handleBack} />
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'disclaimer') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <div className="page-container">
          <button className="back-button-top" onClick={handleBack}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <Disclaimer />
        </div>
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'soundscapes') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <SoundscapesPage
          onBack={handleBack}
          onPlay={handleSelectFrequency}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
        />
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'energy-profiles') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <EnergyProfilesPage
          onBack={handleBack}
          onPlay={handleSelectFrequency}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
        />
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'energy-cleanse') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <EnergyCleanseMode onBack={handleBack} />
      </>
    );
  }

  if (currentPage === 'journeys') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <JourneysPage
          onBack={handleBack}
          onSelectJourney={handleSelectJourney}
        />
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'journey-player' && selectedJourney) {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <JourneyPlayer
          journey={selectedJourney}
          onBack={() => setCurrentPage('journeys')}
        />
      </>
    );
  }

  if (currentPage === 'cosmic-alignment') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <CosmicAlignmentPage
          onBack={handleBack}
          onPlay={handleSelectFrequency}
          currentTrack={displayTrack}
          isPlaying={isPlaying}
        />
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'colors') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <ColorNoisesPage
          onBack={handleBack}
          onPlay={handleSelectFrequency}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
        />
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'innersync') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <InnerSyncPage
          onBack={handleBack}
          onPlay={handleSelectFrequency}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
        />
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'connections') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <ConnectionsPage onBack={handleBack} />
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'settings') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <SettingsPage onBack={handleBack} />
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  // Custom Generator and Presets pages
  return (
    <>
      <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />

      <div className="app-container">
        <button className="back-button-top" onClick={handleBack}>
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <header className="app-header">
          <img src="/omnisync-logo.png" alt="OMNISYNC" className="app-logo" />
          <p className="app-subtitle">Please put on headphones and enjoy 🎧</p>
        </header>

        <div className="best-results-banner-inline">
          ✨ For best results: lower volume, silent mode OFF, wear headphones 🎧
        </div>

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
          <div>OMNISYNC™</div>
          <div>© NeoTheory Music 2025</div>
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
