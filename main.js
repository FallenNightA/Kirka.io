// ==UserScript==
// @name         Fallen Client Loader
// @namespace    FallenNight
// @version      7.0
// @description  Modular Kirka.io Client
// @match        *://kirka.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================
    // GLOBAL CLIENT
    // =========================================================

    window.FC = {
        version: '7.0',
        modules: {},
        settings: {},
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

            this.log('Loaded module:', name);

            if (typeof module.init === 'function') {
                try {
                    module.init();
                } catch (err) {
                    console.error(`[FC] Failed init ${name}`, err);
                }
            }
        }
    };

    // =========================================================
    // LOAD SCRIPT FILE
    // =========================================================

    function loadScript(path) {
        return new Promise((resolve, reject) => {

            const script = document.createElement('script');

            script.src = path;
            script.onload = () => resolve(path);
            script.onerror = () => reject(path);

            document.head.appendChild(script);

        });
    }

    // =========================================================
    // GITHUB RAW BASE
    // =========================================================

    const BASE =
        'https://raw.githubusercontent.com/FallenNightA/Kirka.io/refs/heads/main/';

    // =========================================================
    // LOAD ORDER
    // =========================================================

    const scripts = [

        // CORE
        'core/storage.js',
        'core/events.js',
        'core/engine.js',

        // UTILS
        'utils/math.js',
        'utils/colors.js',
        'utils/dom.js',

        // UI
        'ui/css.js',
        'ui/toast.js',
        'ui/menu.js',

        // FEATURES
        'features/crosshair.js',
        'features/hjar.js',
        'features/autoshot.js',
        'features/hitsound.js'

    ];

    // =========================================================
    // INIT
    // =========================================================

    async function init() {

        FC.log('Starting Fallen Client v' + FC.version);

        for (const file of scripts) {

            try {

                await loadScript(BASE + file);

                FC.log('Loaded:', file);

            } catch (e) {

                console.error('[FC] Failed loading:', file);

            }

        }

        FC.loaded = true;

        FC.log('All modules loaded.');

    }

    // =========================================================
    // DOM READY
    // =========================================================

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', init);

    } else {

        init();

    }

})();
