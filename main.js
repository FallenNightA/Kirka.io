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
        settings: {},
        state: {}, // Shared state for engine/hjar/crosshair
        loaded: false,

        log(...msg) {
            console.log(
                '%c[FALLEN CLIENT]',
                'color: cyan; font-weight: bold;',
                ...msg
            );
        },

        register(name, module) {
            this.modules[name] = module;
            this.log('Registered module:', name);

            if (typeof module.init === 'function') {
                try {
                    module.init();
                } catch (err) {
                    console.error(`[FC] Failed to initialize ${name}:`, err);
                }
            }
        }
    };

    function loadScript(path) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            // Adding a timestamp to prevent GitHub caching issues during development
            script.src = path + '?t=' + Date.now(); 
            script.onload = () => resolve(path);
            script.onerror = () => reject(path);
            document.head.appendChild(script);
        });
    }

    const BASE = 'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/';

    // Order is important: Core -> Utils -> UI -> Features
    const scripts = [
        // 1. CORE
        'core/storage.js',
        'core/events.js',
        'core/engine.js',

        // 2. UTILS
        'utils/math.js',
        'utils/colors.js',
        'utils/dom.js',

        // 3. UI
        'ui/css.js',
        'ui/toast.js',
        'ui/global-chat-css.js',
        'ui/menu.js',

        // 4. FEATURES
        'features/crosshair.js',
        'features/hjar.js',
        'features/autoshot.js',
        'features/hitsound.js',
        'features/keystroke-overlay.js',
        'features/friends_ui_features.js',
        'features/chams.js',
        'features/accept-trade-easly.js'
    ];

    async function init() {
        FC.log('Starting Fallen Client v' + FC.version);

        for (const file of scripts) {
            try {
                await loadScript(BASE + file);
                FC.log('Loaded:', file);
            } catch (e) {
                console.error('[FC] Failed loading file:', file);
            }
        }

        FC.loaded = true;
        FC.log('All modules and features loaded successfully.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
