// File: ui/menu.js
FC.register('menu', {
    isOpen: false,
    listeningFor: null,

    init() {
        // 1. Sync Settings from Storage
        const saved = localStorage.getItem('fc_settings');
        if (saved) FC.settings = Object.assign(FC.settings, JSON.parse(saved));

        // 2. Sync Binds
        FC.binds = JSON.parse(localStorage.getItem('fc_kb') || '{"hjar":"KeyH", "xhair":"KeyX", "auto":"KeyF"}');
        
        this.createStatus();
        this.buildMenu();
        this.setupKeyHandlers();
    },

    setupKeyHandlers() {
        // Using 'keyup' for maximum compatibility with Kirka's engine
        window.addEventListener('keyup', (e) => {
            // Prevent triggering if typing in chat
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

            // Handle Rebinding
            if (this.listeningFor) {
                FC.binds[this.listeningFor] = e.code;
                localStorage.setItem('fc_kb', JSON.stringify(FC.binds));
                if (FC.showToast) FC.showToast(`Bind: ${this.listeningFor} -> ${e.code}`);
                this.listeningFor = null;
                this.buildMenu();
                return;
            }

            // Right Shift to open
            if (e.code === 'ShiftRight') {
                this.isOpen = !this.isOpen;
                const menu = document.getElementById('fc-menu');
                if (menu) {
                    menu.classList.toggle('open', this.isOpen);
                    if (this.isOpen) document.exitPointerLock?.();
                }
            }

            // Quick Toggle Keys
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

        menu.innerHTML = `
            <div id="fc-menu-title">☠ Fallen Client<span>RIGHT SHIFT = MENU &bull; CLICK KEY = REBIND</span></div>
            <div id="fc-menu-body">
                <div class="fc-sec">Combat</div>
                ${this.renderRow('Hjar Detection', 'hjarEnabled', 'hjar')}
                ${this.renderRow('Auto Action', 'autoEnabled', 'auto')}
                <div class="fc-sec">Visuals</div>
                ${this.renderRow('Custom Crosshair', 'xhairEnabled', 'xhair')}
            </div>
        `;
    },

    renderRow(label, settingKey, bindKey) {
        // Generates the HTML for a menu setting row
        const active = FC.settings[settingKey] ? 'on' : '';
        const keyName = FC.binds[bindKey].replace('Key', '');
        
        // We return the string and then set it via innerHTML in buildMenu
        const rowId = `row-${settingKey}`;
        
        // Add events after a short delay to ensure DOM is ready
        setTimeout(() => {
            const el = document.getElementById(rowId);
            if (el) {
                el.onclick = (e) => {
                    if (e.target.classList.contains('fc-kb')) {
                        this.listeningFor = bindKey;
                        e.target.textContent = '...';
                        return;
                    }
                    this.toggle(settingKey, label);
                };
            }
        }, 50);

        return `
            <div class="fc-row" id="${rowId}">
                <div class="fc-label">${label}</div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div class="fc-kb">${keyName}</div>
                    <div class="fc-tog ${active}"></div>
                </div>
            </div>
        `;
    },

    createStatus() {
        const s = document.createElement('div');
        s.id = 'fc-status';
        s.style = "position:fixed; bottom:10px; left:10px; color:cyan; font-family:monospace; font-size:11px; z-index:99999; pointer-events:none;";
        s.textContent = `☠ FC v${FC.version} | Engine Ready`;
        document.body.appendChild(s);
    }
});
