// ==UserScript==
// @name         Fallen Client Loader
// @namespace    FallenNight
// @version      7.0
// @description  Modular Kirka.io Client
// @match        *://kirka.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    window.FC = {
        version: '7.0',
        modules: {},
        settings: {
            hjarEnabled: false,
            xhairEnabled: true,
            autoEnabled: false,
            xhairColor: '#00ffff'
        },
        state: { fcReady: false, hjarState: 'none', glCanvas: null, glCtx: null },
        log(...msg) {
            console.log('%c[FALLEN CLIENT]', 'color: cyan; font-weight: bold;', ...msg);
        },
        register(name, module) {
            this.modules[name] = module;
            if (typeof module.init === 'function') {
                try {
                    module.init();
                    this.log('Loaded module:', name);
                } catch (err) {
                    console.error(`[FC] Failed init ${name}`, err);
                }
            }
        }
    };

    function loadScript(path) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = path + '?t=' + Date.now();
            script.onload = () => resolve(path);
            script.onerror = () => reject(path);
            document.head.appendChild(script);
        });
    }

    const scripts = [
        // CORE & UTILS
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/core/storage.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/core/events.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/core/engine.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/utils/math.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/utils/colors.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/utils/dom.js',

        // UI
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/ui/css.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/ui/toast.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/ui/menu.js',

        // FEATURES (Modular)
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/features/crosshair.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/features/hjar.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/features/autoshot.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/features/hitsound.js',

        // FEATURES (Legacy - No folder)
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/chams.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/keystroke-overlay.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/friends_ui_features.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/accept-trade-easly.js',
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/global-chat-css.js'
    ];

    async function init() {
        FC.log('Initializing Loader...');
        for (const url of scripts) {
            try {
                await loadScript(url);
            } catch (e) {
                console.error('[FC] Failed loading URL:', url);
            }
        }
        FC.log('All scripts executed.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
