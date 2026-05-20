// File: features/autoshot.js
FC.register('autoshot', {
    lastFired: 0,

    init() {
        FC.settings.autoEnabled = FC.settings.autoEnabled ?? false;
        FC.settings.autoMode = FC.settings.autoMode ?? 'shot';
        FC.settings.autoTarget = FC.settings.autoTarget ?? 'both';
        FC.settings.autoHeadMsg = FC.settings.autoHeadMsg ?? 'HEADSHOT!';
        FC.settings.autoBodyMsg = FC.settings.autoBodyMsg ?? 'BODY!';
        
        this.startObserver();
    },

    startObserver() {
        setInterval(() => {
            if (!FC.settings.autoEnabled || FC.state.hjarState === 'none') return;
            
            // Filter by target
            if (FC.settings.autoTarget === 'head' && FC.state.hjarState !== 'head') return;
            if (FC.settings.autoTarget === 'body' && FC.state.hjarState !== 'body') return;

            const now = performance.now();
            if (now - this.lastFired < 600) return;
            this.lastFired = now;

            if (FC.settings.autoMode === 'shot') {
                this.fireClick();
            } else {
                const msg = FC.state.hjarState === 'head' ? FC.settings.autoHeadMsg : FC.settings.autoBodyMsg;
                this.sendChat(msg);
            }
        }, 50);
    },

    fireClick() {
        const canvas = FC.state.glCanvas || document.querySelector('canvas');
        if (!canvas) return;
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        const opts = { bubbles: true, clientX: cx, clientY: cy, button: 0 };
        canvas.dispatchEvent(new MouseEvent('mousedown', opts));
        setTimeout(() => canvas.dispatchEvent(new MouseEvent('mouseup', opts)), 50);
    },

    sendChat(msg) {
        const input = document.querySelector('input[type="text"]');
        if (!input) return;
        input.focus();
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, msg);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(() => {
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            input.blur();
        }, 80);
    }
});