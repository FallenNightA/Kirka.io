// File: features/crosshair.js
FC.register('crosshair', {
    canvas: null,
    ctx: null,
    currCol: { r: 255, g: 255, b: 255 },

    init() {
        FC.settings.xhairEnabled = FC.settings.xhairEnabled ?? true;
        FC.settings.xhairSize = FC.settings.xhairSize ?? 10;
        FC.settings.xhairThick = FC.settings.xhairThick ?? 2;
        FC.settings.xhairGap = FC.settings.xhairGap ?? 5;
        FC.settings.xhairColor = FC.settings.xhairColor ?? '#ffffff';
        FC.settings.xhairStyle = FC.settings.xhairStyle ?? 'cross';

        this.buildCanvas();
        this.startLoop();
    },

    buildCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvas.height = 100;
        Object.assign(this.canvas.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)', pointerEvents: 'none',
            zIndex: '99990', display: FC.settings.xhairEnabled ? 'block' : 'none'
        });
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    },

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    },

    draw(r, g, b) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 100, 100);
        if (!FC.settings.xhairEnabled) return;

        const cx = 50, cy = 50, sz = FC.settings.xhairSize, gap = FC.settings.xhairGap, tk = FC.settings.xhairThick;
        const col = `rgb(${r},${g},${b})`, out = 'rgba(0,0,0,0.5)';

        const drawLine = (x1, y1, x2, y2) => {
            ctx.strokeStyle = out; ctx.lineWidth = tk + 2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.strokeStyle = col; ctx.lineWidth = tk; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        };

        if (FC.settings.xhairStyle.includes('cross')) {
            drawLine(cx, cy - gap - sz, cx, cy - gap); drawLine(cx, cy + gap, cx, cy + gap + sz);
            drawLine(cx - gap - sz, cy, cx - gap, cy); drawLine(cx + gap, cy, cx + gap + sz, cy);
        }
        if (FC.settings.xhairStyle.includes('dot')) {
            ctx.fillStyle = out; ctx.beginPath(); ctx.arc(cx, cy, tk + 2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy, tk, 0, Math.PI * 2); ctx.fill();
        }
    },

    startLoop() {
        const tick = () => {
            requestAnimationFrame(tick);
            this.canvas.style.display = FC.settings.xhairEnabled ? 'block' : 'none';
            if (!FC.settings.xhairEnabled) return;

            let target = this.hexToRgb(FC.settings.xhairColor);
            if (FC.state.hjarState === 'head') target = { r: 255, g: 30, b: 30 };
            else if (FC.state.hjarState === 'body') target = { r: 255, g: 120, b: 60 };

            const lerp = (a, b, t) => Math.round(a + (b - a) * t);
            this.currCol.r = lerp(this.currCol.r, target.r, 0.2);
            this.currCol.g = lerp(this.currCol.g, target.g, 0.2);
            this.currCol.b = lerp(this.currCol.b, target.b, 0.2);

            this.draw(this.currCol.r, this.currCol.g, this.currCol.b);
        };
        tick();
    }
});