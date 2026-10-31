import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BASE_KNOWLEDGE = `
ZAHNKULTUR BY DR. JOACHIM KRAUS
Praxis für Zahnmedizin in Korntal-Münchingen bei Stuttgart.
Adresse: Eisenbahnstraße 15 (Alter Bahnhof), 70825 Korntal-Münchingen.
Telefon: +49 (0) 7150 916 42 70.
E-Mail: info@zahnkultur-kraus.de.
Website: https://www.zahnkultur-kraus.de/

PHILOSOPHIE
Die Praxis wurde laut Website im Jahr 2000 von Dr. med. dent. Joachim Kraus gegründet.
Die Praxis beschreibt ihren Ansatz mit Technologie, Qualität, Schnelligkeit und Zufriedenheit.
Sie möchte Behandlungen möglichst ohne unnötige Wartezeiten, mit ausreichend Zeit und Ruhe für Patientinnen und Patienten organisieren.
Die Website beschreibt eine moderne, digital ausgerichtete Praxis und die Versorgung der gesamten Familie.

SPRECHZEITEN
Montag 08:00–12:00 und 13:00–17:00
Dienstag 08:00–12:00 und 13:00–17:00
Mittwoch 08:00–12:00 und 13:00–17:00
Donnerstag 08:00–13:00
Freitag 08:00–12:00 und 13:00–17:00
Weitere Sprechzeiten nach individueller Vereinbarung.

LEISTUNGEN
Ästhetische Zahnbehandlung, CMD (Craniomandibuläre Dysfunktion), Kieferorthopädie, Lasertechnologie, Mikroskopie, Parodontologie, Prophylaxe und Zahnersatz.
Die Website nennt außerdem Alignertherapie und verschiedene digitale Behandlungsmethoden.

TECHNOLOGIE
Die Website beschreibt 3D-Scans, digitales Röntgen, intraorale Kameras, CEREC und Lasertechnologie.
CEREC wird als Möglichkeit beschrieben, hochwertige Keramikrestaurationen wie Kronen, Inlays und Veneers in einer Sitzung herzustellen.
Mikroskopie wird besonders für präzise Arbeiten, unter anderem im Bereich Endodontie, beschrieben.

ÄSTHETIK
Die Praxis bietet unter anderem Dental Bleaching und weitere ästhetische Zahnbehandlungen an.

TEAM
Dr. med. dent. Joachim Kraus – Zahnarzt und Praxis-Inhaber.
Monia Rametta – Prophylaxe-Expertin | ZMP.
Elena Tschesnow – Prophylaxe-Expertin.
Aysegül Sen – Prophylaxe-Expertin.
Viktor Würfel-Kraus – Praxismanagement.
Delia Chimenti – Verwaltungsexpertin | ZMV.

WICHTIGE REGELN
Du bist ein Informationsassistent der Zahnarztpraxis, kein Ersatz für eine Zahnärztin/einen Zahnarzt.
Keine Ferndiagnosen, keine definitive Beurteilung von Röntgenbildern ohne Befund, keine individuellen Therapieentscheidungen und keine erfundenen Preise oder medizinischen Versprechen.
Bei Beschwerden darfst du allgemeine Informationen geben und zur Untersuchung in der Praxis raten.
Bei starken akuten Beschwerden, starker Blutung, schweren Verletzungen, Atemproblemen oder anderen medizinischen Notfällen: sofort medizinische Notfallhilfe bzw. 112; bei zahnmedizinischen Problemen außerhalb der Praxiszeiten zusätzlich den regional zuständigen zahnärztlichen Notdienst nutzen.
Bei Medikamenten, Schwangerschaft, Vorerkrankungen oder individuellen Behandlungsfragen keine individuelle Anweisung geben, sondern auf die behandelnde Praxis bzw. medizinisches Fachpersonal verweisen.
`;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: {...cors, "Content-Type":"application/json"} });
}
function b64(bytes: Uint8Array) {
  let s=""; for(const b of bytes) s+=String.fromCharCode(b);
  return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
async function sign(secret:string, exp:number) {
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const payload=`zahnkultur-admin.${exp}`;
  const sig=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(payload));
  return `${payload}.${b64(new Uint8Array(sig))}`;
}
async function verify(secret:string, token:string) {
  try {
    const p=token.split("."); if(p.length!==3||p[0]!=="zahnkultur-admin") return false;
    const exp=Number(p[1]); if(!Number.isFinite(exp)||exp<Date.now()) return false;
    const e=await sign(secret,exp), a=new TextEncoder().encode(e.split(".")[2]), b=new TextEncoder().encode(p[2]);
    if(a.length!==b.length) return false; let d=0; for(let i=0;i<a.length;i++) d|=a[i]^b[i]; return d===0;
  } catch { return false; }
}
async function hash(s:string) {
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))).map(b=>b.toString(16).padStart(2,"0")).join("");
}
function secretLike(s:string) { return /(api[_ -]?key|service[_ -]?role|access[_ -]?token|refresh[_ -]?token|passwort|password|secret|bearer\s+[a-z0-9._-]{12,})/i.test(s); }
function slug(s:string) { return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9äöüß\s_-]/gi,"").replace(/\s+/g,"_").replace(/_+/g,"_").slice(0,80).replace(/^_+|_+$/g,"")||"info"; }

async function rows(url:string,key:string,filter="") {
  const r=await fetch(url+"/rest/v1/zahnkultur_ai_knowledge?select=id,fact_key,fact_value,source,updated_at"+filter+"&order=fact_key.asc",{headers:{apikey:key,Authorization:"Bearer "+key}});
  if(!r.ok) return []; const d=await r.json(); return Array.isArray(d)?d:[];
}
async function save(url:string,key:string,message:string,aiKey:string,aiUrl:string,model:string) {
  if(secretLike(message)) return {count:0,facts:[],error:"Geheime Zugangsdaten oder Tokens werden nicht gespeichert."};

  const instruction = message.replace(/^\\s*speichern\\s*:\\s*/i,"").trim();
  let facts:any[]=[];

  if(aiKey) {
    try {
      const r=await fetch(aiUrl,{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+aiKey},
        body:JSON.stringify({
          model,
          temperature:0,
          max_tokens:500,
          messages:[
            {role:"system",content:'Du bist der Speicher-Assistent des Zahnkultur-Admin-Bereichs. Der Administrator möchte eine Information dauerhaft in der Wissensbasis speichern. Er kann natürlich formulieren, z.B. "Die Praxis bietet ab sofort Bleaching an" oder "Merke dir, dass Samstag Termine möglich sind". Erkenne die konkrete dauerhaft speicherbare Information auch dann, wenn das Wort "Speichern" nicht vorkommt. Antworte ausschließlich als JSON: {"facts":[{"key":"kurzer_begriff","value":"vollständiger Fakt"}]}. Maximal 10 Fakten. Keine Passwörter, API-Schlüssel, Tokens, Geheimnisse oder Patientendaten. Wenn keine dauerhaft speicherbare Information enthalten ist: {"facts":[]}.',},
            {role:"user",content:instruction}
          ]
        })
      });
      if(r.ok){
        const d=await r.json();
        let raw=String(d?.choices?.[0]?.message?.content||"").trim();
        const a=raw.indexOf("{"), b=raw.lastIndexOf("}");
        if(a>=0&&b>a) raw=raw.slice(a,b+1);
        try {
          const p=JSON.parse(raw);
          facts=Array.isArray(p.facts)?p.facts
            .filter((x:any)=>x&&String(x.key||"").trim()&&String(x.value||"").trim()&&!secretLike(String(x.value)))
            .slice(0,10):[];
        } catch {}
      }
    } catch {}
  }

  if(!facts.length){
    const v=instruction.replace(/^\\s*(?:speichere|merken|merke dir|füge hinzu|hinzufügen|notiere|notier|remember)\\s*(?:bitte)?\\s*:?[\\s-]*/i,"").trim();
    if(v && /^(?:speicher|merke|merken|hinzufügen|hinzufuegen|füge|fuege|notiere|notier|remember)\\b/i.test(instruction)) {
      facts=[{key:v.slice(0,80),value:v}];
    }
  }

  const saved:any[]=[];
  for(const f of facts){
    const k=slug(String(f.key)), v=String(f.value).trim();
    if(!k||!v||secretLike(v)) continue;
    const r=await fetch(
      url+"/rest/v1/zahnkultur_ai_knowledge?on_conflict=fact_key",
      {
        method:"POST",
        headers:{
          apikey:key,
          Authorization:"Bearer "+key,
          "Content-Type":"application/json",
          Prefer:"resolution=merge-duplicates,return=representation"
        },
        body:JSON.stringify({fact_key:k,fact_value:v,source:"admin",updated_at:new Date().toISOString()})
      }
    );
    if(r.ok){
      const d=await r.json().catch(()=>[]);
      if(Array.isArray(d)&&d.length) saved.push({key:k,value:v});
    }
  }
  return {count:saved.length,facts:saved};
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
  if(req.method!=="POST") return json({error:"Nur POST ist erlaubt."},405);
  try{
    const body=await req.json();
    const mode=typeof body.mode==="string"?body.mode:"";
    const message=typeof body.message==="string"?body.message.trim():"";
    if(mode!=="ping"&&mode!=="ai-test"&&!message)return json({error:"message fehlt."},400);
    const first=body.isFirstMessage===true;
    const token=typeof body.adminToken==="string"?body.adminToken:"";
    const requested=typeof body.model==="string"?body.model:"default";
    const aiKey=Deno.env.get("AI_API_KEY")||Deno.env.get("Zahnkultur_ai")||Deno.env.get("ZAHNKULTUR_AI")||"";
    const aiUrl=Deno.env.get("AI_API_URL")||"https://openrouter.ai/api/v1/chat/completions";
    const defaultModel=Deno.env.get("AI_MODEL")||"openrouter/free";
    const modelMap:any={"default":defaultModel,"qwen/qwen-2.5-72b-instruct":"qwen/qwen-2.5-72b-instruct","google/gemma-3-27b-it":"google/gemma-3-27b-it","meta-llama/llama-3.3-8b-instruct":"meta-llama/llama-3.3-8b-instruct"};
    const model=modelMap[requested]||defaultModel;
    const url=Deno.env.get("SUPABASE_URL")||"";
    const key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
    const adminSecret=Deno.env.get("ZAHNKULTUR_ADMIN_SECRET")||key;
    const adminHash=Deno.env.get("ZAHNKULTUR_ADMIN_TRIGGER_HASH")||"a3800bef8a7788de7fac9a09b54805fec25fdfa048bf97829f20c50f0c2cfb35";

    if(mode==="ping"){
      return json({ok:true,type:"ping",backend:"ok",aiConfigured:!!aiKey,model,aiCall:false,timestamp:new Date().toISOString()});
    }

    if(mode==="ai-test"){
      if(!aiKey)return json({ok:true,aiResponded:false,reply:"Die KI-Schnittstelle ist nicht eingerichtet."});
      const test=await fetch(aiUrl,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+aiKey,"HTTP-Referer":"https://lordlolqdh.github.io/Zahnkultur-AI/","X-Title":"Zahnkultur AI Funktionstest"},body:JSON.stringify({model,temperature:0,max_tokens:20,messages:[{role:"system",content:"Du bist in einem technischen Funktionstest. Antworte sehr kurz."},{role:"user",content:"Antworte exakt mit: Zahnkultur AI Test OK"}]})});
      if(!test.ok)return json({ok:false,aiResponded:false,reply:"Der KI-Anbieter hat den Funktionstest abgelehnt.",status:test.status},502);
      const td=await test.json();
      const reply=String(td?.choices?.[0]?.message?.content||"").trim();
      return json({ok:true,aiResponded:!!reply,reply:reply||"Keine Antwort erhalten.",model});
    }

    if(await hash(message)===adminHash){
      const t=await sign(adminSecret,Date.now()+30*60*1000);
      return json({ok:true,adminToken:t,reply:"Admin-Modus aktiviert.\n\nBefehle:\nSpeichern: <Information>\nSuchen: <Begriff>\nAlle anzeigen\nLöschen: <Begriff>\nLöschen: alle\n/exit"});
    }
    const isAdmin=!!token&&await verify(adminSecret,token);
    if(isAdmin){
      const m=message;
      const sm=m.match(/^suchen\s*:\s*(.+)$/i)||m.match(/^suche\s+(.+)$/i);
      const dm=m.match(/^(?:löschen|loeschen|lösche|loesche)\s*:\s*(.+)$/i)||m.match(/^(?:löschen|loeschen|lösche|loesche)\s+(.+)$/i);
      if(sm){
        const term=sm[1].trim(), enc=encodeURIComponent("%"+term+"%");
        const data=await rows(url,key,"&source=eq.admin&or=(fact_key.ilike."+enc+",fact_value.ilike."+enc+")");
        return json({ok:true,reply:data.length?data.map((x:any,i:number)=>`${i+1}. ${x.fact_key}: ${x.fact_value}`).join("\n"):`Keine gespeicherte Information zu "${term}" gefunden.`});
      }
      if(/^(alle anzeigen|alle|liste|wissensbasis)$/i.test(m)){
        const data=await rows(url,key,"&source=eq.admin");
        return json({ok:true,reply:data.length?data.map((x:any,i:number)=>`${i+1}. ${x.fact_key}: ${x.fact_value}`).join("\n"):"Keine zusätzlichen Informationen gespeichert."});
      }
      if(dm){
        const term=dm[1].trim(), filter=term.toLowerCase()==="alle"?"&source=eq.admin":"&source=eq.admin&or=(fact_key.ilike."+encodeURIComponent("%"+term+"%")+",fact_value.ilike."+encodeURIComponent("%"+term+"%")+")";
        const r=await fetch(url+"/rest/v1/zahnkultur_ai_knowledge?"+filter,{method:"DELETE",headers:{apikey:key,Authorization:"Bearer "+key,Prefer:"return=representation"}});
        const d=r.ok?await r.json():[]; return json({ok:true,reply:Array.isArray(d)&&d.length?`${d.length} Information(en) gelöscht.`:"Keine passende Information gefunden."});
      }
      const n=await save(url,key,m,aiKey,aiUrl,defaultModel);
      return json({ok:true,reply:n?`${n} Information(en) gespeichert.`:"Keine speicherbare kundenrelevante Information erkannt."});
    }

    let extra="";
    if(url&&key){const data=await rows(url,key,"&source=eq.admin"); extra=data.map((x:any)=>x.fact_key+": "+x.fact_value).join("\n");}
    const intro="Hallo! Wir sind der digitale Assistent von Zahnkultur. Wie können wir Ihnen helfen?";
    if(!aiKey) return json({ok:true,reply:intro+"\n\nDie Praxisinformationen sind verfügbar, aber die KI-Schnittstelle ist noch nicht eingerichtet."});
    const r=await fetch(aiUrl,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+aiKey,"HTTP-Referer":"https://lordlolqdh.github.io/Zahnkultur-AI/","X-Title":"Zahnkultur AI"},body:JSON.stringify({model,messages:[
      {role:"system",content:`Du bist der digitale Assistent von Zahnkultur by Dr. Joachim Kraus in Korntal-Münchingen. Antworte ausschließlich aus Sicht der Praxis in der Wir-Form (wir/uns/unsere). Verwende niemals die Ich-Form und niemals Du-Form für die Praxis. Antworte auf Deutsch, freundlich, präzise und verständlich. Nutze ausschließlich die Wissensbasis. Keine Ferndiagnosen und keine erfundenen medizinischen Fakten. Bei individuellen Beschwerden nur allgemeine Information und Empfehlung zur Untersuchung. Bei Notfällen auf 112 bzw. medizinische Notfallhilfe hinweisen. Nenne die Praxis-Kontaktdaten, wenn es für die Frage sinnvoll ist. Keine privaten Daten. Keine Nachrichten senden. Du kannst erklären, Leistungen erläutern, bei der Orientierung helfen, Öffnungszeiten und Kontakt nennen und Fragen zur Praxis beantworten.\n\nFESTE WISSENSBASIS:\n${BASE_KNOWLEDGE}\n\nZUSÄTZLICHE ADMIN-INFORMATIONEN:\n${extra||"(keine)"}`},
      ...(Array.isArray(body.conversation)?body.conversation.slice(-8).map((x:any)=>({role:x.role==="assistant"?"assistant":"user",content:String(x.content||"")})):[]),
      {role:"user",content:message}
    ]})});
    if(!r.ok)return json({error:"Die KI ist momentan nicht verfügbar. Bitte versuchen Sie es gleich noch einmal oder kontaktieren Sie die Praxis direkt.",status:r.status},502);
    const d=await r.json(); let reply=String(d?.choices?.[0]?.message?.content||"Ich konnte gerade keine Antwort erzeugen. Bitte kontaktieren Sie die Praxis direkt.");
    reply=reply.replace(/^\s*[*•-]\s*/gm,"").replace(/\n{3,}/g,"\n\n").trim();
    if(!reply || reply.length<2) return json({error:"Die KI hat keine verwertbare Antwort geliefert. Bitte versuchen Sie es erneut.",status:502},502);
    return json({ok:true,reply:first?intro+"\n\n"+reply:reply,model});
  }catch(e){return json({error:"Interner Fehler."},500)}
});