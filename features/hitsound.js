// File: features/hitsound.js
FC.register('hitsound', {
    audioCtx: null,

    init() {
        FC.settings.soundEnabled = FC.settings.soundEnabled ?? false;
        FC.settings.soundVolume = FC.settings.soundVolume ?? 50;
        this.watchHits();
    },

    getAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioCtx;
    },

    play(isHead) {
        const ctx = this.getAudio();
        if (!ctx || ctx.state === 'suspended') ctx.resume();

        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);

        const t = ctx.currentTime;
        const freq = isHead ? 1400 : 900;
        o.frequency.setValueAtTime(freq, t);
        o.frequency.exponentialRampToValueAtTime(freq / 2, t + 0.07);

        g.gain.setValueAtTime((FC.settings.soundVolume / 100) * 0.4, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

        o.start(t); o.stop(t + 0.1);
    },

    watchHits() {
        const observer = new MutationObserver(mutations => {
            if (!FC.settings.soundEnabled) return;
            for (const m of mutations) {
                for (const n of m.addedNodes) {
                    if (n.nodeType !== 1) continue;
                    const txt = n.textContent.trim();
                    // Damage numbers in Kirka are typically 2-3 digits
                    if (/^\d{2,3}$/.test(txt)) {
                        this.play(parseInt(txt) > 80);
                    }
                }
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
});