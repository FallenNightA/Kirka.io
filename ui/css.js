// File: ui/css.js
FC.register('css', {
    init() {
        const s = document.createElement('style');
        s.textContent = `
        #fc-menu {
            display:none; position:fixed; top:50%; left:50%;
            transform:translate(-50%,-50%); z-index:999999; width:340px;
            background:linear-gradient(160deg,#001820,#001e28);
            border:2px solid cyan; border-radius:14px; font-family:monospace;
            color:#e0ffff; box-shadow:0 0 40px rgba(0,255,255,0.15);
        }
        #fc-menu.open { display:block; }
        #fc-menu-title { background:rgba(0,8,16,0.95); padding:12px; font-size:14px; color:cyan; text-align:center; border-bottom:1px solid cyan; }
        #fc-menu-title span { display:block; font-size:9px; opacity:0.5; }
        #fc-menu-body { padding:10px; display:flex; flex-direction:column; gap:5px; }
        .fc-sec { font-size:10px; color:cyan; opacity:0.4; text-transform:uppercase; margin-top:5px; border-bottom:1px solid rgba(0,255,255,0.1); }
        .fc-row { display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:8px; border-radius:5px; cursor:pointer; }
        .fc-row:hover { background:rgba(0,255,255,0.05); }
        .fc-label { font-size:12px; }
        .fc-desc { font-size:9px; opacity:0.4; }
        .fc-kb { font-size:10px; background:rgba(0,255,255,0.1); padding:2px 5px; border-radius:3px; color:cyan; }
        .fc-tog { width:30px; height:15px; background:#222; border-radius:10px; position:relative; }
        .fc-tog.on { background:cyan; }
        .fc-tog::after { content:''; position:absolute; width:11px; height:11px; background:white; border-radius:50%; top:2px; left:2px; transition:0.2s; }
        .fc-tog.on::after { left:17px; }
        `;
        document.head.appendChild(s);
    }
});
