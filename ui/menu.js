// File: ui/menu.js
FC.register('menu', {
    isOpen: false,
    listeningFor: null,

    init() {
        // Load Keybinds
        FC.keybinds = JSON.parse(localStorage.getItem('fc_kb') || '{"hjar":"KeyH", "xhair":"KeyX", "autoAct":"KeyF"}');
        
        this.buildMenu();
        this.setupEvents();
        this.createStatus();
    },

    saveKB() {
        localStorage.setItem('fc_kb', JSON.stringify(FC.keybinds));
    },

    createStatus() {
        const el = document.createElement('div');
        el.id = 'fc-status';
        el.textContent = '☠ FC v' + FC.version;
        document.body.appendChild(el);
    },

    setupEvents() {
        window.addEventListener('keydown', (e) => {
            // Rebind logic
            if (this.listeningFor) {
                e.preventDefault();
                FC.keybinds[this.listeningFor] = e.code;
                this.saveKB();
                FC.showToast(`${this.listeningFor} bound to ${e.code}`);
                this.listeningFor = null;
                this.buildMenu(); // Refresh UI
                return;
            }

            // Don't trigger if typing in chat
            if (document.activeElement.tagName === 'INPUT') return;

            // Toggle Menu
            if (e.code === 'ShiftRight') {
                this.isOpen = !this.isOpen;
                document.getElementById('fc-menu').classList.toggle('open', this.isOpen);
            }

            // Close menu on Esc
            if (e.code === 'Escape' && this.isOpen) {
                this.isOpen = false;
                document.getElementById('fc-menu').classList.remove('open');
            }

            // Feature Binds
            if (e.code === FC.keybinds.hjar) this.toggleSetting('hjarEnabled', 'Hjar');
            if (e.code === FC.keybinds.xhair) this.toggleSetting('xhairEnabled', 'Crosshair');
            if (e.code === FC.keybinds.autoAct) this.toggleSetting('autoEnabled', 'Auto Shot');
        });
    },

    toggleSetting(key, name) {
        FC.settings[key] = !FC.settings[key];
        FC.showToast(`${name}: ${FC.settings[key] ? 'ON' : 'OFF'}`);
        // Trigger save in storage module (if created) or here
        localStorage.setItem('fc_settings', JSON.stringify(FC.settings));
        this.buildMenu();
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
                ${kbKey ? `<div class="fc-kb" id="kb-${kbKey}">${FC.keybinds[kbKey].replace('Key','')}</div>` : ''}
                <div class="fc-tog ${FC.settings[settingKey] ? 'on' : ''}"></div>
            </div>
        `;

        row.onclick = (e) => {
            if (e.target.classList.contains('fc-kb')) {
                this.listeningFor = kbKey;
                e.target.textContent = '...';
                e.target.classList.add('listening');
                return;
            }
            this.toggleSetting(settingKey, label);
        };
        return row;
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
        body.appendChild(this.makeRow('Hjar Detection', 'Color-changing crosshair', 'hjarEnabled', 'hjar'));
        body.appendChild(this.makeRow('Auto Action', 'Auto shoot or chat', 'autoEnabled', 'autoAct'));
        
        body.appendChild(this.createSection('Visuals'));
        body.appendChild(this.makeRow('Custom Crosshair', 'Replacement crosshair', 'xhairEnabled', 'xhair'));
        
        // Add more rows as needed
    },

    createSection(name) {
        const div = document.createElement('div');
        div.className = 'fc-sec';
        div.textContent = name;
        return div;
    }
});
