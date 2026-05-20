// File: ui/toast.js
FC.register('toast', {
    timer: null,

    init() {
        const t = document.createElement('div');
        t.id = 'fc-toast';
        document.body.appendChild(t);
        
        // Expose to global FC so other modules can use it
        FC.showToast = (msg) => this.show(msg);
    },

    show(msg) {
        const el = document.getElementById('fc-toast');
        if (!el) return;
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(this.timer);
        this.timer = setTimeout(() => el.classList.remove('show'), 2200);
    }
});
