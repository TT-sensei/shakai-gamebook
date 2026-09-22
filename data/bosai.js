const BOSAI_DATA={
meta:{
id:"bosai",
title:"防災ゲームブック",
icon:"🛡️",
lead:"災害を知り、備え、災害が起きたときの行動を考えよう。",
endingLabel:"助け合う",
endingText:"災害の種類によって、必要な行動は変わります。でも、地域の危険を知り、普段から備え、情報を確かめ、安全に行動し、みんなで助け合うことは共通しています。",
endingNote:"国や自治体、地域の人々、一人一人の備えがつながって、防災につながります。",
statusTitle:"今回の防災計画",
flowTitle:"防災の流れ",
flowStages:[{label:"知る"},{label:"備える"},{label:"行動する"},{label:"助け合う"}],
gameOverOnZero:true,
gameOverTitle:"このままでは助からない！",
gameOverText:"今の判断を続けると、安全を守れません。この災害では、どの判断を変えればよかったかを考えて、もう一度やり直してみよう。",
gameOverRetryText:"もう一度考える",
eventCountMin:0,
eventCountMax:0,
retryLabel:"もう一度考える",
statuses:{
risk:{label:"備え",initial:3,min:0,max:5},
information:{label:"情報",initial:3,min:0,max:5},
action:{label:"行動",initial:3,min:0,max:5},
cooperation:{label:"助け合い",initial:3,min:0,max:5},
safety:{label:"安全",initial:3,min:0,max:5}
},
navi:[
{src:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/riku/expressions/03-thinking.png",resultSrc:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/riku/expressions/07-encouraging.png",message:"まず、災害が起こるしくみを知ろう。"},
{src:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/sora/expressions/03-thinking.png",resultSrc:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/sora/expressions/07-encouraging.png",message:"自分のいる地域について考えてみよう。"},
{src:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/kai/expressions/04-idea.png",resultSrc:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/kai/expressions/10-confident.png",message:"災害が起きる前に、できることを考えよう。"},
{src:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/saku/expressions/03-thinking.png",resultSrc:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/saku/expressions/07-encouraging.png",message:"災害によって、必要な行動は変わるよ。"},
{src:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/tsuki/expressions/04-idea.png",resultSrc:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/tsuki/expressions/08-celebrating.png",message:"自分だけでなく、まわりの人のことも考えよう。"},
{src:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/nami/expressions/03-thinking.png",resultSrc:"https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/nami/expressions/07-encouraging.png",message:"みんなの力を合わせることも防災だね。"}
]
},
REQUIRED_LEARNING:{
natural:"自然の条件と災害の関係を知る",
hazard:"地域の災害リスクを知る",
preparation:"災害が起こる前から備える",
information:"ハザードマップや避難情報などを活用する",
action:"災害に合わせて安全に行動する",
cooperation:"国・自治体・地域の人々が協力する",
life:"自然災害と私たちのくらしのつながり"
},
STAGES:{
know:{label:"知る",short:"知る",color:"#5B7180"},
prepare:{label:"備える",short:"備える",color:"#66785D"},
action:{label:"行動する",short:"行動",color:"#8A6A52"},
cooperation:{label:"助け合う",short:"助け合う",color:"#657A70"}
},
STAGE_ORDER:["know","prepare","action","cooperation"],
FLOW_STAGES:{
know:{title:"災害を知る",summary:"自然のようすと災害の起こり方を知る",substeps:["災害が起こるしくみ","土地や雨などの自然条件"]},
prepare:{title:"災害に備える",summary:"地域を知り、災害が起こる前から備える",substeps:["ハザードマップ","避難場所・安全な道","災害に合わせた備え"]},
action:{title:"安全に行動する",summary:"災害に合わせて情報を集め、安全な行動を選ぶ",substeps:["情報を確かめる","状況に合わせて判断する","安全な場所へ"]},
cooperation:{title:"助け合う",summary:"地域の人々や関係機関が力を合わせる",substeps:["役割を分担する","困っている人を支える","災害に強い地域をつくる"]}
},
CORE_SCENES:{
know:[
{id:"b1",title:"災害はどうして起こる？",text:"日本では、地震や津波、大雨による洪水、火山の噴火、大雪など、さまざまな自然災害が起こります。まず、災害についてどんなことを知っておきたいですか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/CFAS%20Participates%20in%20Sasebo%20City%20Joint%20Disaster%20Drill%202025%20%289291990%29.jpg?width=1000",credit:"U.S. Navy / Wikimedia Commons・Public Domain",url:"https://commons.wikimedia.org/wiki/File:CFAS_Participates_in_Sasebo_City_Joint_Disaster_Drill_2025_(9291990).jpg"},requiredLearning:["natural"],choices:[
{text:"自然のようすと、災害が起こるしくみを知る",effects:{information:1,risk:1},result:"自然の条件と災害の関係に目を向けました。",point:"災害は、地震や火山活動、雨、雪などの自然の働きと関係しています。"},
{text:"災害は起きてから考えればよい",effects:{risk:-1},result:"起こる前に考えることの大切さを見落としました。",point:"災害はいつ起こるかわからないので、普段から知っておくことが大切です。"},
{text:"どの災害も同じだと考える",effects:{information:-1},result:"災害による違いを見落としました。",point:"災害の種類によって、危険な場所や必要な行動は変わります。"}
]},
{id:"b2",title:"土地と災害",text:"同じ町の中でも、川の近く、低い土地、山の近くなど、場所によって危険が違うことがあります。何を見て考えますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/An%20example%20of%20a%20tsunami%20hazard%20map%20Miyako%20City%20Iwate%20Prefecture.jpg?width=1000",credit:"Miyako City / Wikimedia Commons・CC BY 3.0 IGO",url:"https://commons.wikimedia.org/wiki/File:An_example_of_a_tsunami_hazard_map_Miyako_City_Iwate_Prefecture.jpg"},requiredLearning:["natural","hazard"],choices:[
{text:"土地の高さや川・山との位置などを見る",effects:{information:1,risk:1},result:"地域の自然のようすから、災害の危険を考えました。",point:"地域の土地の特徴を知ることは、防災を考える手がかりになります。"},
{text:"建物が多い場所なら安全だと考える",effects:{risk:-1},result:"建物の数だけでは危険を判断できませんでした。",point:"土地の特徴や災害の種類などを見て考えます。"},
{text:"町のどこでも危険は同じだと考える",effects:{information:-1,risk:-1},result:"場所による違いを見落としました。",point:"同じ地域でも、場所によって災害の危険が違うことがあります。"}
]}
],
prepare:[
{id:"b3",title:"災害が起こる前に",text:"地域で防災について考えることになりました。災害が起きてから慌てないために、何をしておきますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/Flickr%20-%20Official%20U.S.%20Navy%20Imagery%20-%20Sailors%20conduct%20disaster%20prevention%20training..jpg?width=1000",credit:"U.S. Navy / Wikimedia Commons・Public Domain",url:"https://commons.wikimedia.org/wiki/File:Flickr_-_Official_U.S._Navy_Imagery_-_Sailors_conduct_disaster_prevention_training..jpg"},requiredLearning:["preparation","hazard"],choices:[
{text:"地域の危険、避難場所、安全な道などを確認する",effects:{risk:1,information:1},result:"地域の危険と避難について、前もって確認しました。",point:"ハザードマップなどを使い、普段から地域の危険や避難場所を知っておくことができます。"},
{text:"災害が起きたら、そのときに探す",effects:{risk:-1,action:-1},result:"いざというときに迷う可能性があります。",point:"避難場所や安全な道は、災害が起こる前に確認しておくことが大切です。"},
{text:"施設があるから、自分では何も準備しない",effects:{risk:-1},result:"施設だけでは対応できないことがあります。",point:"地域の施設と一人一人の備えを組み合わせて考えます。"}
]},
{id:"b4",title:"どの災害に備える？",text:"ここからは、実際の災害を一つ選んで考えてみます。災害によって、必要な情報や行動は変わります。どれを体験しますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/Map%20of%20Japan.svg?width=1000",credit:"Luinil / Wikimedia Commons・CC BY-SA 3.0",url:"https://commons.wikimedia.org/wiki/File:Map_of_Japan.svg"},requiredLearning:["preparation","hazard"],choices:[
{text:"大雨・洪水",effects:{risk:1},nextSceneId:"rain1",result:"大雨・洪水について考えます。",point:"雨の量や川、土地のようすを見ながら行動を考えます。"},
{text:"地震・津波",effects:{risk:1},nextSceneId:"quake1",result:"地震・津波について考えます。",point:"揺れや津波など、その災害に応じた情報と行動を考えます。"},
{text:"火山",effects:{risk:1},nextSceneId:"volcano1",result:"火山について考えます。",point:"火山の活動や避難情報など、その地域に合わせて考えます。"},
{text:"大雪",effects:{risk:1},nextSceneId:"snow1",result:"大雪について考えます。",point:"雪による危険や交通への影響などを考えます。"}
]}
],
action:[
{id:"rain1",title:"大雨・洪水：雨が強くなった",text:"雨が強くなり、川の水位も上がってきました。避難を考えるため、まず何をしますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/2026%20chiba%20flood.jpg?width=1000",credit:"Misei sen / Wikimedia Commons・CC0",url:"https://commons.wikimedia.org/wiki/File:2026_chiba_flood.jpg"},requiredLearning:["information","action"],choices:[
{text:"雨・川・避難情報などを確認し、状況を見ながら判断する",effects:{information:1,action:1},result:"複数の情報を確認して、次の行動を考えました。",point:"雨や川の情報、自治体からの避難情報などを確認し、状況に合わせて判断します。",nextSceneId:"rain2"},
{text:"雨がやむまで何も確認せず待つ",effects:{information:-1,action:-1},result:"状況の変化を見逃す可能性があります。",point:"災害時は新しい情報を確認しながら行動を考えます。",nextSceneId:"rain2"},
{text:"近所の人が動くまで待つ",effects:{information:-1,action:-1},result:"自分で情報を確認するのが遅れました。",point:"周りの様子だけでなく、自分でも情報を確認します。",nextSceneId:"rain2"}
]},
{id:"quake1",title:"地震・津波：強い揺れ",text:"強い地震が起きました。海に近い地域では、津波への注意も必要です。まず、どうしますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/Reaching%20Higher%20Ground-%20Kadena%20Air%20Base%20and%20Chatan%20Town%20Test%20Tsunami%20Evacuation%20Procedures%20%289950981%29.jpg?width=1000",credit:"U.S. Air Force / Wikimedia Commons・Public Domain",url:"https://commons.wikimedia.org/wiki/File:Reaching_Higher_Ground-_Kadena_Air_Base_and_Chatan_Town_Test_Tsunami_Evacuation_Procedures_(9950981).jpg"},requiredLearning:["information","action"],choices:[
{text:"身の安全を確保し、津波などの情報を確認する",effects:{safety:1,information:1},result:"まず安全を確保し、その後の情報を確認しました。",point:"地震の後は、その地域に津波の危険があるかなど、最新の情報を確認します。",nextSceneId:"quake2"},
{text:"揺れている間に外へ急いで出る",effects:{safety:-1,action:-1},result:"周りの落下物などを確認できませんでした。",point:"強い揺れのときは、まず身の安全を確保します。",nextSceneId:"quake2"},
{text:"揺れがおさまったので、津波の情報は見ない",effects:{information:-1,action:-1},result:"必要な情報を確認できませんでした。",point:"地震の後は、津波など二次的な危険についても情報を確認します。",nextSceneId:"quake2"}
]},
{id:"volcano1",title:"火山：情報を確認する",text:"火山の活動が活発になり、避難についての情報が出ました。どうしますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/Shin-moe%20Eruption%202011%200127.jpg?width=1000",credit:"Ray_go / Wikimedia Commons・CC BY-SA 3.0",url:"https://commons.wikimedia.org/wiki/File:Shin-moe_Eruption_2011_0127.jpg"},requiredLearning:["information","action"],choices:[
{text:"火山の状況と避難情報を確認し、地域で決められた行動を考える",effects:{information:1,action:1},result:"火山の状況と避難情報を確認しました。",point:"火山災害では、火山活動の状況や避難に関する情報を確認して行動します。",nextSceneId:"volcano2"},
{text:"いつもの道なら安全だと考えて動く",effects:{action:-1,safety:-1},result:"火山の状況によって危険が変わることを見落としました。",point:"災害時は最新の情報をもとに安全を考えます。",nextSceneId:"volcano2"},
{text:"情報は見ずに様子を見る",effects:{information:-1,action:-1},result:"避難の判断が遅れる可能性があります。",point:"状況が変化する災害では、情報を確認して行動することが大切です。",nextSceneId:"volcano2"}
]},
{id:"snow1",title:"大雪：安全を確かめる",text:"大雪が続き、道路や交通にも影響が出ています。どうしますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/Mount%20Ibuki%20drive-way%202011-03-16.jpg?width=1000",credit:"Alpsdake / Wikimedia Commons・CC0",url:"https://commons.wikimedia.org/wiki/File:Mount_Ibuki_drive-way_2011-03-16.jpg"},requiredLearning:["information","action"],choices:[
{text:"雪の状況や交通情報を確認し、安全を優先して行動する",effects:{information:1,action:1,safety:1},result:"雪と交通の状況を確認し、安全を優先しました。",point:"大雪では、道路や交通の状況を確認し、無理な外出を避けるなど安全を考えます。",nextSceneId:"snow2"},
{text:"いつも通り出かける",effects:{action:-1,safety:-1},result:"道路や交通の状況を十分に考えませんでした。",point:"大雪のときは、普段と状況が変わっていることを考えます。",nextSceneId:"snow2"},
{text:"雪が降っているだけなので気にしない",effects:{information:-1,safety:-1},result:"交通などへの影響を見落としました。",point:"雪の量や道路の状況によって、くらしへの影響は変わります。",nextSceneId:"snow2"}
]},
{id:"rain2",title:"大雨・洪水：避難する",text:"雨が強くなり、避難することになりました。安全に避難するために、何を考えますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/%E4%BB%A4%E5%92%8C8%E5%B9%B48%E6%9C%88%E5%8D%83%E8%91%89%E8%B1%AA%E9%9B%A8%E5%BE%8C%E3%81%AE%E5%BC%81%E5%A4%A9%E3%82%A2%E3%83%B3%E3%83%80%E3%83%BC%E3%83%91%E3%82%B9.jpg?width=1000",credit:"Misei sen / Wikimedia Commons・CC0",url:"https://commons.wikimedia.org/wiki/File:令和8年8月千葉豪雨後の弁天アンダーパス.jpg"},requiredLearning:["information","action"],choices:[{text:"危険な場所を避け、安全な場所へ向かう",effects:{safety:1,action:1},result:"安全を優先して避難しました。",point:"大雨や洪水では、川や低い土地などの危険を避けて、安全な場所へ向かいます。",nextSceneId:"b5"},{text:"川の近くを通って、できるだけ早く向かう",effects:{safety:-2,action:-1},result:"危険な場所を通ることになりました。",point:"早く着くことだけでなく、危険な場所を避けることが大切です。",nextSceneId:"b5"},{text:"周りの人が行くまで待つ",effects:{action:-1,safety:-1},result:"避難が遅れる可能性があります。",point:"自分でも情報を確認し、安全な行動を考えることが大切です。",nextSceneId:"b5"}]},
{id:"quake2",title:"地震・津波：避難する",text:"強い揺れがおさまり、津波の情報が出ています。あなたはどうしますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/Reaching%20Higher%20Ground-%20Kadena%20Air%20Base%20and%20Chatan%20Town%20Test%20Tsunami%20Evacuation%20Procedures%20%289950979%29.jpg?width=1000",credit:"U.S. Air Force / Wikimedia Commons・Public Domain",url:"https://commons.wikimedia.org/wiki/File:Reaching_Higher_Ground-_Kadena_Air_Base_and_Chatan_Town_Test_Tsunami_Evacuation_Procedures_(9950979).jpg"},requiredLearning:["information","action"],choices:[{text:"情報を確認し、安全な高い場所へ向かう",effects:{information:1,action:1,safety:1},result:"情報を確認し、安全な場所へ向かいました。",point:"津波の危険があるときは、情報を確認し、できるだけ安全な場所へ避難します。",nextSceneId:"b5"},{text:"荷物を取りに家へ戻る",effects:{action:-2,safety:-2},result:"危険な場所へ戻ってしまいました。",point:"津波から身を守るため、荷物よりも命を守る行動を優先します。",nextSceneId:"b5"},{text:"海の様子を見に行く",effects:{action:-2,safety:-2},result:"危険な場所へ近づいてしまいました。",point:"津波の様子を見に行かず、安全な場所から情報を確認します。",nextSceneId:"b5"}]},
{id:"volcano2",title:"火山：避難する",text:"避難の呼びかけが出ました。あなたはどう行動しますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/Shinmoe-dake%20Volcano%20Erupts%20on%20Kyushu%20Feb%202011.jpg?width=1000",credit:"NASA / Wikimedia Commons・Public Domain",url:"https://commons.wikimedia.org/wiki/File:Shinmoe-dake_Volcano_Erupts_on_Kyushu_Feb_2011.jpg"},requiredLearning:["information","action"],choices:[{text:"避難情報を確認し、決められた安全な場所へ向かう",effects:{information:1,action:1,safety:1},result:"情報を確認して、安全な場所へ向かいました。",point:"火山災害では、火山の状況や避難情報を確認して行動します。",nextSceneId:"b5"},{text:"噴火の様子を近くで見てから決める",effects:{action:-2,safety:-2},result:"危険な場所に近づいてしまいました。",point:"災害の様子を見に行くのではなく、情報を確認して安全を優先します。",nextSceneId:"b5"},{text:"いつもの道をそのまま進む",effects:{action:-1,safety:-1},result:"状況に合った避難を考えられませんでした。",point:"災害時は、最新の情報をもとに安全な行動を選びます。",nextSceneId:"b5"}]},
{id:"snow2",title:"大雪：安全を守る",text:"大雪が続き、道路や交通への影響が大きくなっています。どうしますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/Heavy%20snow%20on%20the%20car%20roof%20in%20Feb%202004%20Japan.jpg?width=1000",credit:"tsuda / Wikimedia Commons・CC BY-SA 2.0",url:"https://commons.wikimedia.org/wiki/File:Heavy_snow_on_the_car_roof_in_Feb_2004_Japan.jpg"},requiredLearning:["information","action"],choices:[{text:"最新の情報を確認し、無理な外出を避ける",effects:{information:1,action:1,safety:1},result:"雪と交通の状況を確認し、安全を優先しました。",point:"大雪では、道路や交通の情報を確認し、無理をしないことも大切です。",nextSceneId:"b5"},{text:"予定どおり、いつもと同じように出かける",effects:{action:-2,safety:-2},result:"道路や交通の状況を十分に考えませんでした。",point:"大雪のときは、普段と状況が変わっていることを考えます。",nextSceneId:"b5"},{text:"地域の情報を確認せずに判断する",effects:{information:-2,safety:-1},result:"地域の状況を見落としました。",point:"大雪のときは、地域の道路や交通などの情報を確認します。",nextSceneId:"b5"}]}
],
cooperation:[
{id:"b5",title:"みんなで助け合う",text:"災害が起こり、地域の避難場所に人が集まりました。高齢の人や小さな子どもなど、支えが必要な人もいます。地域ではどうしますか。",image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/374%20AW%20supports%20Big%20Rescue%20Kanagawa%202026%20%289908016%29.jpg?width=1000",credit:"U.S. Air Force / Wikimedia Commons・Public Domain",url:"https://commons.wikimedia.org/wiki/File:374_AW_supports_Big_Rescue_Kanagawa_2026_(9908016).jpg"},requiredLearning:["cooperation","life"],choices:[
{text:"できることを分担し、困っている人を支える",effects:{cooperation:1,safety:1},result:"地域の人が役割を分担して、避難生活を支えました。",point:"災害時には、地域の人々だけでなく、自治体や関係機関なども協力して人々を支えます。"},
{text:"それぞれ自分のことだけを考える",effects:{cooperation:-1,safety:-1},result:"困っている人への支援が遅れました。",point:"地域で支え合うことも、災害への備えの一つです。"},
{text:"一人の人に全部まかせる",effects:{cooperation:-1},result:"負担が一人に集中しました。",point:"役割を分担し、いろいろな人が協力することが大切です。"}
]}
]
},
EVENTS:[]
};