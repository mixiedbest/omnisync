# OMNISYNC Social Features Implementation Plan

## Phase 1: Foundation (Current Priority)
### 1.1 User Profile System ✅
- [x] Create UserProfilePage component
- [x] Avatar selection (Lucide icons)
- [x] Username
- [x] Healing goals
- [x] Share up to 3 custom sounds
- [ ] Integrate into HomePage navigation

### 1.2 Enhanced Journal with Gratitude
- [ ] Add gratitude field to journal entries
- [ ] Daily gratitude prompt
- [ ] Optional: Add more gratitude items
- [ ] Update journal UI to display gratitude

### 1.3 Custom Sounds Storage
- [ ] Track custom generator creations
- [ ] Store with unique IDs
- [ ] Allow naming custom sounds
- [ ] Pass to UserProfile for sharing

## Phase 2: Connections Framework
### 2.1 Connections Page Structure
- [ ] Main Connections hub page
- [ ] Navigation to sub-features:
  - Shared Waveform
  - Sound Spaces (Group Rooms)
  - Connection Playlists
  - Message Drops
  - Frequency Gifts
  - Partner/Family Modes

### 2.2 Backend Requirements (Future)
- [ ] User authentication system
- [ ] Real-time WebSocket connections
- [ ] User discovery/friend system
- [ ] Session synchronization
- [ ] Message queue system

## Phase 3: Social Features (Requires Backend)
### 3.1 Shared Waveform
- Real-time visualization of connected users
- Volume/intensity synchronization
- Visual pulse effects

### 3.2 Sound Spaces (Group Rooms)
- Room creation (2-10 participants)
- Ready countdown system
- Minimal chat/emoji system
- Participant list with duration
- Session types:
  - Meditation rooms
  - Study/coworking
  - Couples spaces

### 3.3 Connection-Based Playlists
- Collaborative playlist creation
- Elemental profile matching
- Auto-adjustment for all participants
- Examples:
  - Partner blends
  - Family rooms
  - Creative labs

### 3.4 Energetic Message Drops
- 15-second tone postcards
- Custom generator integration
- Themed messages:
  - Focus, Rest, Thinking of you
  - Harmony, Strength, Peace
- Send to connected users

### 3.5 Connection Milestones
- Track synchronized sessions
- Unlock achievements:
  - 5 sessions: Harmony Unlocked 🌟
  - 10 sessions: Radiant Connection ✨
  - Full moon cycle: Lunar Link 🌙
- Rewards:
  - Special tones
  - Animated visuals
  - Shared profile badges

### 3.6 Partner/Family Sync Modes
Special presets for:
- **Couples**: Heartbeat binaural pulses, empathy tones
- **Parents + Kids**: Soothing harmonics, breathing meters
- **Creative Partners**: Brainstorming frequencies, theta+beta blend

### 3.7 Frequency Gifts
- Gift specific tones/journeys
- Types: Energy Boost, Digestive Harmony, Deep Sleep, Protection, Clarity
- Opening animations
- Gift history tracking

### 3.8 Connection Intent Choice
Before syncing, choose intent:
- Heal
- Rest
- Create
- Release
- Bond
- Learn
- Celebrate
App adjusts frequencies accordingly

## Implementation Notes

### Current Session (Immediate Tasks)
1. ✅ Create UserProfilePage component
2. ✅ Create UserProfilePage CSS
3. Add "Profile" button to HomePage (above Settings)
4. Enhance journal with gratitude field
5. Create Connections hub page (placeholder for future features)
6. Track custom generator sounds with IDs

### Technical Considerations
- Most social features require backend infrastructure
- Can create UI/UX mockups and local-only versions first
- WebSocket for real-time features
- Consider Firebase/Supabase for backend
- Privacy and data security critical for user connections

### Design Philosophy
- Keep interactions minimal and intentional
- Maintain healing/meditative atmosphere
- No notifications spam
- Gentle, supportive social features
- Focus on meaningful connections over metrics
