// ==UserScript==
// @name         Fallen Client Loader
// @namespace    FallenNight
// @version      7.0
// @description  Modular Kirka.io Client
// @author       FallenNight
// @match        *://kirka.io/*
// @icon         https://raw.githubusercontent.com/FallenNightA/FallenUtility/main/icon.png
// @run-at       document-start
// @grant        none

// --- CORE SYSTEM ---
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/core/storage.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/core/events.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/core/engine.js

// --- UTILS ---
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/utils/math.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/utils/colors.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/utils/dom.js

// --- UI ---
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/ui/css.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/ui/toast.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/ui/menu.js

// --- FEATURES ---
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/features/crosshair.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/features/hjar.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/features/autoshot.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/features/hitsound.js

// --- LEGACY SCRIPTS ---
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/chams.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/keystroke-overlay.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/friends_ui_features.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/accept-trade-easly.js
// @require      https://raw.githubusercontent.com/FallenNightA/Kirka.io/main/global-chat-css.js

// ==/UserScript==

(function () {
    'use strict';

    // Initialize the Global FC Object if it doesn't exist yet
    if (!window.FC) {
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
                        this.log('✅ Registered:', name);
                    } catch (err) {
                        console.error(`[FC] Failed init ${name}`, err);
                    }
                }
            }
        };
    }

    FC.log('Tampermonkey @require injection complete. System Ready.');

})();
