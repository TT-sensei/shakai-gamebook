(function(){
  const originalRender = window.render;

  function currentStageIndex(){
    if(!window.state || !window.state.timeline || window.state.index == null) return -1;
    const scene = window.state.timeline[window.state.index];
    if(!scene) return -1;
    return (GAME_DATA.STAGE_ORDER || []).indexOf(scene.stage);
  }

  function stageProgressMarkup(){
    const current = currentStageIndex();
    return '<div class="j-process-bar" aria-label="クルマができるまでの工程">'+
      GAME_DATA.STAGE_ORDER.map((key,i)=>{
        const s=GAME_DATA.STAGES[key];
        const cls=i<current?'done':(i===current?'now':'future');
        const mark=i<current?'✓':(i===current?'●':'○');
        return '<div class="j-process-step '+cls+'"><span class="j-process-mark">'+mark+'</span><span class="j-process-name">'+s.short+'</span></div>';
      }).join('<span class="j-process-arrow">›</span>')+
      '</div>';
  }

  function processDetail(){
    const current=currentStageIndex();
    const stages=GAME_DATA.STAGE_ORDER;
    const html=stages.map((key,i)=>{
      const s=GAME_DATA.STAGES[key];
      const d=GAME_DATA.FLOW_STAGES[key] || {};
      const cls=i<current?'done':(i===current?'now':'future');
      const status=i<current?'完了':(i===current?'いまここ':'これから');
      const subs=(d.substeps||[]).map(x=>'<li>'+x+'</li>').join('');
      return '<article class="j-process-card '+cls+'">'+
        '<div class="j-process-card-head"><span class="j-process-num">'+String(i+1).padStart(2,'0')+'</span>'+
        '<div><div class="j-process-status">'+status+'</div><h3>'+s.label+'</h3></div></div>'+
        '<p>'+((d.summary)||'')+'</p>'+
        '<ul>'+subs+'</ul>'+
      '</article>';
    }).join('');
    return '<div class="j-process-modal" role="dialog" aria-modal="true" aria-label="工程を確認">'+
      '<div class="j-process-backdrop" data-process-close></div>'+
      '<div class="j-process-sheet">'+
        '<div class="j-process-head"><div><div class="j-process-kicker">PROCESS CHECK</div><h2>'+((GAME_DATA.meta.flowTitle)||'クルマができるまでの工程')+'</h2><p>いまの工程と、このあと何をするかを確認できます。</p></div>'+
        '<button class="j-process-close" type="button" data-process-close aria-label="閉じる">×</button></div>'+
        '<div class="j-process-cards">'+html+'</div>'+
        '<div class="j-process-foot"><span>いまの工程を確認したら</span><button class="j-process-return" type="button" data-process-close>ゲームにもどる →</button></div>'+
      '</div>'+
    '</div>';
  }

  function closeProcess(){
    const modal=document.querySelector('.j-process-modal');
    if(modal) modal.remove();
    document.body.classList.remove('j-process-open');
  }

  function openProcess(){
    closeProcess();
    const wrap=document.createElement('div');
    wrap.innerHTML=processDetail();
    const modal=wrap.firstElementChild;
    document.body.appendChild(modal);
    document.body.classList.add('j-process-open');
    modal.querySelectorAll('[data-process-close]').forEach(el=>el.addEventListener('click',closeProcess));
    document.addEventListener('keydown',function esc(e){
      if(e.key==='Escape'){closeProcess();document.removeEventListener('keydown',esc);}
    });
  }

  function enhance(){
    if(!window.GAME_DATA || GAME_DATA.meta.id!=='jidosha-zukuri') return;
    closeProcess();

    const old=document.querySelector('.flow-progress');
    if(old) old.remove();

    const stageBar=document.createElement('div');
    stageBar.className='j-process-wrap';
    stageBar.innerHTML=stageProgressMarkup();
    const button=document.createElement('button');
    button.type='button';
    button.className='j-process-open';
    button.textContent=GAME_DATA.meta.processButtonLabel || '工程を確認';
    button.addEventListener('click',openProcess);
    stageBar.appendChild(button);

    const main=document.querySelector('#app main');
    if(main) main.parentNode.insertBefore(stageBar,main);
  }

  window.render=function(){
    originalRender();
    enhance();
  };

  const style=document.createElement('style');
  style.textContent=`
    .j-process-wrap{width:100%;padding:10px 18px 4px;background:var(--paper);display:flex;align-items:center;gap:10px;position:relative;z-index:2}
    .j-process-bar{flex:1;display:flex;align-items:stretch;gap:4px;min-width:0}
    .j-process-step{min-width:0;flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:8px 4px;border:1px solid rgba(78,124,74,.13);border-radius:10px;background:#fff;color:var(--ink-soft);font-size:11px;font-weight:700}
    .j-process-step.done{background:#edf4e9;color:var(--paddy-dark)}
    .j-process-step.now{background:var(--paddy-dark);color:#fff;border-color:var(--paddy-dark)}
    .j-process-step.future{opacity:.62}
    .j-process-mark{font-size:10px}
    .j-process-name{white-space:nowrap}
    .j-process-arrow{display:flex;align-items:center;color:#8a958b;font-size:17px;flex:none}
    .j-process-open{flex:none;border:1px solid rgba(78,124,74,.25);background:#fff;color:var(--paddy-dark);border-radius:10px;padding:9px 12px;font:700 12px/1.2 inherit;white-space:nowrap;cursor:pointer;box-shadow:0 1px 4px rgba(38,50,41,.06)}
    .j-process-open:active{transform:scale(.98)}
    body.j-process-open{overflow:hidden}
    .j-process-modal{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:18px}
    .j-process-backdrop{position:absolute;inset:0;background:rgba(31,43,35,.52)}
    .j-process-sheet{position:relative;width:min(960px,100%);max-height:92vh;overflow:auto;background:var(--paper);border-radius:20px;box-shadow:0 16px 50px rgba(0,0,0,.25);padding:20px}
    .j-process-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:16px}
    .j-process-kicker{font-size:10px;letter-spacing:.12em;color:var(--ink-soft);font-weight:700}
    .j-process-head h2{margin:4px 0;font-size:22px;color:var(--paddy-dark)}
    .j-process-head p{margin:0;color:var(--ink-soft);font-size:13px}
    .j-process-close{width:40px;height:40px;border:0;border-radius:50%;background:#fff;color:var(--ink);font-size:25px;cursor:pointer;flex:none}
    .j-process-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
    .j-process-card{background:#fff;border:1px solid rgba(78,124,74,.12);border-radius:14px;padding:13px;min-width:0}
    .j-process-card.now{border:2px solid var(--paddy);padding:12px;box-shadow:0 4px 14px rgba(78,124,74,.12)}
    .j-process-card.future{opacity:.62}
    .j-process-card-head{display:flex;gap:9px;align-items:center}
    .j-process-num{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--paper-2);color:var(--ink-soft);font-size:11px;font-weight:800}
    .j-process-card.done .j-process-num{background:#dfead9;color:var(--paddy-dark)}
    .j-process-card.now .j-process-num{background:var(--paddy);color:#fff}
    .j-process-status{font-size:9px;color:var(--ink-soft);font-weight:700;line-height:1}
    .j-process-card.now .j-process-status{color:var(--paddy-dark)}
    .j-process-card h3{margin:3px 0 0;font-size:16px;color:var(--ink)}
    .j-process-card p{font-size:12.5px;line-height:1.55;margin:10px 0 7px;color:var(--ink-soft)}
    .j-process-card ul{margin:0;padding-left:17px;color:var(--ink);font-size:11.5px;line-height:1.55}
    .j-process-foot{display:flex;justify-content:flex-end;align-items:center;gap:10px;margin-top:15px;font-size:12px;color:var(--ink-soft)}
    .j-process-return{border:0;border-radius:10px;background:var(--paddy-dark);color:#fff;padding:11px 14px;font:700 13px inherit;cursor:pointer}
    @media(max-width:760px){
      .j-process-wrap{padding:8px 10px 3px;gap:7px}
      .j-process-step{font-size:10px;padding:7px 2px}
      .j-process-arrow{font-size:13px}
      .j-process-open{padding:8px 9px;font-size:11px}
      .j-process-sheet{padding:15px;border-radius:16px}
      .j-process-cards{grid-template-columns:repeat(2,1fr)}
    }
    @media(max-width:520px){
      .j-process-name{font-size:9px}
      .j-process-mark{display:none}
      .j-process-open{font-size:10px;padding:8px 7px}
      .j-process-head h2{font-size:19px}
      .j-process-cards{grid-template-columns:1fr}
      .j-process-card.future{display:none}
      .j-process-foot span{display:none}
    }
  `;
  document.head.appendChild(style);
})();