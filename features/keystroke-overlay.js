(function () {
'use strict';

let container;
let keyboard;
let keyMap = {};
let fullLayout = true;

const wait = setInterval(()=>{
if(document.body){
clearInterval(wait);
init();
}
},100);

function init(){

injectCSS();

container=document.createElement("div");
container.className="keystrokes-container";
document.body.appendChild(container);

createToggle();
loadLayout();
enableDrag();

document.addEventListener("keydown",e=>{
const k=mapKey(e);
if(keyMap[k]) keyMap[k].classList.add("active");
});

document.addEventListener("keyup",e=>{
const k=mapKey(e);
if(keyMap[k]) keyMap[k].classList.remove("active");
});

document.addEventListener("mousedown",e=>{
let label="";
if(e.button===0) label="LMB";
if(e.button===2) label="RMB";
if(e.button===1) label="MMB";
if(keyMap[label]) keyMap[label].classList.add("active");
});

document.addEventListener("mouseup",e=>{
let label="";
if(e.button===0) label="LMB";
if(e.button===2) label="RMB";
if(e.button===1) label="MMB";
if(keyMap[label]) keyMap[label].classList.remove("active");
});

container.addEventListener("contextmenu",e=>e.preventDefault());

}

function injectCSS(){

const style=document.createElement("style");

style.textContent=`

/* container */

.keystrokes-container{
position:fixed;
top:120px;
left:120px;
display:flex;
flex-direction:column;
gap:6px;
z-index:9999999;
font-family:monospace;
user-select:none;
cursor:move;
}

/* keyboard */

.keyboard{
display:flex;
flex-direction:column;
gap:2px;
background:#2b2b2b;
padding:6px;
}

/* rows */

.row{
display:flex;
gap:2px;
}

/* key */

.key{
--key-color:#6f8a63;

min-width:42px;
height:34px;

display:flex;
align-items:center;
justify-content:center;

background:var(--key-color);
color:#eee;

font-size:12px;

border:1px solid rgba(0,0,0,.4);
transition:.1s;
}

/* pressed */

.key.active{
filter:brightness(1.4);
transform:scale(.96);
}

/* sizes */

.key.wide{min-width:70px}
.key.space{min-width:340px}

/* toggle */

.toggle-btn{
background:#111;
color:white;
padding:4px 8px;
cursor:pointer;
width:fit-content;
}

/* CUSTOM KEY COLORS */

.key[data-key="SPACE"]{ --key-color:#a94442; }

.key[data-key="W"]{ --key-color:#3a6ea5; }
.key[data-key="A"]{ --key-color:#3a6ea5; }
.key[data-key="S"]{ --key-color:#3a6ea5; }
.key[data-key="D"]{ --key-color:#3a6ea5; }

.key[data-key="LMB"]{ --key-color:#8e44ad; }
.key[data-key="RMB"]{ --key-color:#8e44ad; }

.key[data-key="Q"]{ --key-color:#d4a017; }
.key[data-key="E"]{ --key-color:#d4a017; }

`;

document.head.appendChild(style);

}

function createToggle(){

const btn=document.createElement("div");
btn.className="toggle-btn";
btn.textContent="🔁";

btn.onclick=()=>{
fullLayout=!fullLayout;
loadLayout();
};

container.appendChild(btn);

}

function loadLayout(){

if(keyboard) keyboard.remove();
keyMap={};

keyboard=fullLayout
?buildFullKeyboard()
:buildCompactKeyboard();

container.appendChild(keyboard);

}

function createKey(label,extra=""){

const k=document.createElement("div");
k.className="key "+extra;
k.textContent=label;
k.dataset.key=label;

keyMap[label]=k;

return k;

}

function buildFullKeyboard(){

const hud=document.createElement("div");
hud.className="keyboard";

const layout=[

['ESC','F1','F2','F3','F4','','F5','F6','F7','F8','','F9','F10','F11','F12'],
['~','1','2','3','4','5','6','7','8','9','0','-','=','BACK'],
['TAB','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],
['CAPS','A','S','D','F','G','H','J','K','L',';',"'",'ENTER'],
['SHIFT','Z','X','C','V','B','N','M',',','.','/','SHIFT'],
['CTRL','ALT','SPACE','ALT','CTRL']

];

layout.forEach(r=>{

const row=document.createElement("div");
row.className="row";

r.forEach(label=>{

if(!label){
const s=document.createElement("div");
s.style.width="10px";
row.appendChild(s);
return;
}

let extra="";

if(['TAB','CAPS','SHIFT','CTRL','ALT','BACK','ENTER'].includes(label))
extra="wide";

if(label==="SPACE")
extra="space";

row.appendChild(createKey(label,extra));

});

hud.appendChild(row);

});

const mouseRow=document.createElement("div");
mouseRow.className="row";

mouseRow.appendChild(createKey("LMB","wide"));
mouseRow.appendChild(createKey("RMB","wide"));

hud.appendChild(mouseRow);

return hud;

}

function buildCompactKeyboard(){

const hud=document.createElement("div");
hud.className="keyboard";

function row(){
const r=document.createElement("div");
r.className="row";
return r;
}

let r1=row();
r1.append(createKey("LMB","wide"),createKey("W"),createKey("RMB","wide"));

let r2=row();
r2.append(createKey("A"),createKey("S"),createKey("D"));

let r3=row();
r3.append(createKey("Q"),createKey("E"));

let r4=row();
r4.append(createKey("SHIFT","wide"));

let r5=row();
r5.append(createKey("SPACE","space"));

hud.append(r1,r2,r3,r4,r5);

return hud;

}

function mapKey(e){

if(e.key===" ") return "SPACE";
if(e.key==="Shift") return "SHIFT";
if(e.key==="Control") return "CTRL";
if(e.key==="Alt") return "ALT";
if(e.key==="Enter") return "ENTER";
if(e.key==="Tab") return "TAB";
if(e.key==="Backspace") return "BACK";

return e.key.length===1
?e.key.toUpperCase()
:e.key.toUpperCase();

}

function enableDrag(){

let drag=false,ox=0,oy=0;

container.addEventListener("mousedown",e=>{

if(e.target.closest(".key")||e.target.closest(".toggle-btn")) return;

drag=true;

const rect=container.getBoundingClientRect();
ox=e.clientX-rect.left;
oy=e.clientY-rect.top;

});

document.addEventListener("mousemove",e=>{
if(!drag) return;

container.style.left=(e.clientX-ox)+"px";
container.style.top=(e.clientY-oy)+"px";

});

document.addEventListener("mouseup",()=>drag=false);

}

})();