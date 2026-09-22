/* 米づくりゲームブック：シナリオデータ
 * このファイルはゲームエンジンから分離されています。
 * 将来は自動車づくり・ニュースづくりなどを別データとして追加できます。
 */
const KOME_ZUKURI_DATA = {
  meta: {
    startImage: "https://tt-sensei.github.io/navi-character-/assets/web/groups/group-thinking.webp",
    id: "kome-zukuri",
    title: "米づくりゲームブック",
    icon: "米",
    lead: "きみは米農家。春の準備から秋の収穫まで、<br>一年間の判断を体験しよう。",
    endingLabel: "あなたの一年",
    endingText: "一年間、あなたはたくさんの判断をしながら米づくりを進めました。今回は {{eventCount}} 件のできごとを経験しました。",
    footerNote: "むずかしい判断に「絶対の正解」はありません。結果を見て、次はどうするか考えてみよう。※作業の時期や方法は、地域・天候・品種などによって異なります。",
    navi: [
      { src: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/riku/expressions/03-thinking.png", eventSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/riku/expressions/05-surprised.png", resultSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/riku/expressions/07-encouraging.png", message: "田んぼの様子をよく見て、考えてみよう。" },
      { src: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/sora/expressions/03-thinking.png", eventSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/sora/expressions/06-troubled.png", resultSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/sora/expressions/07-encouraging.png", message: "どの方法にも、よさと課題がありそうだね。" },
      { src: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/kai/expressions/04-idea.png", eventSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/kai/expressions/05-surprised.png", resultSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/kai/expressions/10-confident.png", message: "この選択のあと、何が起こるか考えてみよう。" },
      { src: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/saku/expressions/03-thinking.png", eventSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/saku/expressions/06-troubled.png", resultSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/saku/expressions/07-encouraging.png", message: "「どうして？」を一つ見つけてみよう。" },
      { src: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/tsuki/expressions/04-idea.png", eventSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/tsuki/expressions/05-surprised.png", resultSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/tsuki/expressions/08-celebrating.png", message: "自然と人の工夫に注目してみよう。" },
      { src: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/nami/expressions/03-thinking.png", eventSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/nami/expressions/06-troubled.png", resultSrc: "https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/nami/expressions/07-encouraging.png", message: "選んだ理由を、あとで説明できるかな？" }
    ]
  },
  REQUIRED_LEARNING: {
  natural: "自然条件に合わせて仕事をする",
  water:   "水を適切に管理する",
  observe: "稲の成長や田んぼの様子を観察する",
  tech:    "機械や技術を活用する",
  quality: "品質や安全を考える",
  society: "収穫・出荷まで多くの人や仕組みが関わる"
},
  STAGES: {
  spring:  { label:"春",     color:"#7FA65C" },
  summer:  { label:"夏",     color:"#3E8C55" },
  autumn:  { label:"秋",     color:"#C89B3C" },
  post:    { label:"収穫後", color:"#8B6B4A" }
},
  STAGE_ORDER: ["spring","summer","autumn","post"],
  CORE_SCENES: {
  spring: [
    {
      id:"req_spring_1", title:"苗づくり",
      text:"春になりました。種もみをまき、田植えまで苗を育てます。温度や水の量を見ながら、どんな育て方をするか考えます。",
      image:{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Paddy_Seedlings.jpg?width=800","credit":"Prajna Prabhu / Wikimedia Commons・CC BY-SA 4.0","url":"https://commons.wikimedia.org/wiki/File:Paddy_Seedlings.jpg"},
      requiredLearning:["observe","natural"],
      educationalIntent:"苗づくりには水量・温度の調整という人の判断が必要なことを考えさせる。",
      choices:[
        {text:"水の量をこまめに確認し、温度も見ながら育てる", effects:{"water":1,"growth":1},
         result:"苗の状態に合わせて管理でき、田植えに向けて順調に育ちました。",
         point:"育苗では温度や水分などを調整しながら苗を育てます。"},
        {text:"水を多めにして、温度はあまり気にしない", effects:{"water":1,"growth":-1},
         result:"水分は保てましたが、温度の変化への対応が遅れました。",
         point:"苗は温度や水分など、いくつかの条件を見ながら育てます。"},
        {text:"水やりを控えめにして、苗の様子を見る", effects:{"water":-1,"growth":0},
         result:"苗の状態を見ながら調整しましたが、水分が不足する場面もありました。",
         point:"苗の様子を確かめながら、水分を調整することが大切です。"}
      ]
    },
    {
      id:"req_spring_2", title:"田起こし・代かき",
      text:"田んぼの土を耕し、水を入れて平らにする「代かき」を行います。田面の状態を見ながら、どのように進めるか考えます。",
      image:{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Rice_Paddy_Tractor_(27732883990).jpg?width=800","credit":"D-Stanley / Wikimedia Commons・CC BY 2.0","url":"https://commons.wikimedia.org/wiki/File:Rice_Paddy_Tractor_(27732883990).jpg"},
      requiredLearning:["tech","natural"],
      educationalIntent:"田起こし・代かきには機械の力が必要なことと、丁寧さが品質につながることを考えさせる。",
      choices:[
        {text:"トラクターで田起こし・代かきを行う", effects:{"efficiency":1,"growth":0},
         result:"機械の力で広い田んぼを効率よく整えることができました。",
         point:"現在の米づくりでは、田起こしや代かきにトラクターが使われています。"},
        {text:"田面の高低や土の状態を確認して仕上げる", effects:{"efficiency":-1,"growth":1},
         result:"時間はかかりましたが、田面の状態を確かめながら仕上げることができました。",
         point:"代かきには、田面を平らにし、水を保ちやすくする役割があります。"},
        {text:"昨年と同じ設定で進め、仕上がりは最後に確認する", effects:{"efficiency":1,"growth":-1},
         result:"作業は進みましたが、田んぼごとの状態を途中で調整する機会が少なくなりました。",
         point:"田んぼの状態や天候などに合わせて作業を調整することもあります。"}
      ]
    },
    {
      id:"req_spring_3", title:"田植え",
      text:"育てた苗を田んぼに植える時期になりました。機械と人の手、それぞれの使い方を考えて進めます。",
      image:{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Rice_transplanter_working_in_a_paddy_field,_Kameoka_-_May_19,_2005.jpg?width=800","credit":"Peggy (Pei-Yi) Chen / Wikimedia Commons・CC BY-SA 2.0","url":"https://commons.wikimedia.org/wiki/File:Rice_transplanter_working_in_a_paddy_field,_Kameoka_-_May_19,_2005.jpg"},
      requiredLearning:["tech","society"],
      educationalIntent:"田植えには機械や人手、地域のつながりが関わることを考えさせる。",
      choices:[
        {text:"田植え機で植える", effects:{"efficiency":1,"cooperation":0},
         result:"広い面積を機械で植えることができました。",
         point:"現在の田植えは、田植え機で行うことが多くなっています。"},
        {text:"機械で植えたあと、植え残しを手で植える", effects:{"efficiency":1,"cooperation":0},
         result:"機械で植えたあと、機械では植えにくい場所を手で補いました。",
         point:"田んぼの端など、機械で植えにくい場所は手植えをすることがあります。"},
        {text:"手植えを中心にして、必要な人に声をかける", effects:{"efficiency":-1,"cooperation":1},
         result:"人手を集めて植えることができましたが、時間は多くかかりました。",
         point:"手植えは時間がかかりますが、機械が使えない場所などで行われます。"}
      ]
    }
  ],
  summer: [
    {
      id:"req_summer_1", title:"水管理",
      text:"夏になり、稲が育っています。水はいつも同じ量ではなく、生育の段階や天候を見ながら管理します。今の田んぼをどうするか考えます。",
      image:{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Paddy_field_and_Drainage_System.jpg?width=800","credit":"Kamilmkm / Wikimedia Commons・CC BY-SA 4.0","url":"https://commons.wikimedia.org/wiki/File:Paddy_field_and_Drainage_System.jpg"},
      requiredLearning:["water","natural"],
      educationalIntent:"稲の成長段階に応じて水の量を調整する必要があることを考えさせる。",
      choices:[
        {text:"生育の段階に合わせて水深を調整する", effects:{"water":1,"growth":1},
         result:"稲の状態を見ながら水を調整し、生育を支えることができました。",
         point:"水田では、生育に応じて水の量を変えます。中干しや落水を行う時期もあります。"},
        {text:"水を切らさないよう、できるだけ水をためておく", effects:{"water":0,"growth":-1},
         result:"水は確保できましたが、生育段階に合わない水管理になりました。",
         point:"水は多ければよいわけではなく、生育段階に応じた管理が必要です。"},
        {text:"雨や田んぼの状態を見て、水を入れたり抜いたりする", effects:{"water":1,"growth":0},
         result:"天候に合わせて水を調整できましたが、こまめな確認が必要でした。",
         point:"水管理では、天候や稲の状態を見ながら調整します。"}
      ]
    },
    {
      id:"req_summer_2", title:"稲の成長確認",
      text:"稲の生育が進み、穂が出る時期が近づいてきました。田んぼの様子をどう確かめるか考えます。",
      image:{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Rice_Paddy_Field.jpg?width=800","credit":"Prathvi Acharya / Wikimedia Commons・CC BY 4.0","url":"https://commons.wikimedia.org/wiki/File:Rice_Paddy_Field.jpg"},
      requiredLearning:["observe"],
      educationalIntent:"定期的な観察が病害虫の早期発見や収穫時期の判断につながることを考えさせる。",
      choices:[
        {text:"毎日田んぼを見に行く", effects:{"growth":1,"efficiency":-1},
         result:"小さな変化にも早く気づくことができました。",
         point:"こまめな観察が、トラブルの早期発見につながります。"},
        {text:"数日おきに様子を見る", effects:{"growth":0,"efficiency":0},
         result:"大きな問題はなかったものの、変化に気づくのが少し遅れました。",
         point:"観察の間隔が空くと、変化を見逃すことがあります。"},
        {text:"センサーのデータで確認する", effects:{"growth":1,"efficiency":1},
         result:"数値で状態を把握でき、効率よく確認することができました。",
         point:"技術を使うことで、田んぼに行かなくても状態を知ることができます。"}
      ]
    }
  ],
  autumn: [
    {
      id:"req_autumn_1", title:"収穫時期の判断",
      text:"稲穂が黄金色になってきました。天気予報を見ながら、収穫の時期を判断します。",
      image:{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Ricefield.jpg?width=800","credit":"Jfi7811 / Wikimedia Commons・CC BY 3.0","url":"https://commons.wikimedia.org/wiki/File:Ricefield.jpg"},
      requiredLearning:["natural","observe"],
      educationalIntent:"天候と稲の状態の両方を見て収穫時期を判断する必要があることを考えさせる。",
      choices:[
        {text:"予定通りの日に収穫する", effects:{"growth":-1,"quality":-1},
         result:"計画通りに進みましたが、直前の天候の変化には対応できませんでした。",
         point:"予定だけでなく、その時々の天候の確認も大切です。"},
        {text:"天気予報と稲の状態を見て日を決める", effects:{"growth":1,"quality":1},
         result:"天候の良いタイミングで、質の良い収穫を行うことができました。",
         point:"複数の情報を見て判断することで、良い結果につながりやすくなります。"},
        {text:"少し早めに収穫してしまう", effects:{"growth":-1,"quality":-1},
         result:"雨は避けられましたが、稲が十分に実りきっていませんでした。",
         point:"早すぎる判断にも、別の課題が生まれることがあります。"}
      ]
    },
    {
      id:"req_autumn_2", title:"稲刈り",
      text:"稲が実り、収穫の時期になりました。田んぼの状態や使える機械、人手などを考えて、どのように収穫するか決めます。",
      image:{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Combine_harvester_Kyoto_JPN_001.jpg?width=800","credit":"ignis / Wikimedia Commons・CC BY-SA 3.0","url":"https://commons.wikimedia.org/wiki/File:Combine_harvester_Kyoto_JPN_001.jpg"},
      requiredLearning:["tech"],
      educationalIntent:"機械化によって収穫の効率が上がる一方、機械の点検が欠かせないことを考えさせる。",
      choices:[
        {text:"コンバインで刈り取り、脱穀まで続けて行う", effects:{"efficiency":1,"quality":0},
         result:"刈り取りと脱穀を続けて行うことができました。",
         point:"コンバインは稲を刈り取り、その場で脱穀して、もみを集めます。"},
        {text:"コンバインを点検し、稲の状態も確認してから始める", effects:{"efficiency":1,"quality":1},
         result:"機械と稲の状態を確認してから、収穫作業を進めました。",
         point:"コンバインは刈り取りと脱穀を続けて行えます。安全に使うため、点検や整備も重要です。"},
        {text:"機械が入りにくい場所は、鎌で刈り取る", effects:{"efficiency":-1,"cooperation":1},
         result:"機械では刈りにくい場所を、人の手で収穫しました。",
         point:"現在でも、機械が作業できない場所などでは手刈りをすることがあります。"}
      ]
    }
  ],
  post: [
    {
      id:"req_post_1", title:"乾燥・もみすり",
      text:"収穫したもみには水分が多く含まれています。乾燥させ、もみすりをして玄米にするまでの進め方を考えます。",
      image:{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Rice_drying.jpg?width=800","credit":"MartijnL / Wikimedia Commons・CC BY-SA 3.0 NL","url":"https://commons.wikimedia.org/wiki/File:Rice_drying.jpg"},
      requiredLearning:["quality"],
      educationalIntent:"品質を保つための乾燥・調整作業の重要性を考えさせる。",
      choices:[
        {text:"乾燥機で一気に高温で乾燥させる", effects:{"quality":-1,"efficiency":1},
         result:"乾燥は早く進みましたが、米粒に負担がかかりました。",
         point:"高水分のもみを急速に乾燥すると、胴割れなど品質低下につながることがあります。"},
        {text:"もみの水分を確認し、適切な温度と時間で乾燥する", effects:{"quality":1,"efficiency":0},
         result:"もみの水分を確認しながら、適切な状態に仕上げました。",
         point:"乾燥では、急ぎすぎたり乾燥しすぎたりしないよう管理します。"},
        {text:"乾燥の状態を確認せず、機械の設定だけで進める", effects:{"quality":-1,"efficiency":1},
         result:"作業は進みましたが、もみの状態に合わせた調整ができませんでした。",
         point:"乾燥は、もみの水分や仕上がりを確認しながら行うことが大切です。"}
      ]
    },
    {
      id:"req_post_2", title:"出荷",
      text:"玄米などに仕上がった米は、集荷・販売などの仕組みを通って消費者へ届きます。どのように届けるか考えます。",
      image:{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Five_kg_rice_bags.jpg?width=800","credit":"Marcel Montes / Wikimedia Commons・CC BY-SA 2.0","url":"https://commons.wikimedia.org/wiki/File:Five_kg_rice_bags.jpg"},
      requiredLearning:["society","quality"],
      educationalIntent:"収穫後も多くの人や仕組みが関わって食卓に届くことを考えさせる。",
      choices:[
        {text:"集荷業者や農協などを通して出荷する", effects:{"cooperation":1,"quality":0},
         result:"集荷の仕組みを通して、次の流通段階へ米を届けました。",
         point:"米は生産者だけでなく、集荷・販売など多くの仕組みに支えられています。"},
        {text:"自分で販売先を決めて、直接販売する", effects:{"cooperation":1,"quality":0},
         result:"販売先とやり取りしながら、米を届けました。",
         point:"米の販売方法には、集荷を通す方法だけでなく、直接販売などもあります。"},
        {text:"品質や出荷条件を確認してから、次の流通へ届ける", effects:{"quality":1,"efficiency":0},
         result:"米の状態を確認してから、次の流通へ届けました。",
         point:"米は品質や出荷条件を確認しながら、集荷・販売などの流通へ進みます。"}
      ]
    }
  ]
},
  FLOW_CHECKPOINTS: [
    {id:"flow1",afterId:"req_spring_1",title:"次は、何をする？",text:"苗づくりができました。田植えの前に、次はどんな仕事をするでしょう？",correctLabel:"田起こし・代かき（しろかき）",choices:[
      {text:"稲刈り",hint:"稲刈りは、稲が十分に育った秋の仕事です。"},
      {text:"田起こし・代かき（しろかき）",correct:true,feedback:"土を起こして、田んぼを平らに整える仕事だね。次は田植えへ！"},
      {text:"乾燥・もみすり",hint:"乾燥・もみすりは、稲を刈り取ったあとの仕事です。"},
      {text:"出荷",hint:"出荷は、米を仕上げたあとに行います。"}]},
    {id:"flow2",afterId:"req_spring_2",title:"次は、何をする？",text:"田起こし・代かきが終わりました。土を整えた田んぼで、次は何をするでしょう？",correctLabel:"田植え",choices:[
      {text:"田植え",correct:true,feedback:"土を整えたら、いよいよ田植え。苗を田んぼに植えていこう！"},
      {text:"稲刈り",hint:"稲刈りは、稲が実った秋に行います。"},
      {text:"もみすり",hint:"もみすりは、稲刈りのあとに行います。"},
      {text:"出荷",hint:"出荷は、米を仕上げた最後のほうの仕事です。"}]},
    {id:"flow3",afterId:"req_spring_3",title:"次は、何をする？",text:"苗を田んぼに植えました。これから稲が育つ間、何を大切にするでしょう？",correctLabel:"水管理",choices:[
      {text:"水管理",correct:true,feedback:"稲の成長に合わせて水を管理しながら、しっかり育てていこう！"},
      {text:"出荷",hint:"まだ稲は育っている途中です。"},
      {text:"乾燥・もみすり",hint:"乾燥・もみすりは、稲刈りのあとです。"},
      {text:"稲刈り",hint:"稲が実るまで、もう少し時間が必要です。"}]},
    {id:"flow4",afterId:"req_summer_2",title:"次は、何をする？",text:"稲が大きく育ってきました。穂が実って収穫の時期が近づいたら、次は何をするでしょう？",correctLabel:"稲刈り",choices:[
      {text:"田植え",hint:"田植えは、苗を育てた春の仕事です。"},
      {text:"稲刈り",correct:true,feedback:"稲が実ったら稲刈り。収穫のタイミングを考えて刈り取ろう！"},
      {text:"田起こし・代かき",hint:"田起こし・代かきは、田植えの前に行いました。"},
      {text:"苗づくり",hint:"苗づくりは、米づくりのはじめの仕事です。"}]},
    {id:"flow5",afterId:"req_autumn_2",title:"次は、何をする？",text:"稲を刈り取りました。刈った稲から、食べられる米に近づけるため、次は何をするでしょう？",correctLabel:"乾燥・もみすり",choices:[
      {text:"水管理",hint:"水管理は、稲が田んぼで育っている間の仕事です。"},
      {text:"田植え",hint:"田植えは、稲刈りよりずっと前の仕事です。"},
      {text:"乾燥・もみすり",correct:true,feedback:"収穫した稲を乾燥させ、もみすりをして米に近づけます。次は出荷へ！"},
      {text:"苗づくり",hint:"苗づくりは、米づくりのはじめの仕事です。"}]},
    {id:"flow6",afterId:"req_post_1",title:"次は、何をする？",text:"乾燥・もみすりを終え、米が仕上がりました。最後の大切な仕事は何でしょう？",correctLabel:"出荷",choices:[
      {text:"田起こし・代かき",hint:"田起こし・代かきは、春のはじめの仕事です。"},
      {text:"出荷",correct:true,feedback:"仕上がった米を出荷して、消費者へ届けます。これで一年の流れがつながったね！"},
      {text:"田植え",hint:"田植えは、苗を田んぼに植える春の仕事です。"},
      {text:"水管理",hint:"水管理は、稲が田んぼで育つ間の仕事です。"}]}
  ],
  EVENTS: [
  {
    id:"ev_nagame", name:"長雨", stages:["spring","summer"], weight:3,
    title:"長雨", text:"雨が何日も続いています。田んぼを見ると、水が多くたまっているようです。",
    image:{src:"https://commons.wikimedia.org/wiki/Special:FilePath/Grey_cloudy_sky.jpg?width=800",credit:"Gnu-Bricoleur / Wikimedia Commons・CC BY 4.0",url:"https://commons.wikimedia.org/wiki/File:Grey_cloudy_sky.jpg"},
    requiredLearning:["natural","water"],
    educationalIntent:"農業は自然条件の影響を受けるため、天候を見ながら対応する必要があることを考えさせる。",
    choices:[
      {text:"田んぼの水位と排水の様子を確認する", effects:{"water":1,"growth":0}, result:"水のたまり方を確認し、必要な場所を調整しました。",
       point:"長雨のときは、田んぼの水の状態を確認して対応します。"},
      {text:"排水口を調整して水を抜く", effects:{"water":1,"growth":1}, result:"余分な水を抜き、田んぼの状態を整えました。",
       point:"水が多すぎるときは、排水を調整することがあります。"},
      {text:"雨がやむまで作業をせず、天候を見守る", effects:{"water":-1,"growth":-1}, result:"雨の間に水位が上がり、対応が後手になりました。",
       point:"天候を見ながら、必要な管理を行うことが大切です。"}
    ]
  },
  {
    id:"ev_taifu", name:"台風", stages:["autumn"], weight:2,
    title:"台風接近", text:"台風が近づいています。収穫の時期が近づいているところです。",
    requiredLearning:["natural"],
    educationalIntent:"台風のような自然災害に対し、収穫のタイミングをどう判断するかを考えさせる。",
    choices:[
      {text:"天気予報と稲の状態を確認して収穫日を決める", effects:{"growth":1,"quality":1}, result:"稲の状態と天候を確認して、収穫日を決めました。",
       point:"収穫は稲の成熟度や天候などを見て判断します。"},
      {text:"予定していた日に収穫する", effects:{"growth":-1,"quality":-1}, result:"予定通り進めましたが、その後の天候によって対応が必要になりました。",
       point:"収穫時期は、予定だけでなく稲や天候の状態も見て判断します。"},
      {text:"近くの農家と情報を共有してから決める", effects:{"cooperation":1,"growth":0}, result:"周りの農家と情報を共有し、収穫の予定を調整しました。",
       point:"農家どうしで情報を交換することも、判断の助けになります。"}
    ]
  },
  {
    id:"ev_kouon", name:"高温", stages:["summer"], weight:2,
    title:"猛暑が続く", text:"厳しい暑さが続いています。稲の様子がいつもと少し違って見えます。",
    requiredLearning:["natural","water"],
    educationalIntent:"高温という自然条件の変化に、水管理などで対応する工夫を考えさせる。",
    choices:[
      {text:"田んぼの水の量と稲の様子を確認する", effects:{"water":1,"growth":1}, result:"水の状態を確認し、必要な管理を行いました。",
       point:"高温の時期は、水管理を含めて稲の状態を確認することが重要です。"},
      {text:"水をいつもより多く入れて、そのままにする", effects:{"water":1,"growth":0}, result:"水は確保できましたが、生育段階に合わせた調整はできませんでした。",
       point:"暑い時期でも、水量は生育や田んぼの状態を見て調整します。"},
      {text:"日中を避け、朝夕に田んぼを確認する", effects:{"efficiency":-1,"growth":1}, result:"暑い時間帯の作業を減らしながら、稲の状態を確認しました。",
       point:"暑さの中では、作業時間を工夫することもできます。"}
    ]
  },
  {
    id:"ev_mizubusoku", name:"水不足", stages:["summer"], weight:2,
    title:"水不足", text:"雨が少なく、田んぼの水位が下がってきています。",
    requiredLearning:["water"],
    educationalIntent:"限られた水資源をどう配分し管理するかを考えさせる。",
    choices:[
      {text:"必要な量だけ水を引き、田んぼの様子を確認する", effects:{"water":1,"growth":0}, result:"必要な分の水を確保し、稲の状態を確認しました。",
       point:"水不足のときは、必要な量を考えながら水を使います。"},
      {text:"地域の農家と水の使い方を相談する", effects:{"water":1,"cooperation":1}, result:"水の使い方を相談し、地域で調整しました。",
       point:"農業用水は地域で利用するため、調整や話し合いが大切です。"},
      {text:"できるだけ多くの水を自分の田んぼに入れる", effects:{"water":1,"cooperation":-1}, result:"自分の田んぼの水は確保できましたが、周囲との調整が必要になりました。",
       point:"水不足のときは、地域全体で水をどう使うかも考える必要があります。"}
    ]
  },
  {
    id:"ev_gaichu", name:"害虫", stages:["summer"], weight:3,
    title:"害虫の発生", text:"田んぼの一部で、稲の葉に虫による被害が見つかりました。",
    requiredLearning:["quality","observe"],
    educationalIntent:"病害虫への対策には複数の方法があり、それぞれに利点と課題があることを考えさせる。",
    choices:[
      {text:"被害の広がりと虫の種類を確認する", effects:{"quality":1,"growth":1}, result:"被害の範囲を確認し、対応を考える材料を集めました。",
       point:"病害虫への対応では、発生状況を確認してから適切な方法を選びます。"},
      {text:"発生予察や地域の情報を確認して対応を考える", effects:{"quality":1,"efficiency":0}, result:"周囲の発生状況も確認して、対応を考えました。",
       point:"病害虫の発生予察などの情報を防除の判断に活用できます。"},
      {text:"しばらく何もせず、被害の変化を見る", effects:{"quality":-1,"growth":-1}, result:"被害が広がり、あとから対応する必要が出てきました。",
       point:"病害虫によっては、早めの確認と対応が必要です。"}
    ]
  },
  {
    id:"ev_kikai", name:"機械トラブル", stages:["spring","autumn","post"], weight:2,
    title:"機械トラブル", text:"作業中に、使っていた機械の調子が悪くなってしまいました。",
    requiredLearning:["tech"],
    educationalIntent:"機械化された農業には、故障やメンテナンスという課題も伴うことを考えさせる。",
    choices:[
      {text:"取扱説明書を確認し、自分で対応できる範囲を調べる", effects:{"efficiency":0,"quality":1}, result:"安全にできる範囲を確認してから対応しました。",
       point:"機械の不調では、安全を確認してから対応することが大切です。"},
      {text:"専門の業者や整備担当者に相談する", effects:{"efficiency":-1,"quality":1}, result:"時間はかかりましたが、専門家に点検してもらいました。",
       point:"機械の整備には、専門家の力を借りることもあります。"},
      {text:"手作業に切り替えられる部分だけ作業を続ける", effects:{"efficiency":-1,"cooperation":1}, result:"できる作業を人の手に切り替え、作業を進めました。",
       point:"機械が使えない場合に備え、別の方法を考えることもできます。"}
    ]
  },
  {
    id:"ev_drone", name:"ドローン導入", stages:["summer"], weight:2,
    title:"新しい技術の提案", text:"知り合いの農家から、農業用ドローンを使った作業を試してみないかと誘われました。導入するかどうか考えます。",
    requiredLearning:["tech"],
    educationalIntent:"新しい技術によって作業を効率化できる一方、導入や利用には条件があることを考えさせる。",
    choices:[
      {text:"すぐに導入して、作業に使ってみる", effects:{"efficiency":1,"quality":0}, result:"新しい機械を使う経験はできましたが、準備や運用の確認も必要でした。",
       point:"新しい技術は、作業方法や安全面などを確認して使います。"},
      {text:"費用・効果・使い方を調べてから判断する", effects:{"efficiency":0,"quality":1}, result:"条件を調べたうえで、自分の農業に合うかを考えました。",
       point:"スマート農業には、費用や使い方などを含めて導入を考える必要があります。"},
      {text:"今回は導入せず、今の方法を続ける", effects:{"efficiency":-1,"quality":0}, result:"今までの方法で作業を続けました。",
       point:"新しい技術を導入するかどうかは、農家が条件を考えて判断します。"}
    ]
  },
  {
    id:"ev_kyouryoku", name:"地域の農家との協力", stages:["spring","autumn"], weight:2,
    title:"地域の農家から声かけ", text:"近くの農家から、作業を手伝い合わないかと声をかけられました。",
    requiredLearning:["society"],
    educationalIntent:"米づくりが個人だけでなく地域のつながりによって支えられていることを考えさせる。",
    choices:[
      {text:"自分の作業予定を伝え、できる範囲を決めて協力する", effects:{"cooperation":1,"efficiency":0}, result:"互いの予定を調整し、できる範囲で助け合いました。",
       point:"農繁期には、作業の予定を調整しながら助け合うことがあります。"},
      {text:"今回は自分の田んぼの作業を優先する", effects:{"cooperation":-1,"efficiency":1}, result:"自分の作業は進みましたが、今回は協力できませんでした。",
       point:"地域での協力には、自分の作業との調整も必要です。"},
      {text:"作業を分担して、お互いの田んぼを順番に手伝う", effects:{"cooperation":1,"efficiency":1}, result:"作業を分担し、互いの負担を減らしました。",
       point:"農家どうしで作業を助け合うことは、地域の農業を支える方法の一つです。"}
    ]
  }
]
};