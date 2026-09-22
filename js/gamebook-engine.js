/* =========================================================
   ゲームエンジン
   ========================================================= */
const SAVE_KEY_PREFIX = "shakai_gamebook_save_v1_";
let SAVE_KEY = SAVE_KEY_PREFIX + "default";

function weightedPick(pool, n){
  // 重み付き非復元抽出（Math.random()^(1/weight) トリック）
  const scored = pool.map(e => ({e, score: Math.pow(Math.random(), 1/e.weight)}));
  scored.sort((a,b)=>b.score-a.score);
  return scored.slice(0,n).map(s=>s.e);
}

function buildTimeline(data){
  const eventMin = Number(data.meta.eventCountMin ?? 2);
  const eventMax = Number(data.meta.eventCountMax ?? 4);
  const targetEventCount = eventMin + Math.floor(Math.random() * Math.max(1, eventMax - eventMin + 1));
  const chosen = weightedPick(data.EVENTS, Math.min(targetEventCount, data.EVENTS.length));
  const timeline = [];
  data.STAGE_ORDER.forEach(stageKey=>{
    const req = data.CORE_SCENES[stageKey].flatMap(s=>{
      const core = {...s, kind:"core", stage:stageKey};
      const flow = data.FLOW_CHECKPOINTS && data.FLOW_CHECKPOINTS.find(f=>f.afterId===s.id);
      if(flow){
        const sequence = {...flow, kind:"sequence", stage:stageKey, choices:[...flow.choices].sort(()=>Math.random()-0.5)};
        return [core, sequence];
      }
      return [core];
    });
    const evs = chosen.filter(e=>e.stages.includes(stageKey)).map(e=>({
      id:e.id+"_"+stageKey, kind:"event", stage:stageKey,
      title:e.title, text:e.text, choices:e.choices, image:e.image,
      requiredLearning:e.requiredLearning, educationalIntent:e.educationalIntent,
      eventName:e.name
    }));
    const merged = [];
    const gap = evs.length>0 ? Math.max(1, Math.floor(req.length/(evs.length+1))) : 0;
    let ei = 0;
    req.forEach((scene,i)=>{
      merged.push(scene);
      if(evs.length>0 && (i+1)%gap===0 && ei<evs.length){ merged.push(evs[ei]); ei++; }
    });
    while(ei<evs.length){ merged.push(evs[ei]); ei++; }
    timeline.push(...merged);
  });
  return timeline;
}

let state = null;
let GAME_DATA = null; // {meta, timeline, index, log:[], phase:'scene'|'result'|'end', lastChoice:null}

function saveState(){
  try{
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      timelineIds: state.timeline.map(s=>s.id),
      timelineData: state.timeline,
      gameId: GAME_DATA.meta.id,
      index: state.index,
      log: state.log,
      status: state.status,
      failedStatus: state.failedStatus,
      naviMap: state.naviMap,
      phase: state.phase,
      lastChoice: state.lastChoice,
      sequenceFeedback: state.sequenceFeedback || null,
      nextSceneId: state.nextSceneId || null
    }));
  }catch(e){ /* 保存できなくてもゲームは続行 */ }
}
function loadSave(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}
function clearSave(){
  try{ localStorage.removeItem(SAVE_KEY); }catch(e){}
}

function statusMeta(){return GAME_DATA.meta.statuses||{};}
function learningToStatus(){return GAME_DATA.meta.learningToStatus||{};}
function initialStatus(){const m=statusMeta(),o={};Object.keys(m).forEach(k=>o[k]=Number(m[k].initial??3));return o;}
function effectForChoice(scene,index){
  // 原則：選択肢側に明示した effects を優先する。
  // 旧データとの互換用に、未設定の場合だけ学習内容から補完する。
  const map=learningToStatus();
  const keys=[...(new Set((scene.requiredLearning||[]).map(k=>map[k]).filter(Boolean)))];
  if(!keys.length)return{};
  if(keys.length===1)return{[keys[0]]:index===1?1:-1};
  const e={};
  if(index===0){e[keys[0]]=-1;e[keys[1]]=1;}
  else if(index===1){e[keys[0]]=1;e[keys[1]]=1;}
  else{e[keys[0]]=1;e[keys[1]]=-1;}
  return e;
}
function applyEffects(effects){const m=statusMeta();Object.keys(m).forEach(k=>{const min=Number(m[k].min??0),max=Number(m[k].max??5);state.status[k]=Math.max(min,Math.min(max,state.status[k]+Number(effects[k]||0)));});}
function failedStatus(){if(GAME_DATA.meta.gameOverOnZero===false)return null;const m=statusMeta();return Object.keys(m).find(k=>state.status[k]<=Number(m[k].min??0))||null;}
function startNewGame(){
  const pool = GAME_DATA.meta.navi || [];
  const naviMap = pool.map((_,i)=>i).sort(()=>Math.random()-0.5);
  state={timeline:buildTimeline(GAME_DATA),index:0,log:[],phase:"scene",status:initialStatus(),lastChoice:null,failedStatus:null,naviMap};
  saveState();render();
}
function resumeGame(){
  const s = loadSave();
  if(!s){ startNewGame(); return; }
  if(s.gameId && s.gameId !== GAME_DATA.meta.id) { startNewGame(); return; }
  state={timeline:s.timelineData,index:s.index,log:s.log,phase:s.phase||"scene",lastChoice:s.lastChoice||null,status:s.status||initialStatus(),failedStatus:s.failedStatus||null,naviMap:s.naviMap||null,sequenceFeedback:s.sequenceFeedback||null,nextSceneId:s.nextSceneId||null};
  render();
}

function currentScene(){ return state.timeline[state.index]; }

function chooseOption(choiceIndex){
  const scene=currentScene(),choice=scene.choices[choiceIndex];
  if(scene.kind==="sequence"){
    if(choice.correct){
      state.sequenceFeedback={correct:true,text:choice.feedback||"正解！次の仕事へ進もう。"};
      state.phase="sequenceResult";
      saveState();render();
    }else{
      state.sequenceFeedback={correct:false,text:choice.hint||`もう一度、${GAME_DATA.meta.flowTitle||"学習の流れ"}を思い出してみよう。`};
      saveState();render();
    }
    return;
  }
  const effects=choice.effects||effectForChoice(scene,choiceIndex),before={...state.status};
  applyEffects(effects);
  state.log.push({stage:scene.stage,id:scene.id,title:scene.title||scene.eventName,kind:scene.kind,choiceText:choice.text,result:choice.result,effects,before,after:{...state.status},sceneLearning:scene.requiredLearning||[]});
  state.lastChoice={...choice,effects,before,after:{...state.status}};
  state.failedStatus=failedStatus();
  state.nextSceneId=choice.nextSceneId||null;
  state.phase="result";saveState();render();
}

function goNext(){
  if(state.failedStatus && GAME_DATA.meta.gameOverOnZero!==false){state.phase="gameover";clearSave();render();return;}
  if(state.nextSceneId){
    const target=state.timeline.findIndex(s=>s.id===state.nextSceneId);
    state.index=target>=0?target:state.index+1;
    state.nextSceneId=null;
  }else{
    state.index++;
  }
  if(state.index>=state.timeline.length){state.phase="end";clearSave();}
  else state.phase="scene";
  saveState();render();
}

/* =========================================================
   画面描画
   ========================================================= */
const app = document.getElementById("app");

function naviForScene(scene){
  const pool = GAME_DATA.meta.navi || [];
  if(!pool.length) return null;
  const sceneIndex = state.timeline.findIndex(s=>s.id===scene.id);
  const index = state.naviMap && state.naviMap.length
    ? state.naviMap[sceneIndex % state.naviMap.length] % pool.length
    : Math.abs(hashString(scene.id)) % pool.length;
  const navi = {...pool[index]};
  if(state && state.phase === "result" && navi.resultSrc) navi.src = navi.resultSrc;
  else if(scene.kind === "event" && navi.eventSrc) navi.src = navi.eventSrc;
  return navi;
}
function hashString(str){ let h=0; for(let i=0;i<str.length;i++) h=((h<<5)-h)+str.charCodeAt(i)|0; return h; }

function renderFlowProgress(scene){
  const custom = GAME_DATA.meta.flowStages;
  if(custom && custom.length){
    const currentStage = GAME_DATA.STAGE_ORDER.indexOf(scene.stage);
    const box=document.createElement("div");
    box.className="flow-progress";
    box.innerHTML='<div class="flow-progress-title">'+(GAME_DATA.meta.flowTitle||"学習の流れ")+'</div><div class="flow-steps">'+custom.map((s,i)=>{
      const done=i<currentStage;
      const now=i===currentStage;
      const visible=done||now;
      return '<div class="flow-step '+(done?'done ':'')+(now?'now ':'')+(visible?'':'future')+'"><span class="flow-num">'+(visible?(i+1):'?')+'</span><span>'+(visible?s.label:'？')+'</span></div>';
    }).join('')+'</div>';
    return box;
  }
  const steps = [];
  GAME_DATA.STAGE_ORDER.forEach(stageKey=>{
    (GAME_DATA.CORE_SCENES[stageKey]||[]).forEach(s=>steps.push({id:s.id,title:s.title,stage:stageKey}));
  });
  const currentCoreIndex = steps.findIndex(s=>s.id===scene.id);
  const sequenceAfterIndex = scene.kind==="sequence" ? steps.findIndex(s=>s.id===scene.afterId) : -1;
  const completed = scene.kind==="sequence" && sequenceAfterIndex>=0 ? sequenceAfterIndex + 1 : currentCoreIndex >= 0 ? currentCoreIndex : Math.max(0, steps.findIndex(s=>s.stage===scene.stage));
  const box=document.createElement("div");
  box.className="flow-progress";
  box.innerHTML='<div class="flow-progress-title">'+(GAME_DATA.meta.flowTitle||"学習の流れ")+'</div><div class="flow-steps">'+steps.map((s,i)=>{
    const done=i<completed;
    const now=i===completed;
    const visible=done||now;
    return '<div class="flow-step '+(done?'done ':'')+(now?'now':'')+(visible?'':'future')+'"><span class="flow-num">'+(visible?(i+1):'?')+'</span><span>'+(visible?s.title:'？')+'</span></div>';
  }).join('')+'</div>';
  return box;
}
function renderSceneImage(scene){
  const image = scene.image || (GAME_DATA.meta.stageImages && GAME_DATA.meta.stageImages[scene.stage]);
  if(!image) return "";
  const credit = image.credit ? '<span>'+image.credit+'</span>' : '';
  const source = image.url ? ' <a href="'+image.url+'" target="_blank" rel="noopener">出典・ライセンス</a>' : '';
  return '<figure class="scene-image"><img src="'+image.src+'" alt="" loading="eager"><figcaption>'+credit+source+'</figcaption></figure>';
}

function render(){
  app.innerHTML = "";
  if(!state){ renderTitle(); return; }
  if(state.phase==="end"){ renderEnding(); return; }
  if(state.phase==="gameover"){ renderGameOver(); return; }

  const scene = currentScene();
  const stageInfo = GAME_DATA.STAGES[scene.stage];

  // ステージバー
  const bar = document.createElement("div");
  bar.className = "stagebar";
  bar.style.setProperty("--stage-color", stageInfo.color);
  bar.style.background = stageInfo.color;
  const stageIdx = GAME_DATA.STAGE_ORDER.indexOf(scene.stage);
  bar.innerHTML = `
    <div class="row">
      <div class="season">${stageInfo.label}</div>
      <div class="month">${GAME_DATA.meta.title}</div>
    </div>
    <div class="dots">
      ${GAME_DATA.STAGE_ORDER.map((k,i)=>`<div class="dot ${i<stageIdx?"done":""} ${i===stageIdx?"now":""}"></div>`).join("")}
    </div>`;
  app.appendChild(bar);
  app.appendChild(renderFlowProgress(scene));

  const main = document.createElement("main");

  if(state.phase==="scene"){
    const navi = naviForScene(scene);
    if(navi){
      const guide = document.createElement("div");
      guide.className = "navi-guide";
      guide.innerHTML = `<div class="navi-bubble">${navi.message || "どうするか、考えてみよう。"}</div><img src="${navi.src}" alt="" class="navi-img">`;
      main.appendChild(guide);
    }
    if(scene.kind!=="sequence") main.appendChild(renderStatus());
    const card = document.createElement("div");
    card.className = "scene-card";
    card.innerHTML = `
      <p class="scene-title">${scene.kind==="sequence" ? "次のステップを考えよう" : (scene.kind==="event" ? "できごと：" + scene.eventName : scene.title)}</p>\n      ${scene.kind==="event" ? `<div class="event-badge">予定外のできごと</div>` : ""}
      ${renderSceneImage(scene)}
      <p class="scene-text">${scene.text}</p>
      ${scene.kind==="sequence" && state.sequenceFeedback && !state.sequenceFeedback.correct ? `<div class="sequence-hint">${state.sequenceFeedback.text}</div>` : ""}`;
    main.appendChild(card);

    const choices = document.createElement("div");
    choices.className = "choices";
    scene.choices.forEach((c,i)=>{
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.innerHTML = `<span class="num">${i+1}</span>${c.text}`;
      btn.onclick = ()=>chooseOption(i);
      choices.appendChild(btn);
    });
    main.appendChild(choices);
  }

  if(state.phase==="sequenceResult"){
    const scene = currentScene();
    const navi = naviForScene(scene);
    if(navi){
      const guide = document.createElement("div");
      guide.className = "navi-guide result-guide";
      guide.innerHTML = '<div class="navi-bubble">'+(navi.resultMessage || "順番がつながったね。次のステップへ進もう。")+'</div><img src="'+navi.src+'" alt="" class="navi-img">';
      main.appendChild(guide);
    }
    const card=document.createElement("div");
    card.className="result-card sequence-result-card";
    card.innerHTML='<div class="sequence-correct">✓ '+(scene.correctLabel || "正解！")+'</div><p class="sequence-feedback">'+(state.sequenceFeedback?.text || "次のステップがわかりました。")+'</p>';
    main.appendChild(card);
    const nextBtn=document.createElement("button");
    nextBtn.className="next-btn sequence-next";
    nextBtn.textContent="次のステップへ →";
    nextBtn.onclick=goNext;
    main.appendChild(nextBtn);
  }

  if(state.phase==="result"){
    const c = state.lastChoice;
    const scene = currentScene();
    const navi = naviForScene(scene);
    if(navi){
      const guide = document.createElement("div");
      guide.className = "navi-guide result-guide";
      guide.innerHTML = `<div class="navi-bubble">${navi.resultMessage || "結果を見て、次の判断につなげよう。"}</div><img src="${navi.src}" alt="" class="navi-img">`;
      main.appendChild(guide);
    }
    main.appendChild(renderStatus());
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <div class="result-block">
        <h3>結果</h3>
        <p>${c.result}</p>
      </div>
      ${renderEffectSummary(c.effects)}
      <div class="point-block">
        <h3>ここがポイント</h3>
        <p>${c.point || "この選択によって、別の結果や課題が生まれました。"}</p>
      </div>
      ${c.fact ? `<div class="fact-block"><p>${c.fact}</p></div>` : ""}
    `;
    main.appendChild(card);

    const nextBtn = document.createElement("button");
    nextBtn.className = "next-btn";
    nextBtn.textContent = "つぎへ";
    nextBtn.onclick = goNext;
    main.appendChild(nextBtn);
  }

  app.appendChild(main);

  // 外部UI拡張用フック。通常画面の描画後に呼び出す。
  if (typeof window.GameBook?.onRender === "function") {
    try { window.GameBook.onRender({ data: GAME_DATA, state }); } catch(e) {}
  }
}


function renderStatus(final=false){
  const m=statusMeta(),box=document.createElement("div");box.className="status-panel"+(final?" final-status-panel":"");
  box.innerHTML='<div class="status-title">'+(GAME_DATA.meta.statusTitle||GAME_DATA.meta.title)+'</div><div class="status-grid">'+Object.keys(m).map(k=>{const x=m[k],v=state.status[k],n=Math.max(1,Number(x.max??5)-Number(x.min??0));return '<div class="status-item"><div class="status-label">'+x.label+'</div><div class="status-bars">'+Array.from({length:n},(_,i)=>'<span class="status-dot '+(i<(v-Number(x.min??0))?'on':'')+'"></span>').join('')+'</div></div>';}).join('')+'</div>';return box;
}
function renderEffectSummary(effects){
  if(!effects)return '';
  const m=statusMeta(),html=Object.keys(m).filter(k=>effects[k]).map(k=>{const d=effects[k];return '<span class="effect '+(d>0?'up':'down')+'">'+m[k].label+' '+(d>0?'+1':'−1')+'</span>';}).join('');
  return html?'<div class="effect-summary"><span class="effect-title">今回の変化</span>'+html+'</div>':'';
}
function renderGameOver(){
  const bar=document.createElement("div");bar.className="stagebar";bar.style.background="#5B5148";
  bar.innerHTML='<div class="row"><div class="season">'+(GAME_DATA.meta.statusTitle||GAME_DATA.meta.title)+'</div><div class="month">'+GAME_DATA.meta.title+'</div></div>';app.appendChild(bar);
  const main=document.createElement("main"),failed=statusMeta()[state.failedStatus];
  const card=document.createElement("div");card.className="result-card gameover-card";
  card.innerHTML='<div class="gameover-mark">番組はここで終了</div><h2>'+(GAME_DATA.meta.gameOverTitle||((failed&&failed.label)?failed.label+" が0になりました":"ゲームオーバー"))+'</h2><p>'+(GAME_DATA.meta.gameOverText||"大切な判断を見直して、もう一度挑戦してみよう。")+'</p><div class="status-final">'+Object.keys(statusMeta()).map(k=>'<div><b>'+statusMeta()[k].label+'</b><strong>'+state.status[k]+'</strong></div>').join('')+'</div>';
  main.appendChild(card);
  const reflect=document.createElement("div");reflect.className="scene-card";reflect.innerHTML='<p class="reflect-q">どの判断が、この結果につながったと思いますか？</p><textarea class="reflect" placeholder="学びノートに書いてみよう。"></textarea>';main.appendChild(reflect);
  const retry=document.createElement("button");retry.className="next-btn";retry.textContent=GAME_DATA.meta.gameOverRetryText||"もう一度挑戦する";retry.onclick=startNewGame;main.appendChild(retry);app.appendChild(main);
}

function renderTitle(){
  const s = loadSave();
  const wrap = document.createElement("div");
  wrap.className = "center-screen";
  wrap.innerHTML = `
    <div class="title-visual"><img src="${GAME_DATA.meta.startImage || "https://tt-sensei.github.io/navi-character-/assets/web/groups/group-start-dash.webp"}" alt="" class="title-navi"></div>
    <div class="title-label">SOCIAL GAMEBOOK</div>
    <h1 class="title-jp">${GAME_DATA.meta.title}</h1>
    <p class="title-sub">${GAME_DATA.meta.lead}</p>
  `;
  const startBtn = document.createElement("button");
  startBtn.className = "primary-btn";
  startBtn.textContent = s ? "さいしょから はじめる" : "はじめる";
  startBtn.onclick = startNewGame;
  wrap.appendChild(startBtn);

  if(s){
    const resumeBtn = document.createElement("button");
    resumeBtn.className = "ghost-btn";
    resumeBtn.textContent = "つづきから はじめる";
    resumeBtn.onclick = resumeGame;
    wrap.appendChild(resumeBtn);
  }
  app.appendChild(wrap);
}

function renderEnding(){
  const bar = document.createElement("div");
  bar.className = "stagebar";
  bar.style.background = "#3A4A3E";
  bar.innerHTML = `<div class="row"><div class="season">${GAME_DATA.meta.endingLabel}</div><div class="month">${GAME_DATA.meta.title}</div></div>`;
  app.appendChild(bar);

  const main = document.createElement("main");

  const flow = document.createElement("div");
  flow.className="ending-flow";
  flow.innerHTML="<div class=\"ending-flow-title\">"+(GAME_DATA.meta.flowTitle||"学習の流れ")+"</div><div class=\"ending-flow-line\">"+GAME_DATA.STAGE_ORDER.flatMap(k=>GAME_DATA.CORE_SCENES[k]||[]).map((s,i)=>`<span>${i+1}. ${s.title}</span>`).join("<b>→</b>")+"</div><p>"+(GAME_DATA.meta.endingNote||"")+"</p>";
  main.appendChild(flow);

  const summary = document.createElement("div");
  summary.className = "scene-card";
  const eventCount = state.log.filter(l=>l.kind==="event").length;
  summary.innerHTML = `
    <span class="badge">${GAME_DATA.meta.title} クリア</span>
    <p class="scene-text">${GAME_DATA.meta.endingText.replace("{{eventCount}}", eventCount)}</p>
  `;
  const finalTitle = document.createElement("div");
  finalTitle.className = "final-status-heading";
  finalTitle.innerHTML = "<span>今回の結果</span><small>"+(GAME_DATA.meta.finalStatusText||"あなたの選択が、このゲームにどう影響したか")+"</small>";
  main.appendChild(finalTitle);
  main.appendChild(renderStatus(true));
  main.appendChild(summary);

  const logCard = document.createElement("div");
  logCard.className = "scene-card";
  logCard.innerHTML = `<p class="scene-title">経験したこと</p>`;
  const list = document.createElement("div");
  list.className = "log-list";
  state.log.forEach(item=>{
    const div = document.createElement("div");
    div.className = "log-item";
    div.innerHTML = `<span class="tag">${GAME_DATA.STAGES[item.stage].label}・${item.title}</span>「${item.choiceText}」を選び、${item.result}`;
    list.appendChild(div);
  });
  logCard.appendChild(list);
  main.appendChild(logCard);

  const learnCard = document.createElement("div");
  learnCard.className = "scene-card";
  learnCard.innerHTML = `<p class="scene-title">今回、体験した学習ポイント</p>`;
  const grid = document.createElement("div");
  grid.className = "learn-grid";
  const learnedKeys = new Set();
  state.log.forEach(item=>{
    const source = item.sceneLearning || [];
    source.forEach(key=>learnedKeys.add(key));
  });
  state.log.forEach(item=>{
    const scene = GAME_DATA.CORE_SCENES[item.stage]?.find(s=>s.id===item.id);
    if(scene && scene.requiredLearning) scene.requiredLearning.forEach(key=>learnedKeys.add(key));
  });
  const labels = Object.entries(GAME_DATA.REQUIRED_LEARNING)
    .filter(([key])=>learnedKeys.has(key))
    .map(([,label])=>label);
  (labels.length ? labels : Object.values(GAME_DATA.REQUIRED_LEARNING)).forEach(label=>{
    const chip = document.createElement("span");
    chip.className = "learn-chip";
    chip.textContent = label;
    grid.appendChild(chip);
  });
  learnCard.appendChild(grid);
  main.appendChild(learnCard);

  const reflectCard = document.createElement("div");
  reflectCard.className = "scene-card";
  reflectCard.innerHTML = `
    <p class="reflect-q">一番迷った選択は、どれでしたか？　なぜその方法を選びましたか？</p>
    <textarea class="reflect" placeholder="ここに書いて、学びノートに続きを書こう。"></textarea>
  `;
  main.appendChild(reflectCard);

  const retryBtn = document.createElement("button");
  retryBtn.className = "next-btn";
  retryBtn.textContent = "もう一度あそぶ（べつの一年へ）";
  retryBtn.onclick = startNewGame;
  main.appendChild(retryBtn);

  app.appendChild(main);

  const footer = document.createElement("footer");
  footer.className = "note";
  footer.textContent = GAME_DATA.meta.footerNote;
  app.appendChild(footer);
  
  // 外部UI拡張用フック。ゲーム本体の描画後に呼び出す。
  if (typeof window.GameBook?.onRender === "function") {
    try { window.GameBook.onRender({ data: GAME_DATA, state }); } catch(e) {}
  }
}

function start(options){
  GAME_DATA = options.data;
  state = null;
  render();
}
window.GameBook = { start, onRender: null };