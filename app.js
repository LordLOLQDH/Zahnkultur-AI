const VERSION="1.0";
const ENDPOINT="https://eopvkwhcgznvubesaszv.supabase.co/functions/v1/zahnkultur-ai";
const messages=document.querySelector("#messages"),form=document.querySelector("#chat"),input=document.querySelector("#input");
let messageCount=Number(sessionStorage.getItem("zahnkultur_ai_message_count")||"0"),adminToken="",adminMode=false,selectedModel=localStorage.getItem("zahnkultur_ai_model")||"default";
const conversation=[];
function add(text,cls){const el=document.createElement("div");el.className="msg "+cls;el.textContent=text;messages.appendChild(el);el.scrollIntoView({behavior:"smooth",block:"nearest"});return el}
function setStatus(){const s=document.querySelector("#status");if(s)s.textContent=adminMode?"Admin-Modus":"Online"}
function clean(text){return String(text||"").replace(/^\\s*Hallo!\\s*Ich bin dein persönlicher Zahnkultur-Assistent\\.\\s*/i,"").trim()}
document.querySelector("#updateApp").addEventListener("click",()=>{const b=document.querySelector("#updateApp");b.disabled=true;b.textContent="Aktualisiere …";sessionStorage.removeItem("zahnkultur_ai_message_count");location.replace(location.origin+location.pathname+"?cache="+Date.now())});
document.querySelectorAll("[data-q]").forEach(b=>b.addEventListener("click",()=>{input.value=b.dataset.q;form.requestSubmit()}));
async function ask(message,first){const r=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message,isFirstMessage:first,adminToken,model:selectedModel,conversation})});const d=await r.json();if(!r.ok)throw Error(d.error||"Serverfehler");return d}
form.addEventListener("submit",async e=>{e.preventDefault();e.stopPropagation();const message=input.value.trim();if(!message)return;input.value="";add(message,"user");
if(message.toLowerCase()==="/exit"){adminToken="";adminMode=false;setStatus();add("Admin-Modus beendet.","ai");input.focus();return}
const first=messageCount===0;messageCount++;sessionStorage.setItem("zahnkultur_ai_message_count",String(messageCount));const pending=add("…","ai");
try{const d=await ask(message,first);if(d.adminToken){adminToken=d.adminToken;adminMode=true;setStatus();pending.textContent=d.reply||"Admin-Modus aktiviert."}else{pending.textContent=first?clean(d.reply):d.reply||"Keine Antwort erhalten.";conversation.push({role:"user",content:message},{role:"assistant",content:pending.textContent})}}catch(err){console.error(err);pending.textContent="Die Anfrage konnte gerade nicht verarbeitet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie die Praxis direkt."}input.focus()});