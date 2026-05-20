// File: ui/menu.js
FC.register('menu', {
    isOpen: false,
    listeningFor: null,

    init() {
        // Load saved settings
        const saved = localStorage.getItem('fc_settings');
        if (saved) FC.settings = Object.assign(FC.settings, JSON.parse(saved));
        
        // Load saved keybinds
        FC.keybinds = JSON.parse(localStorage.getItem('fc_kb') || '{"hjar":"KeyH", "xhair":"KeyX", "autoAct":"KeyF"}');
        
        this.buildMenu();
        this.setupEvents();
        this.createStatus();
    },

    setupEvents() {
        window.addEventListener('keyup', (e) => {
            // Rebinding logic
            if (this.listeningFor) {
                FC.keybinds[this.listeningFor] = e.code;
                localStorage.setItem('fc_kb', JSON.stringify(FC.keybinds));
                FC.showToast(`Bound to ${e.code}`);
                this.listeningFor = null;
                this.buildMenu();
                return;
            }

            // Don't trigger if in chat
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

            // Right Shift to open menu
            if (e.code === 'ShiftRight') {
                this.isOpen = !this.isOpen;
                const menu = document.getElementById('fc-menu');
                if (menu) {
                    menu.classList.toggle('open', this.isOpen);
                    if (this.isOpen) document.exitPointerLock?.();
                }
            }

            // Close with Escape
            if (e.code === 'Escape' && this.isOpen) {
                this.isOpen = false;
                document.getElementById('fc-menu').classList.remove('open');
            }

            // Keybind Feature Toggles
            if (e.code === FC.keybinds.hjar) this.toggleSetting('hjarEnabled', 'Hjar');
            if (e.code === FC.keybinds.xhair) this.toggleSetting('xhairEnabled', 'Crosshair');
            if (e.code === FC.keybinds.autoAct) this.toggleSetting('autoEnabled', 'Auto Action');
        });
    },

    toggleSetting(key, name) {
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
            <div id="fc-menu-title">☠ Fallen Client<span>R-SHIFT = Menu &bull; CLICK KEY = REBIND</span></div>
            <div id="fc-menu-body"></div>
        `;

        const body = menu.querySelector('#fc-menu-body');
        
        body.appendChild(this.createSection('Combat'));
        body.appendChild(this.makeRow('Hjar Detection', 'Highlight enemies', 'hjarEnabled', 'hjar'));
        body.appendChild(this.makeRow('Auto Action', 'Trigger on target', 'autoEnabled', 'autoAct'));
        
        body.appendChild(this.createSection('Visuals'));
        body.appendChild(this.makeRow('Custom Crosshair', 'Use custom crosshair', 'xhairEnabled', 'xhair'));
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
            this.toggleSetting(settingKey, label);
        };
        return row;
    },

    createSection(name) {
        const div = document.createElement('div');
        div.className = 'fc-sec';
        div.textContent = name;
        return div;
    },

    createStatus() {
        const el = document.createElement('div');
        el.id = 'fc-status';
        el.style.cssText = "position:fixed; bottom:10px; left:10px; color:cyan; z-index:100000; font-family:monospace; font-size:12px; pointer-events:none;";
        el.textContent = '☠ FC v' + FC.version;
        document.body.appendChild(el);
    }
});
