/* =========================================================
   社会科ゲームブック 拡張（gamebook-plus）
   学習の記録・バッジ・音・演出を、既存エンジンに後付けする。
   エンジン本体（gamebook-engine.js）には手を入れず、
   GameBook.onRender フックの連結で動作する。
   ========================================================= */
(function(){
  "use strict";
  const REC_KEY = "shakaiGamebook.records.v1";
  const SET_KEY = "shakaiGamebook.settings.v1";
  const COUNT_KEY = "gbplus.counted.v1";
  const GAMES = [
    { id: "kome-zukuri",    name: "米づくり",     page: "kome-zukuri.html" },
    { id: "jidosha-zukuri", name: "自動車づくり", page: "jidosha-zukuri.html" },
    { id: "news-zukuri",    name: "ニュースづくり", page: "news-zukuri.html" },
    { id: "unyu-zukuri",    name: "運輸・物流",   page: "unyu-zukuri.html" },
    { id: "bosai",          name: "防災",         page: "bosai.html" },
    { id: "suisan",         name: "水産業",       page: "suisan.html" }
  ];
  const gameName = id => (GAMES.find(g=>g.id===id)||{}).name || id;

  /* ---------- 記録と設定 ---------- */
  function loadRec(){
    try{ const r = JSON.parse(localStorage.getItem(REC_KEY)); if(r && r.games && r.badges) return r; }catch(e){}
    return { games:{}, badges:{} };
  }
  function saveRec(r){ try{ localStorage.setItem(REC_KEY, JSON.stringify(r)); }catch(e){} }
  function loadSet(){
    try{ const s = JSON.parse(localStorage.getItem(SET_KEY)); if(s) return s; }catch(e){}
    return { sound: true };
  }
  function saveSet(s){ try{ localStorage.setItem(SET_KEY, JSON.stringify(s)); }catch(e){} }
  function loadCounted(){
    try{ return JSON.parse(sessionStorage.getItem(COUNT_KEY)) || {}; }catch(e){ return {}; }
  }
  function saveCounted(c){ try{ sessionStorage.setItem(COUNT_KEY, JSON.stringify(c)); }catch(e){} }
  const today = () => new Date().toISOString().slice(0,10);

  /* ---------- 音（sounds-recipe-） ---------- */
  let ac = null, sndMod = null;
  async function ensureAudio(){
    if(sndMod && ac){ if(ac.state === "suspended"){ try{ await ac.resume(); }catch(e){} } return true; }
    try{
      sndMod = await import("https://tt-sensei.github.io/sounds-recipe-/sounds.js");
      const AC = window.AudioContext || window.webkitAudioContext;
      ac = new AC();
      return true;
    }catch(e){ return false; }
  }
  function play(id){
    if(!loadSet().sound) return;
    ensureAudio().then(ok=>{ if(ok && sndMod){ try{ sndMod.playSound(ac, id, 0.45); }catch(e){} } });
  }

  /* ---------- 演出（edu-effects） ---------- */
  let fxPromise = null;
  function loadEffects(){
    if(window.EduEffects) return Promise.resolve(true);
    if(fxPromise) return fxPromise;
    fxPromise = new Promise(res=>{
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://tt-sensei.github.io/edu-effects/css/edu-effects-library.css";
      document.head.appendChild(link);
      const s = document.createElement("script");
      s.src = "https://tt-sensei.github.io/edu-effects/js/edu-effects.js";
      s.onload = ()=>res(true);
      s.onerror = ()=>res(false);
      document.head.appendChild(s);
    });
    return fxPromise;
  }
  function confetti(el){
    loadEffects().then(ok=>{ if(ok && window.EduEffects && el){ try{ EduEffects.confetti(el, 60); }catch(e){} } });
  }

  /* ---------- バッジ ---------- */
  function badgeDefs(rec){
    const defs = [];
    GAMES.forEach(g=>{
      defs.push({ id: "clear-" + g.id,  name: "🏅 " + g.name + " クリア", earned: !!rec.badges["clear-" + g.id] });
      defs.push({ id: "master-" + g.id, name: "🌟 " + g.name + " マスター（3回クリア）", earned: !!rec.badges["master-" + g.id] });
    });
    defs.push({ id: "all-clear", name: "👑 全ゲーム制覇", earned: !!rec.badges["all-clear"] });
    defs.push({ id: "plays-10",  name: "📚 10回プレイ", earned: !!rec.badges["plays-10"] });
    return defs;
  }
  function checkBadges(rec, gid){
    const newly = [];
    const g = rec.games[gid] || { plays:0, clears:0, overs:0 };
    const award = id => { if(!rec.badges[id]){ rec.badges[id] = today(); newly.push(id); } };
    if(g.clears >= 1) award("clear-" + gid);
    if(g.clears >= 3) award("master-" + gid);
    if(GAMES.every(x => (rec.games[x.id]||{}).clears >= 1)) award("all-clear");
    const totalPlays = GAMES.reduce((n,x)=> n + ((rec.games[x.id]||{}).plays||0), 0);
    if(totalPlays >= 10) award("plays-10");
    return newly;
  }
  function badgeName(id, rec){
    const d = badgeDefs(rec || loadRec()).find(x=>x.id===id);
    return d ? d.name : id;
  }
  function showBadgeAward(newly){
    const main = document.querySelector("#app main");
    if(!main || !newly.length) return;
    const card = document.createElement("div");
    card.className = "gb-badge-card";
    card.innerHTML = '<p class="gb-badge-title">🎉 バッジを手に入れました！</p>' +
      '<div class="gb-badge-list">' + newly.map(id=>'<span class="gb-badge-chip">' + badgeName(id) + '</span>').join("") + '</div>' +
      '<p class="gb-badge-note">バッジと学習の記録は、この端末に保存されます。トップページでも見られます。</p>';
    const summary = document.querySelector("#app .badge");
    const summaryCard = summary && summary.closest ? summary.closest(".scene-card") : null;
    if(summaryCard && summaryCard.parentNode === main) summaryCard.after(card);
    else main.appendChild(card);
    play("badge");
    confetti(card);
  }

  /* ---------- ゲーム画面：エンジンへのフック ---------- */
  function tokenOf(state){
    return state && state.timeline ? state.timeline.map(s=>s.id).join("|") : "";
  }
  function handleRender(ctx){
    const data = ctx && ctx.data, state = ctx && ctx.state;
    if(!data || !state) return;
    const gid = data.meta && data.meta.id;
    if(!gid) return;
    const counted = loadCounted();
    const tok = tokenOf(state);
    const c = counted[tok] || {};
    const rec = loadRec();
    const g = rec.games[gid] || (rec.games[gid] = { plays:0, clears:0, overs:0, last:"" });
    let changed = false;

    if(state.phase === "scene" && state.index === 0 && (!state.log || state.log.length === 0) && !c.play){
      g.plays++; c.play = true; changed = true;
    }
    if(state.phase === "end" && !c.clear){
      g.clears++; c.clear = true; changed = true;
      g.last = today();
      const newly = checkBadges(rec, gid);
      saveRec(rec);
      if(newly.length) showBadgeAward(newly);
      play("allclear");
      const h = document.querySelector("#app .badge");
      if(h) confetti(h);
    }
    if(state.phase === "gameover" && !c.over){
      g.overs++; c.over = true; changed = true;
      play("softFail");
    }
    if(changed){ g.last = g.last || today(); saveRec(rec); }
    counted[tok] = c; saveCounted(counted);

    if(state.phase === "result" && state.lastChoice){
      const vals = Object.values(state.lastChoice.effects || {});
      if(vals.some(v=>v<0)) play("softFail");
      else if(vals.some(v=>v>0)) play("correct");
    }
    if(state.phase === "sequenceResult") play("correct");

    // ピンチ警告：状態が下限+1まで下がったら、結果画面で立て直しを促す
    if(state.phase === "result"){
      const m = data.meta.statuses || {};
      const low = Object.keys(m).filter(k => state.status[k] <= Number(m[k].min ?? 0) + 1);
      const main = document.querySelector("#app main");
      if(low.length && main && !main.querySelector(".gb-pinch")){
        const div = document.createElement("div");
        div.className = "gb-pinch";
        const b = document.createElement("b");
        b.textContent = low.map(k=>m[k].label).join("・");
        div.append("⚠ ", b, " がピンチです。このまま下がると続けられなくなります。次の判断で立て直そう。");
        const card = main.querySelector(".result-card");
        if(card) card.after(div); else main.appendChild(div);
        play("near");
      }
    }

    // ふりかえりの保存：終了・ゲームオーバー画面の文章を端末に残し、次回に前回分を見せる
    if(state.phase === "end" || state.phase === "gameover"){
      const ta = document.querySelector("#app textarea.reflect");
      if(ta && !ta.dataset.gbBound){
        ta.dataset.gbBound = "1";
        const prev = (loadRec().games[gid] || {}).reflection;
        if(prev && prev.text && !ta.value){
          const note = document.createElement("div");
          note.className = "gb-prev-reflect";
          const head = document.createElement("b");
          head.textContent = "前回のふりかえり（" + prev.date + "）";
          const body = document.createElement("span");
          body.textContent = prev.text;
          note.append(head, document.createElement("br"), body);
          ta.parentNode.insertBefore(note, ta);
        }
        ta.addEventListener("input", ()=>{
          const r = loadRec();
          const g2 = r.games[gid] || (r.games[gid] = { plays:0, clears:0, overs:0, last:"" });
          g2.reflection = { text: ta.value, date: today() };
          saveRec(r);
        });
      }
    }
  }

  /* ---------- ゲーム画面：固定ボタン（トップへ／音） ---------- */
  function addChrome(){
    if(document.getElementById("gbplus-bar")) return;
    const bar = document.createElement("div");
    bar.id = "gbplus-bar";
    const home = document.createElement("a");
    home.className = "gbplus-btn";
    home.href = "index.html";
    home.textContent = "🏠 トップ";
    const btn = document.createElement("button");
    btn.className = "gbplus-btn";
    btn.type = "button";
    const paint = ()=>{ btn.textContent = loadSet().sound ? "🔊 音あり" : "🔇 音なし"; };
    paint();
    btn.addEventListener("click", ()=>{
      const s = loadSet(); s.sound = !s.sound; saveSet(s); paint();
      if(s.sound) play("click");
    });
    bar.appendChild(home);
    bar.appendChild(btn);
    document.body.appendChild(bar);
  }

  /* ---------- トップページ：記録の表示 ---------- */
  function renderTop(){
    const grid = document.querySelector(".game-grid");
    if(!grid) return;
    const rec = loadRec();
    grid.querySelectorAll(".game-card").forEach(card=>{
      const href = (card.getAttribute("href") || "").split("/").pop();
      const game = GAMES.find(g=>g.page === href);
      if(!game) return;
      const g = rec.games[game.id];
      if(!g || (!g.plays && !g.clears)) return;
      const chip = document.createElement("span");
      chip.className = "card-record";
      chip.textContent = g.clears > 0 ? "🏅 クリア " + g.clears + "回" : "プレイ " + g.plays + "回";
      card.appendChild(chip);
    });
    const box = document.getElementById("gb-records");
    if(!box) return;
    const totalPlays = GAMES.reduce((n,x)=> n + ((rec.games[x.id]||{}).plays||0), 0);
    const totalClears = GAMES.reduce((n,x)=> n + ((rec.games[x.id]||{}).clears||0), 0);
    const earned = badgeDefs(rec).filter(d=>d.earned);
    let html = '<div class="section-head"><h2>学習の記録</h2><p>この端末に保存されます</p></div>';
    if(totalPlays === 0){
      html += '<p class="gb-records-empty">まだ記録がありません。ゲームを遊ぶと、ここにプレイの記録とバッジが集まります。</p>';
    }else{
      html += '<p class="gb-records-summary">これまでに ' + totalPlays + ' 回プレイして、' + totalClears + ' 回クリアしました。</p>';
      html += '<div class="gb-records-games">' + GAMES.map(x=>{
        const g = rec.games[x.id] || { plays:0, clears:0 };
        return '<div class="gb-records-game"><span class="gb-records-name">' + x.name + '</span><span class="gb-records-num">' +
          (g.clears > 0 ? "🏅 クリア " + g.clears + "回" : (g.plays > 0 ? "プレイ " + g.plays + "回" : "これから")) + '</span></div>';
      }).join("") + '</div>';
      if(earned.length){
        html += '<div class="gb-badge-list">' + earned.map(d=>'<span class="gb-badge-chip">' + d.name + '</span>').join("") + '</div>';
      }
    }
    box.innerHTML = html;
  }

  /* ---------- 起動 ---------- */
  document.addEventListener("click", e=>{
    const t = e.target;
    if(!t || !t.closest) return;
    if(t.closest(".primary-btn")) play("start");
    else if(t.closest(".ghost-btn")) play("click");
  });
  /* ---------- ゲーム画面：タイトルのモード選択 ---------- */
  function addModeSelector(){
    const center = document.querySelector(".center-screen");
    if(!center || document.getElementById("gb-mode")) return;
    window.GB_SHORT_MODE = false;
    const box = document.createElement("div");
    box.id = "gb-mode";
    box.innerHTML = '<div class="gb-mode-label">モードをえらぶ</div>' +
      '<div class="gb-mode-row">' +
      '<button type="button" class="gb-mode-btn on" data-m="normal">ふつう<small>できごともあり・20〜25分</small></button>' +
      '<button type="button" class="gb-mode-btn" data-m="short">短い<small>核の場面だけ・10分ほど</small></button>' +
      '</div>' +
      '<p class="gb-mode-note">短いモードは、単元の核になる場面だけを体験します。</p>';
    const primary = center.querySelector(".primary-btn");
    if(primary) center.insertBefore(box, primary); else center.appendChild(box);
    box.querySelectorAll(".gb-mode-btn").forEach(b=>{
      b.addEventListener("click", ()=>{
        window.GB_SHORT_MODE = b.dataset.m === "short";
        box.querySelectorAll(".gb-mode-btn").forEach(x=>x.classList.toggle("on", x===b));
        play("click");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    if(window.GameBook){
      addChrome();
      addModeSelector();
      const prev = window.GameBook.onRender;
      window.GameBook.onRender = function(ctx){
        if(typeof prev === "function"){ try{ prev(ctx); }catch(e){} }
        try{ handleRender(ctx); }catch(e){}
      };
    }else{
      renderTop();
    }
  });
  window.GBPlus = { loadRec, badgeDefs };
})();
