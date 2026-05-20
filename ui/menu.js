// File: ui/menu.js
FC.register('menu', {
    isOpen: false,
    listeningFor: null,

    init() {
        // Load settings and binds from LocalStorage
        FC.binds = JSON.parse(localStorage.getItem('fc_kb') || '{"hjar":"KeyH", "xhair":"KeyX", "auto":"KeyF"}');
        const saved = localStorage.getItem('fc_settings');
        if (saved) FC.settings = Object.assign(FC.settings, JSON.parse(saved));

        this.setupKeybinds();
        this.buildMenu();
    },

    setupKeybinds() {
        window.addEventListener('keyup', (e) => {
            // Ignore if in chat
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

            // Rebinding logic
            if (this.listeningFor) {
                FC.binds[this.listeningFor] = e.code;
                localStorage.setItem('fc_kb', JSON.stringify(FC.binds));
                this.listeningFor = null;
                this.buildMenu();
                return;
            }

            // MENU TOGGLE: RIGHT SHIFT
            if (e.code === 'ShiftRight') {
                this.isOpen = !this.isOpen;
                const m = document.getElementById('fc-menu');
                if (m) {
                    m.classList.toggle('open', this.isOpen);
                    if (this.isOpen) document.exitPointerLock?.();
                }
            }

            // Feature Quick Toggles
            if (e.code === FC.binds.hjar) this.toggle('hjarEnabled', 'Hjar');
            if (e.code === FC.binds.xhair) this.toggle('xhairEnabled', 'Crosshair');
            if (e.code === FC.binds.auto) this.toggle('autoEnabled', 'Auto Action');
        });
    },

    toggle(key, name) {
        FC.settings[key] = !FC.settings[key];
        localStorage.setItem('fc_settings', JSON.stringify(FC.settings));
        if (FC.showToast) FC.showToast(`${name}: ${FC.settings[key] ? 'ON' : 'OFF'}`);
        this.buildMenu();
    },

    buildMenu() {
        let menu = document.getElementById('fc-menu');
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'fc-menu';
            document.body.appendChild(menu);
        }
        menu.innerHTML = `<div id="fc-menu-title">☠ Fallen Client<span>RIGHT SHIFT = MENU</span></div><div id="fc-menu-body"></div>`;
        const body = menu.querySelector('#fc-menu-body');
        
        body.appendChild(this.createRow('Hjar Detection', 'hjarEnabled', 'hjar'));
        body.appendChild(this.createRow('Custom Crosshair', 'xhairEnabled', 'xhair'));
        body.appendChild(this.createRow('Auto Action', 'autoEnabled', 'auto'));
    },

    createRow(label, settingKey, bindKey) {
        const div = document.createElement('div');
        div.className = 'fc-row';
        div.innerHTML = `
            <div class="fc-label">${label}</div>
            <div style="display:flex; align-items:center; gap:10px;">
                <div class="fc-kb" id="kb-${bindKey}">${FC.binds[bindKey].replace('Key','')}</div>
                <div class="fc-tog ${FC.settings[settingKey] ? 'on' : ''}"></div>
            </div>`;
        div.onclick = (e) => {
            if (e.target.classList.contains('fc-kb')) {
                this.listeningFor = bindKey;
                e.target.textContent = '...';
                return;
            }
            this.toggle(settingKey, label);
        };
        return div;
    }
});
