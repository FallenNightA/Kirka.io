FC.register('menu', {
    isOpen: false,
    listeningFor: null,

    init() {
        // Init settings and binds
        const savedSettings = localStorage.getItem('fc_settings');
        if (savedSettings) FC.settings = Object.assign(FC.settings, JSON.parse(savedSettings));

        FC.keybinds = JSON.parse(localStorage.getItem('fc_kb') || '{"hjar":"KeyH", "xhair":"KeyX", "autoAct":"KeyF"}');
        
        this.buildMenu();
        this.setupEvents();
    },

    setupEvents() {
        window.addEventListener('keyup', (e) => {
            // Check if user is typing in chat/search
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

            // Rebind logic
            if (this.listeningFor) {
                FC.keybinds[this.listeningFor] = e.code;
                localStorage.setItem('fc_kb', JSON.stringify(FC.keybinds));
                FC.showToast(`Bound to ${e.code}`);
                this.listeningFor = null;
                this.buildMenu();
                return;
            }

            // MENU TOGGLE
            if (e.code === 'ShiftRight') {
                this.isOpen = !this.isOpen;
                const m = document.getElementById('fc-menu');
                if (m) {
                    m.classList.toggle('open', this.isOpen);
                    if (this.isOpen) document.exitPointerLock?.();
                }
            }

            // Feature Quick-Toggles
            if (e.code === FC.keybinds.hjar) this.toggle('hjarEnabled', 'Hjar');
            if (e.code === FC.keybinds.xhair) this.toggle('xhairEnabled', 'Crosshair');
            if (e.code === FC.keybinds.autoAct) this.toggle('autoEnabled', 'Auto Action');
        });
    },

    toggle(key, name) {
        FC.settings[key] = !FC.settings[key];
        localStorage.setItem('fc_settings', JSON.stringify(FC.settings));
        FC.showToast(`${name}: ${FC.settings[key] ? 'ON' : 'OFF'}`);
        this.buildMenu();
    },

    buildMenu() {
        let menu = document.getElementById('fc-menu');
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'fc-menu';
            document.body.appendChild(menu);
        }

        menu.innerHTML = `
            <div id="fc-menu-title">☠ Fallen Client<span>RIGHT SHIFT = MENU &bull; CLICK KEY = REBIND</span></div>
            <div id="fc-menu-body"></div>
        `;

        const body = menu.querySelector('#fc-menu-body');
        body.appendChild(this.makeRow('Hjar Detection', 'Highlight enemies', 'hjarEnabled', 'hjar'));
        body.appendChild(this.makeRow('Auto Action', 'Trigger on player', 'autoEnabled', 'autoAct'));
        body.appendChild(this.makeRow('Custom Crosshair', 'Replacement xhair', 'xhairEnabled', 'xhair'));
    },

    makeRow(label, desc, settingKey, kbKey) {
        const row = document.createElement('div');
        row.className = 'fc-row';
        row.innerHTML = `
            <div>
                <div class="fc-label">${label}</div>
                <div class="fc-desc">${desc}</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <div class="fc-kb" id="kb-${kbKey}">${FC.keybinds[kbKey].replace('Key','')}</div>
                <div class="fc-tog ${FC.settings[settingKey] ? 'on' : ''}"></div>
            </div>
        `;
        row.onclick = (e) => {
            if (e.target.classList.contains('fc-kb')) {
                this.listeningFor = kbKey;
                e.target.textContent = '...';
                return;
            }
            this.toggle(settingKey, label);
        };
        return row;
    }
});
