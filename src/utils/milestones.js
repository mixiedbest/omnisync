import { Sprout, Flame, Heart, Crown, Sparkles } from 'lucide-react';

// Milestone tiers with icons and thresholds (in minutes)
export const MILESTONES = [
    { id: 'sprout', name: 'New Connection', icon: Sprout, threshold: 30, color: '#84cc16' },
    { id: 'flame', name: 'Building Energy', icon: Flame, threshold: 90, color: '#f97316' },
    { id: 'heart', name: 'Deep Connection', icon: Heart, threshold: 150, color: '#ec4899' },
    { id: 'crown', name: 'Mastery Level', icon: Crown, threshold: 360, color: '#fbbf24' },
    { id: 'sparkles', name: 'Transcendent Bond', icon: Sparkles, threshold: 10080, color: '#8b5cf6' }
];

// Get milestone based on total minutes
export const getMilestone = (totalMinutes) => {
    // Find the highest milestone achieved
    for (let i = MILESTONES.length - 1; i >= 0; i--) {
        if (totalMinutes >= MILESTONES[i].threshold) {
            return MILESTONES[i];
        }
    }
    return null; // No milestone yet
};

// Get progress to next milestone
export const getProgressToNext = (totalMinutes) => {
    const currentMilestone = getMilestone(totalMinutes);

    // Find next milestone
    const currentIndex = currentMilestone ? MILESTONES.findIndex(m => m.id === currentMilestone.id) : -1;
    const nextMilestone = MILESTONES[currentIndex + 1];

    if (!nextMilestone) {
        return { progress: 100, nextMilestone: null }; // Max level reached
    }

    const previousThreshold = currentMilestone ? currentMilestone.threshold : 0;
    const range = nextMilestone.threshold - previousThreshold;
    const current = totalMinutes - previousThreshold;
    const progress = Math.min(100, (current / range) * 100);

    return { progress, nextMilestone };
};

// Load connections from localStorage
export const loadConnections = () => {
    const saved = localStorage.getItem('omnisync_connections');
    return saved ? JSON.parse(saved) : [];
};

// Save connections to localStorage
export const saveConnections = (connections) => {
    localStorage.setItem('omnisync_connections', JSON.stringify(connections));
};

// Add session time to a connection
export const addSessionTime = (partnerName, sessionMinutes) => {
    const connections = loadConnections();

    // Find or create connection
    let connection = connections.find(c => c.name === partnerName);

    if (!connection) {
        connection = {
            id: `conn_${Date.now()}`,
            name: partnerName,
            totalMinutes: 0,
            sessions: [],
            createdAt: new Date().toISOString()
        };
        connections.push(connection);
    }

    // Add session
    connection.totalMinutes += sessionMinutes;
    connection.sessions.push({
        date: new Date().toISOString(),
        minutes: sessionMinutes
    });
    connection.lastSession = new Date().toISOString();

    // Update milestone
    const milestone = getMilestone(connection.totalMinutes);
    connection.milestone = milestone ? milestone.id : null;

    saveConnections(connections);
    return connection;
};

// Get connection by name
export const getConnection = (partnerName) => {
    const connections = loadConnections();
    return connections.find(c => c.name === partnerName);
};
