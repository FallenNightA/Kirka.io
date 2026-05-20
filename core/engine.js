// File: core/engine.js
FC.register('engine', {
    init() {
        this.setupHooks();
    },

    setupHooks() {
        const originalIsArray = Array.isArray;

        Array.isArray = function (arg) {
            const result = originalIsArray(arg);
            if (!arg) return result;

            // Texture detection for Kirka Players (64x64 size)
            if (arg.map && arg.map.image && arg.map.image.width === 64) {
                
                // 1. Skin Link Integration (Chams)
                if (localStorage.csl_enabled === "true") {
                    let useurl = localStorage.csl_url_or_base64 === "false" 
                        ? localStorage.csl_url 
                        : localStorage.csl_colorpicker_inputurl;
                    
                    if (useurl && arg.map.image.src !== useurl) {
                        arg.map.image.src = useurl;
                    }
                }

                // 2. Engine/Wallhack Logic
                try {
                    // This allows seeing through walls
                    arg.depthTest = false; 
                    for (let k in arg) {
                        if (arg[k] === 3) { 
                            arg[k] = 1; 
                            FC.state.fcReady = true; 
                            break; 
                        }
                    }
                } catch (e) {}
            }
            return result;
        };

        // Capture WebGL Context for Hjar (Pixel detection)
        const _origGetCtx = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, a) {
            const ctx = _origGetCtx.apply(this, arguments);
            if ((type === 'webgl' || type === 'webgl2') && !FC.state.glCanvas) {
                FC.state.glCanvas = this;
                FC.state.glCtx = ctx;
            }
            return ctx;
        };
    }
});
