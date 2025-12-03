import { useState, useEffect, useRef } from 'react';
import { useBinauralBeat } from './hooks/useBinauralBeat';
import { useWakeLock } from './hooks/useWakeLock';
import { categories } from './data/frequencies';
import { sleepSequence } from './data/sleepSequence';
import { CategoryList } from './components/CategoryList';
import { CustomGenerator } from './components/CustomGenerator';
import { PlayerControls } from './components/PlayerControls';
import { Disclaimer } from './components/Disclaimer';
import './App.css';

function App() {
  const { play, stop, isPlaying, volume, setVolume } = useBinauralBeat();
  useWakeLock(isPlaying); // Keep screen on while playing
  const [currentTrack, setCurrentTrack] = useState(null);
  const [sequenceStep, setSequenceStep] = useState(0);
  const sequenceTimerRef = useRef(null);

  // Sleep Sequence Logic
  useEffect(() => {
    if (currentTrack?.id === 'sleep-program-90' && isPlaying) {
      const runSequence = (stepIndex) => {
        const step = sleepSequence[stepIndex];
        if (!step) {
          // Loop back to start
          setSequenceStep(0);
          runSequence(0);
          return;
        }

        setSequenceStep(stepIndex);
        play(step.left, step.right);

        // Schedule next step
        sequenceTimerRef.current = setTimeout(() => {
          runSequence(stepIndex + 1);
        }, step.duration * 1000); // duration is in seconds
      };

      // Start sequence if not already running or if just switched
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
      // Cleanup when stopping or switching tracks
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
        // Start sleep sequence
        setCurrentTrack(item);
        // Play will be triggered by useEffect
        // But we need to set isPlaying to true to trigger the effect
        // We can't call play() here because we don't have the freqs yet
        // So we might need to expose setIsPlaying from hook or just call play with dummy and let effect override
        play(0, 0); // Dummy start to init context
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
        play(0, 0); // Resume sequence
      } else {
        play(currentTrack.left, currentTrack.right, currentTrack.bothEars || 0);
      }
    }
  };

  // Get display title for sequence
  const displayTrack = currentTrack?.id === 'sleep-program-90'
    ? { ...currentTrack, title: `${currentTrack.title} - ${sleepSequence[sequenceStep]?.title || 'Starting...'}` }
    : currentTrack;

  return (
    <>
      <div className="animated-bg" />

      <div className="app-container">
        <header className="app-header">
          <img src="/omnisync-logo.png" alt="OMNISYNC" className="app-logo" />
          <p className="app-subtitle">Please put on headphones and enjoy 🎧</p>
        </header>

        <main className="app-main">
          <CustomGenerator
            onGenerate={handleSelectFrequency}
            isActive={currentTrack?.id === 'custom-combined' && isPlaying}
          />

          <CategoryList
            categories={categories}
            onSelectFrequency={handleSelectFrequency}
            activeId={currentTrack?.id}
          />
        </main>

        <Disclaimer />

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
