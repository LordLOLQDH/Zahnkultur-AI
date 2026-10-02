const VERSION="2.8";
const ENDPOINT="https://eopvkwhcgznvubesaszv.supabase.co/functions/v1/zahnkultur-ai";
const $=s=>document.querySelector(s),messages=$("#chatMessages"),form=$("#chat"),input=$("#input"),sendBtn=$("#sendBtn");
let messageCount=Number(sessionStorage.getItem("zahnkultur_ai_message_count")||"0"),adminToken="",conversation=[],busy=false;
const TERMS_KEY="zahnkultur_ai_terms_v1_2026";
function termsAccepted(){return localStorage.getItem(TERMS_KEY)==="accepted"}
function syncTermsGate(){
 const gate=$("#termsGate"),cb=$("#termsCheckbox"),btn=$("#termsAccept");
 if(!gate)return;
 const ok=termsAccepted();
 gate.classList.toggle("accepted",ok);
 if(cb)cb.checked=ok;
 if(btn){
  btn.disabled=!cb?.checked;
  btn.onclick=()=>{localStorage.setItem(TERMS_KEY,"accepted");gate.classList.add("accepted");input.disabled=false;sendBtn.disabled=false;document.querySelectorAll("[data-q]").forEach(b=>b.disabled=false);input.focus()};
  cb?.addEventListener("change",()=>btn.disabled=!cb.checked);
 }
 if(!ok){input.disabled=true;sendBtn.disabled=true;document.querySelectorAll("[data-q]").forEach(b=>b.disabled=true)}
}
function add(text,cls,copy=false){const wrap=document.createElement("div");wrap.className="msg-wrap";const el=document.createElement("div");el.className="msg "+cls;el.textContent=text;wrap.appendChild(el);if(copy&&cls==="ai"){const b=document.createElement("button");b.className="copy-btn";b.type="button";b.textContent="Antwort kopieren";b.onclick=async()=>{try{await navigator.clipboard.writeText(el.textContent);b.textContent="Kopiert";setTimeout(()=>b.textContent="Antwort kopieren",1200)}catch{}};wrap.appendChild(b)}messages.appendChild(wrap);messages.scrollTop=messages.scrollHeight;return el}
function status(t){$("#status").textContent=t}
function clean(t){return String(t||"").replace(/^\s*Hallo!\s*(?:Ich bin|Wir sind)\s+(?:dein|Ihr)\s+(?:persönlicher\s+)?(?:Zahnkultur-)?Assistent\.?\s*/i,"").replace(/[\*#_\`~]/g,"").replace(/^\s*>\s?/gm,"").replace(/^\s*(?:[-+•]|\d+[.)])\s+/gm,"").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/\n{3,}/g,"\n\n").trim()}
async function api(body){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);try{const r=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:controller.signal});let d={};try{d=await r.json()}catch{}if(!r.ok)throw Error(d.error||"Serverfehler");return d}finally{clearTimeout(timer)}}
function newChat(){messages.innerHTML="";messageCount=0;conversation=[];sessionStorage.removeItem("zahnkultur_ai_message_count");add("Hallo! Wir sind der digitale Assistent von Zahnkultur.\n\nWie können wir Ihnen helfen?","ai",true);input.focus()}
function updateApp(){status("Aktualisiere …");location.replace(location.pathname+"?v="+VERSION+"&cache="+Date.now())}
async function ping(){if(busy)return;status("Ping …");try{const d=await api({mode:"ping"});status(d.aiConfigured?"Backend + KI bereit":"Backend bereit · KI nicht konfiguriert");add("PONG — Backend erreichbar.\nKI-Konfiguration: "+(d.aiConfigured?"bereit":"nicht eingerichtet")+" .\nKein KI-Aufruf wurde für den Ping durchgeführt.","ai",true)}catch(e){status("Backend nicht erreichbar");add("PING FEHLGESCHLAGEN — Backend nicht erreichbar.","ai",true)}}
async function aiTest(){if(busy)return;status("AI-Test …");try{const d=await api({mode:"ai-test"});status(d.aiResponded?"AI antwortet":"AI nicht verfügbar");add("AI-TEST "+(d.aiResponded?"OK":"NICHT VERFÜGBAR")+"\n\n"+clean(d.reply||"Keine Antwort erhalten."),"ai",true)}catch(e){status("AI-Test fehlgeschlagen");add("AI-TEST FEHLGESCHLAGEN — "+(e.name==="AbortError"?"Zeitüberschreitung":e.message),"ai",true)}}
function showNews(){const key="zahnkultur_news_2_0";const popup=$("#newsPopup");const close=()=>{popup.classList.remove("show");sessionStorage.setItem(key,"closed")};$("#closeNews").onclick=close;$("#infoBtn").onclick=()=>popup.classList.add("show");popup.addEventListener("click",e=>{if(e.target===popup)close()});if(sessionStorage.getItem(key)!=="closed")requestAnimationFrame(()=>popup.classList.add("show"))}
function setOnline(){document.body.classList.remove("offline");status("Online")}
function setOffline(){document.body.classList.add("offline");status("Offline")}
$("#pingBtn").onclick=ping;$("#aiTestBtn").onclick=aiTest;$("#updateBtn").onclick=updateApp;
document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{if(!busy){input.value=b.dataset.q;form.requestSubmit()}});
window.addEventListener("online",setOnline);window.addEventListener("offline",setOffline);
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();input.focus()}if(e.key==="Escape"){$("#newsPopup")?.classList.remove("show")}});
form.onsubmit=async e=>{e.preventDefault();e.stopPropagation();if(!termsAccepted()||busy)return;const message=input.value.trim();if(!message)return;input.value="";if(message.toLowerCase()==="/exit"){adminToken="";status("Bereit");add("Admin-Modus beendet.","ai",true);return}if(message.toLowerCase()==="ping"){ping();return}busy=true;sendBtn.disabled=true;messageCount++;sessionStorage.setItem("zahnkultur_ai_message_count",String(messageCount));add(message,"user");const pending=add("","ai");pending.innerHTML='<span class="typing"><i></i><i></i><i></i></span>';status("Antwort wird erstellt …");try{const first=messageCount===1;const d=await api({message,isFirstMessage:first,adminToken,conversation});if(d.adminToken){adminToken=d.adminToken;pending.textContent=d.reply||"Admin-Modus aktiviert.";status("Admin-Modus")}else{const reply=clean(d.reply)||"Wir konnten gerade keine Antwort erhalten.";pending.textContent=reply;conversation.push({role:"user",content:message},{role:"assistant",content:reply});status("Bereit");const b=document.createElement("button");b.className="copy-btn";b.type="button";b.textContent="Antwort kopieren";b.onclick=async()=>{try{await navigator.clipboard.writeText(reply);b.textContent="Kopiert";setTimeout(()=>b.textContent="Antwort kopieren",1200)}catch{}};pending.parentElement.appendChild(b)}}catch(err){pending.textContent=err.name==="AbortError"?"Wir benötigen gerade etwas länger. Bitte versuchen Sie es erneut.":"Wir konnten die Anfrage gerade nicht verarbeiten. Bitte versuchen Sie es erneut.";status("Bereit")}finally{busy=false;sendBtn.disabled=false;input.focus()}};
newChat();syncTermsGate();if(!navigator.onLine)setOffline();showNews();