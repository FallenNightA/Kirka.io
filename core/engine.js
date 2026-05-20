FC.register('engine', {
    init() {
        this.hookRendering();
    },

    hookRendering() {
        const originalIsArray = Array.isArray;

        Array.isArray = function (arg) {
            const result = originalIsArray(arg);
            if (!arg) return result;

            // Target Player Materials (64x64 textures)
            if (arg.map && arg.map.image && arg.map.image.width === 64) {
                
                // 1. INTEGRATED SKIN CHANGER LOGIC
                if (localStorage.csl_enabled === "true") {
                    const skinUrl = localStorage.csl_url_or_base64 === "false" 
                        ? localStorage.csl_url 
                        : localStorage.csl_colorpicker_inputurl;
                    
                    if (skinUrl && arg.map.image.src !== skinUrl) {
                        arg.map.image.src = skinUrl;
                    }
                }

                // 2. INTEGRATED WALLHACK/CHAMS LOGIC
                // We set depthTest to false so players are visible through walls
                try {
                    arg.depthTest = false; 
                    for (let key in arg) {
                        // Change material type to MeshBasicMaterial (1) to ignore lighting/walls
                        if (arg[key] === 3) { 
                            arg[key] = 1; 
                            FC.state.fcReady = true;
                            break; 
                        }
                    }
                } catch (e) {}
            }
            return result;
        };

        // Hook WebGL for Pixel Detection (Hjar)
        const _origGetCtx = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type) {
            const ctx = _origGetCtx.apply(this, arguments);
            if ((type === 'webgl' || type === 'webgl2') && !FC.state.glCanvas) {
                FC.state.glCanvas = this;
                FC.state.glCtx = ctx;
            }
            return ctx;
        };
    }
});
