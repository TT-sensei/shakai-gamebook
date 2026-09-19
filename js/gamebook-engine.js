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

const STATUS_META={water:{label:"水管理",icon:"💧"},growth:{label:"稲の育ち",icon:"🌾"},efficiency:{label:"作業効率",icon:"⚙️"},cooperation:{label:"地域との協力",icon:"🤝"},quality:{label:"米の品質",icon:"📦"}};
const LEARNING_TO_STATUS={natural:"growth",water:"water",observe:"growth",tech:"efficiency",quality:"quality",society:"cooperation"};
function initialStatus(){return{water:3,growth:3,efficiency:3,cooperation:3,quality:3};}
function effectForChoice(scene,index){
  // 原則：選択肢側に明示した effects を優先する。
  // 旧データとの互換用に、未設定の場合だけ学習内容から補完する。
  const keys=[...(new Set((scene.requiredLearning||[]).map(k=>LEARNING_TO_STATUS[k]).filter(Boolean)))];
  if(!keys.length)return{};
  if(keys.length===1)return{[keys[0]]:index===1?1:-1};
  const e={};
  if(index===0){e[keys[0]]=-1;e[keys[1]]=1;}
  else if(index===1){e[keys[0]]=1;e[keys[1]]=1;}
  else{e[keys[0]]=1;e[keys[1]]=-1;}
  return e;
}
function applyEffects(effects){Object.keys(STATUS_META).forEach(k=>{state.status[k]=Math.max(0,Math.min(5,state.status[k]+Number(effects[k]||0)));});}
function failedStatus(){return Object.keys(STATUS_META).find(k=>state.status[k]<=0)||null;}
function startNewGame(){
  state={timeline:buildTimeline(GAME_DATA),index:0,log:[],phase:"scene",status:initialStatus(),lastChoice:null,failedStatus:null};
  saveState();render();
}
function resumeGame(){
  const s = loadSave();
  if(!s){ startNewGame(); return; }
  if(s.gameId && s.gameId !== GAME_DATA.meta.id) { startNewGame(); return; }
  state={timeline:s.timelineData,index:s.index,log:s.log,phase:"scene",lastChoice:null,status:s.status||initialStatus(),failedStatus:s.failedStatus||null};
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
      state.sequenceFeedback={correct:false,text:choice.hint||"もう一度、米づくりの流れを思い出してみよう。"};
      saveState();render();
    }
    return;
  }
  const effects=choice.effects||effectForChoice(scene,choiceIndex),before={...state.status};
  applyEffects(effects);
  state.log.push({stage:scene.stage,title:scene.title||scene.eventName,kind:scene.kind,choiceText:choice.text,result:choice.result,effects,before,after:{...state.status}});
  state.lastChoice={...choice,effects,before,after:{...state.status}};
  state.failedStatus=failedStatus();state.phase="result";saveState();render();
}

function goNext(){
  if(state.failedStatus){state.phase="gameover";clearSave();render();return;}
  state.index++;
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
      <p class="scene-title">${scene.kind==="sequence" ? "次のステップを考えよう" : (scene.kind==="event" ? "できごと：" + scene.eventName : scene.title)}</p>
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
    card.innerHTML='<div class="sequence-correct">✓ '+(scene.correctLabel || "正解！")+'</div><p class="sequence-feedback">'+(state.sequenceFeedback?.text || "米づくりの次の仕事がわかりました。")+'</p>';
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
}


function renderStatus(final=false){
  const box=document.createElement("div");box.className="status-panel"+(final?" final-status-panel":"");
  box.innerHTML='<div class="status-title">今年の米づくり</div><div class="status-grid">'+Object.keys(STATUS_META).map(k=>{
    const m=STATUS_META[k],v=state.status[k];
    return '<div class="status-item"><div class="status-label"><span>'+m.icon+'</span>'+m.label+'</div><div class="status-bars">'+Array.from({length:5},(_,i)=>'<span class="status-dot '+(i<v?'on':'')+'"></span>').join('')+'</div></div>';
  }).join('')+'</div>';return box;
}
function renderEffectSummary(effects){
  if(!effects)return '';
  const html=Object.keys(STATUS_META).filter(k=>effects[k]).map(k=>{
    const d=effects[k],m=STATUS_META[k];
    return '<span class="effect '+(d>0?'up':'down')+'">'+m.icon+' '+(d>0?'+1':'−1')+'</span>';
  }).join('');
  return html?'<div class="effect-summary"><span class="effect-title">今回の変化</span>'+html+'</div>':'';
}
function renderGameOver(){
  const bar=document.createElement("div");bar.className="stagebar";bar.style.background="#5B5148";
  bar.innerHTML='<div class="row"><div class="season">今年の米づくり</div><div class="month">'+GAME_DATA.meta.title+'</div></div>';app.appendChild(bar);
  const main=document.createElement("main"),failed=STATUS_META[state.failedStatus];
  const card=document.createElement("div");card.className="result-card gameover-card";
  card.innerHTML='<div class="gameover-mark">今年はここで終了</div><h2>'+failed.icon+' '+failed.label+' が0になりました</h2><p>このまま米づくりを続けるのは難しい状態です。けれど、失敗した判断からも、米づくりの工夫や課題を学ぶことができます。</p><div class="status-final">'+Object.keys(STATUS_META).map(k=>'<div><span>'+STATUS_META[k].icon+'</span><b>'+STATUS_META[k].label+'</b><strong>'+state.status[k]+'</strong></div>').join('')+'</div>';
  main.appendChild(card);
  const reflect=document.createElement("div");reflect.className="scene-card";reflect.innerHTML='<p class="reflect-q">どの判断が、この結果につながったと思いますか？</p><textarea class="reflect" placeholder="学びノートに書いてみよう。"></textarea>';main.appendChild(reflect);
  const retry=document.createElement("button");retry.className="next-btn";retry.textContent="もう一度、米づくりに挑戦する";retry.onclick=startNewGame;main.appendChild(retry);app.appendChild(main);
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
  const finalTitle = document.createElement("div");
  finalTitle.className = "final-status-heading";
  finalTitle.innerHTML = "<span>一年間の結果</span><small>あなたの選択が、この一年の米づくりにどう影響したか</small>";
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