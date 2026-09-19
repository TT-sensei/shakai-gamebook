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
  const targetEventCount = 2 + Math.floor(Math.random()*3);
  const chosen = weightedPick(data.EVENTS, Math.min(targetEventCount, data.EVENTS.length));
  const timeline = [];
  data.STAGE_ORDER.forEach(stageKey=>{
    const req = data.CORE_SCENES[stageKey].map(s=>({...s, kind:"core", stage:stageKey}));
    const evs = chosen.filter(e=>e.stages.includes(stageKey)).map(e=>({
      id:e.id+"_"+stageKey, kind:"event", stage:stageKey,
      title:e.title, text:e.text, choices:e.choices,
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
      log: state.log
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

function startNewGame(){
  state = { timeline: buildTimeline(GAME_DATA), index:0, log:[], phase:"scene" };
  saveState();
  render();
}
function resumeGame(){
  const s = loadSave();
  if(!s){ startNewGame(); return; }
  if(s.gameId && s.gameId !== GAME_DATA.meta.id) { startNewGame(); return; }
  state = { timeline: s.timelineData, index: s.index, log: s.log, phase:"scene", lastChoice:null };
  render();
}

function currentScene(){ return state.timeline[state.index]; }

function chooseOption(choiceIndex){
  const scene = currentScene();
  const choice = scene.choices[choiceIndex];
  state.log.push({
    stage: scene.stage,
    title: scene.title || scene.eventName,
    kind: scene.kind,
    choiceText: choice.text,
    result: choice.result
  });
  state.lastChoice = choice;
  state.phase = "result";
  saveState();
  render();
}

function goNext(){
  state.index++;
  if(state.index >= state.timeline.length){
    state.phase = "end";
    clearSave();
  }else{
    state.phase = "scene";
  }
  saveState();
  render();
}

/* =========================================================
   画面描画
   ========================================================= */
const app = document.getElementById("app");

function naviForScene(scene){
  const pool = GAME_DATA.meta.navi || [];
  if(!pool.length) return null;
  const key = scene.stage + ":" + scene.kind;
  const index = Math.abs(hashString(key + scene.id)) % pool.length;
  const navi = {...pool[index]};
  if(state && state.phase === "result" && navi.resultSrc) navi.src = navi.resultSrc;
  else if(scene.kind === "event" && navi.eventSrc) navi.src = navi.eventSrc;
  return navi;
}
function hashString(str){ let h=0; for(let i=0;i<str.length;i++) h=((h<<5)-h)+str.charCodeAt(i)|0; return h; }

function renderSceneImage(scene){
  const image = scene.image || (GAME_DATA.meta.stageImages && GAME_DATA.meta.stageImages[scene.stage]);
  if(!image) return "";
  return '<figure class="scene-image"><img src="'+image.src+'" alt="" loading="eager"><figcaption><span>'+image.credit+'</span> <a href="'+image.url+'" target="_blank" rel="noopener">出典</a></figcaption></figure>';
}

function render(){
  app.innerHTML = "";
  if(!state){ renderTitle(); return; }
  if(state.phase==="end"){ renderEnding(); return; }

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

  const main = document.createElement("main");

  if(state.phase==="scene"){
    const navi = naviForScene(scene);
    if(navi){
      const guide = document.createElement("div");
      guide.className = "navi-guide";
      guide.innerHTML = `<div class="navi-bubble">${navi.message || "どうするか、考えてみよう。"}</div><img src="${navi.src}" alt="" class="navi-img">`;
      main.appendChild(guide);
    }
    const card = document.createElement("div");
    card.className = "scene-card";
    card.innerHTML = `
      <p class="scene-title">${scene.kind==="event" ? "できごと：" + scene.eventName : scene.title}</p>
      ${renderSceneImage(scene)}
      <p class="scene-text">${scene.text}</p>`;
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
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <div class="result-block">
        <h3>結果</h3>
        <p>${c.result}</p>
      </div>
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
}

function renderTitle(){
  const s = loadSave();
  const wrap = document.createElement("div");
  wrap.className = "center-screen";
  wrap.innerHTML = `
    <div class="title-emblem">${GAME_DATA.meta.icon || "📘"}</div>
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

  const summary = document.createElement("div");
  summary.className = "scene-card";
  const eventCount = state.log.filter(l=>l.kind==="event").length;
  summary.innerHTML = `
    <span class="badge">${GAME_DATA.meta.title} クリア</span>
    <p class="scene-text">${GAME_DATA.meta.endingText.replace("{{eventCount}}", eventCount)}</p>
  `;
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
  Object.values(GAME_DATA.REQUIRED_LEARNING).forEach(label=>{
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
}

function start(options){
  GAME_DATA = options.data;
  state = null;
  render();
}
window.GameBook = { start };