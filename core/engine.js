// File: core/engine.js
FC.register('engine', {
    init() {
        this.setupWebGLHook();
        this.setupProxy();
        FC.state = {
            glCanvas: null,
            glCtx: null,
            fcReady: false,
            hjarState: 'none'
        };
    },

    setupWebGLHook() {
        const self = this;
        const _origGetCtx = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, a) {
            const ctx = _origGetCtx.apply(this, arguments);
            if ((type === 'webgl' || type === 'webgl2') && !FC.state.glCanvas) {
                FC.state.glCanvas = this;
                FC.state.glCtx = ctx;
                FC.log('WebGL Context Captured');
            }
            return ctx;
        };
    },

    setupProxy() {
        Array.isArray = new Proxy(Array.isArray, {
            apply(target, thisArg, args) {
                const mat = args[0];
                const result = Reflect.apply(target, thisArg, args);
                try {
                    if (mat && mat.map && mat.map.image && mat.map.image.width === 64) {
                        mat.depthTest = false;
                        for (let k in mat) {
                            if (mat[k] === 3) { 
                                mat[k] = 1; 
                                FC.state.fcReady = true; 
                                break; 
                            }
                        }
                    }
                } catch (_) {}
                return result;
            }
        });
    }
});