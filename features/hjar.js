// File: features/hjar.js
FC.register('hjar', {
    timer: 0,

    init() {
        FC.settings.hjarEnabled = FC.settings.hjarEnabled ?? false;
        this.createUI();
        this.startLoop();
    },

    createUI() {
        const el = document.createElement('div');
        el.id = 'fc-hjar-label';
        Object.assign(el.style, {
            position: 'fixed', left: '50%', top: 'calc(50% - 46px)',
            transform: 'translateX(-50%)', fontFamily: 'monospace',
            fontSize: '13px', fontWeight: 'bold', letterSpacing: '3px',
            pointerEvents: 'none', zIndex: '99991', opacity: '0',
            transition: 'opacity 0.1s', textShadow: '0 0 8px currentColor, 1px 1px 4px black'
        });
        document.body.appendChild(el);
    },

    samplePx(x, y) {
        const ctx = FC.state.glCtx;
        if (!ctx || !FC.state.glCanvas) return null;
        try {
            const px = new Uint8Array(4);
            ctx.readPixels(Math.round(x), Math.round(FC.state.glCanvas.height - y), 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, px);
            return { r: px[0], g: px[1], b: px[2], a: px[3] };
        } catch (_) { return null; }
    },

    isPlayerPx(p) {
        if (!p || p.a < 20) return false;
        const br = (p.r + p.g + p.b) / 3;
        if (br > 210 && Math.max(p.r, p.g, p.b) - Math.min(p.r, p.g, p.b) < 25) return false;
        if (br < 12) return false;
        if (p.b > p.r + 60 && p.b > p.g + 30 && br > 140) return false;
        return true;
    },

    startLoop() {
        const tick = () => {
            requestAnimationFrame(tick);
            if (!FC.settings.hjarEnabled || !FC.state.glCanvas) {
                FC.state.hjarState = 'none';
                this.updateUI();
                return;
            }

            const now = performance.now();
            if (now - this.timer < 33) return;
            this.timer = now;

            const cx = FC.state.glCanvas.width / 2;
            const cy = FC.state.glCanvas.height / 2;
            let headH = 0, bodyH = 0;

            for (let dy = -32; dy <= 12; dy += 4) {
                for (let dx = -10; dx <= 10; dx += 5) {
                    const p = this.samplePx(cx + dx, cy + dy);
                    if (this.isPlayerPx(p)) {
                        if (dy < -8) headH++; else bodyH++;
                    }
                }
            }

            FC.state.hjarState = headH >= 3 ? 'head' : bodyH >= 3 ? 'body' : 'none';
            this.updateUI();
        };
        tick();
    },

    updateUI() {
        const el = document.getElementById('fc-hjar-label');
        if (!el) return;
        if (FC.state.hjarState === 'none') { el.style.opacity = '0'; return; }
        el.textContent = FC.state.hjarState === 'head' ? '● HEAD' : '● BODY';
        el.style.color = FC.state.hjarState === 'head' ? '#ff2020' : '#ff9060';
        el.style.opacity = '1';
    }
});