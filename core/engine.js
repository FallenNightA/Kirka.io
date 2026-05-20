// File: core/engine.js
FC.register('engine', {
    init() {
        this.hookGame();
    },

    hookGame() {
        const originalIsArray = Array.isArray;

        Array.isArray = function (arg) {
            const result = originalIsArray(arg);
            if (!arg) return result;

            // Target Player Models (64x64 texture)
            if (arg.map && arg.map.image && arg.map.image.width === 64) {
                
                // 1. Skin Changer Logic (from Chams.js)
                if (localStorage.csl_enabled === "true") {
                    const skin = localStorage.csl_url_or_base64 === "false" ? localStorage.csl_url : localStorage.csl_colorpicker_inputurl;
                    if (skin) arg.map.image.src = skin;
                }

                // 2. Visual/Wallhack Logic
                try {
                    arg.depthTest = false; // See players through walls
                    for (let key in arg) {
                        if (arg[key] === 3) { 
                            arg[key] = 1; // Material change for visibility
                            FC.state.fcReady = true;
                            break; 
                        }
                    }
                } catch (e) {}
            }
            return result;
        };

        // Capture WebGL for Pixel Detection
        const _origCtx = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type) {
            const ctx = _origCtx.apply(this, arguments);
            if ((type === 'webgl' || type === 'webgl2') && !FC.state.glCanvas) {
                FC.state.glCanvas = this;
                FC.state.glCtx = ctx;
            }
            return ctx;
        };
    }
});
