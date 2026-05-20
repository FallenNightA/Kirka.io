// File: ui/css.js
FC.register('css', {
    init() {
        const style = document.createElement('style');
        style.textContent = `
            #fc-menu {
                display:none; position:fixed; top:50%; left:50%;
                transform:translate(-50%,-50%); z-index:999999; width:340px;
                background:linear-gradient(160deg,#001820,#001e28);
                border:2px solid cyan; border-radius:14px; font-family:monospace;
                color:#e0ffff; box-shadow:0 0 40px rgba(0,255,255,0.15),0 8px 32px rgba(0,0,0,0.8);
                user-select:none; overflow:hidden;
            }
            #fc-menu.open { display:block; }
            #fc-menu-title {
                background:rgba(0,8,16,0.95); padding:12px 16px; font-size:13px; font-weight:bold;
                letter-spacing:3px; color:cyan; border-bottom:1px solid rgba(0,255,255,0.2);
                text-align:center; text-transform:uppercase; text-shadow:0 0 10px cyan;
            }
            #fc-menu-body { padding:10px 12px; display:flex; flex-direction:column; gap:5px; max-height:78vh; overflow-y:auto; }
            #fc-menu-body::-webkit-scrollbar { width:3px; }
            #fc-menu-body::-webkit-scrollbar-thumb { background:rgba(0,255,255,0.25); border-radius:2px; }

            .fc-sec { font-size:9px; letter-spacing:2px; color:rgba(0,255,255,0.3); text-transform:uppercase; padding:5px 2px 2px; border-bottom:1px solid rgba(0,255,255,0.08); margin-top:2px; }

            .fc-row { display:flex; justify-content:space-between; align-items:center; background:rgba(0,255,255,0.03); border:1px solid rgba(0,255,255,0.1); border-radius:8px; padding:8px 10px; cursor:pointer; transition:background 0.15s; gap:8px; }
            .fc-row:hover { background:rgba(0,255,255,0.08); }
            .fc-label { font-size:12px; color:#ccffff; font-weight:bold; }
            .fc-desc { font-size:9px; color:rgba(0,255,255,0.3); margin-top:1px; }

            .fc-kb { font-size:9px; padding:2px 7px; background:rgba(0,255,255,0.07); border:1px solid rgba(0,255,255,0.2); border-radius:4px; color:rgba(0,255,255,0.5); cursor:pointer; min-width:22px; text-align:center; }
            .fc-kb.listening { background:rgba(255,220,0,0.15); border-color:gold; color:gold; animation: fc-blink 0.5s infinite; }
            @keyframes fc-blink { 0%,100% { opacity:1 } 50% { opacity:0.4 } }

            .fc-tog { width:38px; height:20px; border-radius:10px; background:rgba(0,255,255,0.1); border:1px solid rgba(0,255,255,0.25); position:relative; transition: 0.2s; }
            .fc-tog.on { background:cyan; border-color:cyan; box-shadow:0 0 6px cyan; }
            .fc-tog::after { content:''; position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%; background:rgba(0,255,255,0.3); transition: 0.2s; }
            .fc-tog.on::after { left:20px; background:#001820; }

            input[type=range] { width:100%; accent-color:cyan; cursor:pointer; }
            input[type=text], select { background:rgba(0,20,30,0.9); border:1px solid rgba(0,255,255,0.25); color:cyan; border-radius:5px; padding:4px; font-family:monospace; }

            #fc-toast {
                position:fixed; bottom:22px; left:50%; transform:translateX(-50%) translateY(60px);
                background:rgba(0,18,28,0.97); border:1px solid cyan; border-radius:9px; color:cyan;
                font-family:monospace; font-size:13px; padding:8px 18px; z-index:9999999;
                opacity:0; transition:0.22s; pointer-events:none; white-space:nowrap; box-shadow:0 0 12px cyan;
            }
            #fc-toast.show { transform:translateX(-50%) translateY(0); opacity:1; }

            #fc-status { position:fixed; top:8px; left:8px; z-index:99999; font-family:monospace; font-size:11px; color:cyan; }
        `;
        document.head.appendChild(style);
    }
});
