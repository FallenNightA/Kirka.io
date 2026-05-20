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
            xhairColor: '#00ffff',
            xhairSize: 10,
            xhairThick: 2,
            xhairGap: 5,
            xhairStyle: 'cross'
        },
        state: { 
            fcReady: false, 
            hjarState: 'none',
            glCanvas: null,
            glCtx: null
        },
        loaded: false,

        log(...msg) {
            console.log('%c[FALLEN CLIENT]', 'color: cyan; font-weight: bold;', ...msg);
        },

        register(name, module) {
            this.modules[name] = module;
            if (typeof module.init === 'function') {
                try {
                    module.init();
                    this.log('Initialized:', name);
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

    const BASE = 'https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/';

    const scripts = [
        'core/storage.js',
        'core/events.js',
        'core/engine.js',
        'utils/math.js',
        'utils/colors.js',
        'utils/dom.js',
        'ui/css.js',
        'ui/toast.js',
        'ui/menu.js',
        'features/crosshair.js',
        'features/hjar.js',
        'features/autoshot.js',
        'features/hitsound.js'
    ];

    async function init() {
        FC.log('Starting Fallen Client v' + FC.version);
        for (const file of scripts) {
            try {
                await loadScript(BASE + file);
            } catch (e) {
                console.error('[FC] Failed loading:', file);
            }
        }
        FC.loaded = true;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
