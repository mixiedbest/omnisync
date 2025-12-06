# OMNISYNC: Future Features Roadmap

## 1. Cloud & Community Infrastructure (Firebase Integration)
* **Real User Authentication:** 
  - Integrate Firebase Auth (Google/Email) to replace the current local/guest system.
* **Cross-Device Sync:** 
  - Save "Favorites", "Custom Frequency Presets", and "Journey History" to the cloud.
  - Allow users to start a session on desktop and track stats on mobile.
* **True Multiplayer Rooms:** 
  - Upgrade "Rooms" from local simulation to real-time WebSockets/Firebase DB.
  - Enable live chat, visible user presence, and synchronized audio start/stop for groups.
* **Remote Partner Sync:** 
  - Allow two distinct devices to pair over the internet for synchronized breathing/binaural sessions.

## 2. Advanced Audio & Offline Experience
* **Robust Offline Mode (PWA):** 
  - Implement aggressive service worker caching for large audio files (voiceovers, high-res soundscapes).
  - Ensure 100% functionality in "Airplane Mode".
* **Background Audio Handling:**
  - Optimize `mediaSession` API usage to ensure uninterrupted playback when mobile screens lock.
* **Biofeedback Integration (Experimental):**
  - Use microphone input to detect ambient noise (auto-adjust volume) or simple breathing rhythm detection.

## 3. Expanded Content & Customization
* **Playlist / Sequence Builder:**
  - Allow users to daisy-chain presets (e.g., "15m Alpha" -> "20m Theta" -> "Silence").
* **User Audio Uploads:**
  - Feature to upload personal background sounds (MP3/WAV) to mix with the binaural engine.
* **Dynamic Voiceovers:**
  - AI-driven or variable guidance that changes slightly based on time of day (e.g., "Good Morning" vs "Good Evening").

## 4. Analytics & Gamification
* **Cloud-Backed Statistics:**
  - "Total Mindful Minutes" and "Current Streak" stored permanently.
* **Achievements System:**
  - Badges for milestones (e.g., "Astral Traveler" for completing a 6-hour session).
* **Mood Tracking History:**
  - A calendar view showing "Post-Session Mood" logs over time to visualize progress.

## 5. Monetization & Access Control (Optional)
* **Premium Tiers:** system to lock specific "Pro" journeys or advanced frequencies.
