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
import { UserProfilePage } from './pages/UserProfilePage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { PlaylistSelectorModal } from './components/PlaylistSelectorModal';
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt';
import { TinnitusTherapy } from './components/TinnitusTherapy';
import { ContactForm } from './components/ContactForm';
import './App.css';
import './polish.css';

function App() {
  const { play, stop, isPlaying, volume, setVolume, updateLayers, updateNoise, updateSoundscape } = useBinauralBeat();
  useWakeLock(isPlaying);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [sequenceStep, setSequenceStep] = useState(0);
  const sequenceTimerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'about', 'custom', 'presets', 'disclaimer', 'journeys', 'journey-player'
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [sleepTimer, setSleepTimer] = useState(null);
  const sleepTimerRef = useRef(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);
  const [showTinnitusTherapy, setShowTinnitusTherapy] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // Playlist playback state
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playlistQueue, setPlaylistQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlistMode, setPlaylistMode] = useState('normal'); // 'normal', 'shuffle', 'repeat-one', 'repeat-all'

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('omnisync_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  // Sleep Timer Logic
  useEffect(() => {
    if (sleepTimer && isPlaying) {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);

      sleepTimerRef.current = setTimeout(() => {
        stop();
        setSleepTimer(null);
      }, sleepTimer * 60 * 1000);
    } else if (!isPlaying && sleepTimer) {
      // Optional: Cancel timer if paused manually? 
      // For now, let's keep it simple: if paused, timer is cancelled.
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      setSleepTimer(null);
    }

    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, [sleepTimer, isPlaying, stop]);

  // Toggle favorite function
  const toggleFavorite = (preset) => {
    const isFavorited = favorites.some(f => f.id === preset.id);
    let updatedFavorites;

    if (isFavorited) {
      updatedFavorites = favorites.filter(f => f.id !== preset.id);
    } else {
      updatedFavorites = [...favorites, preset];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('omnisync_favorites', JSON.stringify(updatedFavorites));
  };

  // Add to playlist function
  const handleAddToPlaylist = (item) => {
    setItemToAdd(item);
    setShowPlaylistModal(true);
  };

  const handlePlaylistSelected = (playlist) => {
    alert(`Added "${itemToAdd.title || itemToAdd.name}" to "${playlist.name}"!`);
  };

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
    // Helper to detect color noise tracks
    const isColorNoise = (track) => track?.noiseType && !track?.type && (!track?.left || track.left === 0);

    if (currentTrack?.id === item.id && isPlaying) {
      // Clicking the SAME track - Toggle OFF
      // If Custom Generator, treat re-selection as UPDATE not Stop (Stop is via Pause button)
      if (item.id.includes('custom')) {
        if (updateLayers) updateLayers(item.layers || [], item.volumes);
        if (updateNoise) updateNoise(item.noiseType, item.volumes?.noise);
        if (updateSoundscape) updateSoundscape(item.type, item.volumes?.soundscape);
        setCurrentTrack(item);
        return;
      }

      // If clicking same Color Noise - toggle off
      if (isColorNoise(currentTrack) && isColorNoise(item)) {
        if (updateNoise) updateNoise(item.noiseType);
        setCurrentTrack(item);
        return;
      }
      stop();
      setCurrentTrack(null);
    } else {
      // Switching to a DIFFERENT track OR starting from stopped state

      // If switching FROM one Color Noise TO another Color Noise - seamless update
      if (isPlaying && isColorNoise(currentTrack) && isColorNoise(item)) {
        if (updateNoise) updateNoise(item.noiseType);
        setCurrentTrack(item);
        return;
      }

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

  // Playlist navigation handlers
  const handleNextTrack = () => {
    if (!currentPlaylist || !playlistQueue.length) return;

    let nextIndex;
    if (playlistMode === 'shuffle') {
      nextIndex = Math.floor(Math.random() * playlistQueue.length);
    } else if (playlistMode === 'repeat-one') {
      nextIndex = currentTrackIndex; // Stay on same track
    } else {
      nextIndex = currentTrackIndex + 1;
      if (nextIndex >= playlistQueue.length) {
        if (playlistMode === 'repeat-all') {
          nextIndex = 0; // Loop back to start
        } else {
          stop(); // End of playlist
          return;
        }
      }
    }

    setCurrentTrackIndex(nextIndex);
    handleSelectFrequency(playlistQueue[nextIndex]);
  };

  const handlePreviousTrack = () => {
    if (!currentPlaylist || !playlistQueue.length) return;

    let prevIndex;
    if (playlistMode === 'shuffle') {
      prevIndex = Math.floor(Math.random() * playlistQueue.length);
    } else {
      prevIndex = currentTrackIndex - 1;
      if (prevIndex < 0) {
        if (playlistMode === 'repeat-all') {
          prevIndex = playlistQueue.length - 1; // Loop to end
        } else {
          prevIndex = 0; // Stay at first track
        }
      }
    }

    setCurrentTrackIndex(prevIndex);
    handleSelectFrequency(playlistQueue[prevIndex]);
  };

  const handleTogglePlaylistMode = () => {
    const modes = ['normal', 'shuffle', 'repeat-all', 'repeat-one'];
    const currentModeIndex = modes.indexOf(playlistMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setPlaylistMode(nextMode);
  };

  // Common PlayerControls props
  const playerControlsProps = {
    isPlaying,
    onPlayPause: handlePlayPause,
    volume,
    onVolumeChange: setVolume,
    currentTrack: displayTrack,
    sleepTimer,
    onSetSleepTimer: setSleepTimer,
    currentPlaylist,
    currentTrackIndex,
    playlistMode,
    onNextTrack: handleNextTrack,
    onPreviousTrack: handlePreviousTrack,
    onTogglePlaylistMode: handleTogglePlaylistMode
  };

  // Render different pages
  if (currentPage === 'home') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <HomePage onNavigate={handleNavigate} />
        <PlayerControls
          {...playerControlsProps}
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
          {...playerControlsProps}
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
          {...playerControlsProps}
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
          onAddToPlaylist={handleAddToPlaylist}
        />
        <PlayerControls
          {...playerControlsProps}
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
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
        <PlayerControls
          {...playerControlsProps}
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
          {...playerControlsProps}
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

  if (currentPage === 'playlists') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <PlaylistsPage
          onBack={() => setCurrentPage('home')}
          onPlayPlaylist={(playlist) => {
            if (playlist.tracks && playlist.tracks.length > 0) {
              setCurrentPlaylist(playlist);
              setPlaylistQueue(playlist.tracks);
              setCurrentTrackIndex(0);
              handleSelectFrequency(playlist.tracks[0]);
            }
          }}
        />
        <PlayerControls
          {...playerControlsProps}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
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
          {...playerControlsProps}
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
          onPlayPause={handlePlayPause}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
        <PlayerControls
          {...playerControlsProps}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'innersync' || currentPage === 'innersync-dream') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <InnerSyncPage
          onBack={handleBack}
          onPlay={handleSelectFrequency}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          initialTab={currentPage === 'innersync-dream' ? 'journal' : 'energy-profiles'}
        />
        <PlayerControls
          {...playerControlsProps}
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
          {...playerControlsProps}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
        />
      </>
    );
  }

  if (currentPage === 'profile') {
    return (
      <>
        <Visualizer isPlaying={isPlaying} currentTrack={displayTrack} />
        <UserProfilePage onBack={handleBack} />
        <PlayerControls
          {...playerControlsProps}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
          sleepTimer={sleepTimer}
          onSetSleepTimer={setSleepTimer}
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
          {...playerControlsProps}
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
              onPause={() => { stop(); setCurrentTrack(null); }}
              isActive={currentTrack?.id === 'custom-combined' && isPlaying}
              onOpenTinnitusTherapy={() => setShowTinnitusTherapy(true)}
            />
          )}

          {currentPage === 'presets' && (
            <CategoryList
              categories={categories}
              onSelectFrequency={handleSelectFrequency}
              activeId={currentTrack?.id}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onAddToPlaylist={handleAddToPlaylist}
            />
          )}
        </main>


        <footer className="page-footer-inline">
          <div>OMNISYNC™</div>
          <div>© NeoTheory Music 2025</div>
        </footer>

        <PlayerControls
          {...playerControlsProps}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          volume={volume}
          onVolumeChange={setVolume}
          currentTrack={displayTrack}
          sleepTimer={sleepTimer}
          onSetSleepTimer={setSleepTimer}
        />
      </div>

      {showPlaylistModal && itemToAdd && (
        <PlaylistSelectorModal
          item={itemToAdd}
          onClose={() => setShowPlaylistModal(false)}
          onSelect={handlePlaylistSelected}
        />
      )}

      {showTinnitusTherapy && (
        <TinnitusTherapy
          onClose={() => setShowTinnitusTherapy(false)}
          onApply={(settings) => {
            // Create a tinnitus therapy track
            const therapyTrack = {
              id: 'tinnitus-therapy',
              title: `Tinnitus Relief @ ${settings.frequency}Hz`,
              desc: `Notched white noise therapy (${settings.notchWidth}Hz notch)`,
              beat: 0,
              left: settings.frequency,
              right: settings.frequency,
              category: 'Tinnitus Relief',
              tinnitusSettings: settings
            };

            // Play the therapy
            handleSelectFrequency(therapyTrack);
            setShowTinnitusTherapy(false);
          }}
        />
      )}

      {/* Contact Form */}
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}

      {/* Contact Button */}
      <button
        className="contact-button"
        onClick={() => setShowContactForm(true)}
        title="Contact Us"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </button>

      <PWAUpdatePrompt />
    </>
  );
}

export default App;
