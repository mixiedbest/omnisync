import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';
import './PWAUpdatePrompt.css';

export function PWAUpdatePrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    const handleUpdate = () => {
        updateServiceWorker(true);
    };

    if (!offlineReady && !needRefresh) return null;

    return (
        <div className="pwa-toast">
            <div className="pwa-message">
                {offlineReady ? (
                    <span>App ready to work offline</span>
                ) : (
                    <span>
                        <RefreshCw size={16} className="pwa-icon" />
                        New version available!
                    </span>
                )}
            </div>
            <div className="pwa-actions">
                {needRefresh && (
                    <button className="pwa-button pwa-button-primary" onClick={handleUpdate}>
                        Update Now
                    </button>
                )}
                <button className="pwa-button pwa-button-secondary" onClick={close}>
                    {needRefresh ? 'Later' : 'OK'}
                </button>
            </div>
        </div>
    );
}
