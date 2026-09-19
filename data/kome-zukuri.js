/* 米づくりゲームブック：シナリオデータ
 * このファイルはゲームエンジンから分離されています。
 * 将来は自動車づくり・ニュースづくりなどを別データとして追加できます。
 */
const KOME_ZUKURI_DATA = {
  meta: {
    id: "kome-zukuri",
    title: "米づくりゲームブック",
    icon: "🌾",
    lead: "きみは米農家。春の準備から秋の収穫まで、<br>一年間の判断を体験しよう。",
    endingLabel: "あなたの一年",
    endingText: "一年間、あなたはたくさんの判断をしながら米づくりを進めました。今回は {{eventCount}} 件のできごとを経験しました。",
    footerNote: "むずかしい判断に「絶対の正解」はありません。結果を見て、次はどうするか考えてみよう。",
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
      text:"稲が実り、収穫の時期になりました。コンバインなどを使って、どのように収穫するか考えます。",
      image:{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Combine_harvester_Kyoto_JPN_001.jpg?width=800","credit":"ignis / Wikimedia Commons・CC BY-SA 3.0","url":"https://commons.wikimedia.org/wiki/File:Combine_harvester_Kyoto_JPN_001.jpg"},
      requiredLearning:["tech"],
      educationalIntent:"機械化によって収穫の効率が上がる一方、機械の点検が欠かせないことを考えさせる。",
      choices:[
        {text:"コンバインで刈り取り、脱穀まで行う", effects:{"efficiency":1,"quality":0},
         result:"刈り取りと脱穀を続けて行うことができました。",
         point:"コンバインは稲を刈り取り、その場で脱穀して、もみを集めます。"},
        {text:"コンバインを点検してから、収穫を始める", effects:{"efficiency":1,"quality":1},
         result:"機械の状態を確認してから、収穫作業を進めることができました。",
         point:"機械を使う農作業では、点検や整備も重要です。"},
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
        {text:"適切な温度と時間を確認しながら乾燥する", effects:{"quality":1,"efficiency":0},
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
        {text:"出荷前の検査や選別の結果を確認してから出す", effects:{"quality":1,"efficiency":0},
         result:"米の状態を確認してから、次の流通へ届けました。",
         point:"収穫後も、品質を確認しながら米が流通していきます。"}
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
      {text:"そのままにしておく", effects:{"water":-1,"growth":-1}, result:"数日後、水はけの悪い場所で根の育ちが悪くなってしまいました。",
       point:"自然の変化をそのままにすると、後で影響が出ることがあります。"},
      {text:"排水路を調整して水を減らす", effects:{"water":1,"growth":1}, result:"水の量が落ち着き、稲への影響を抑えることができました。",
       point:"天候の変化に合わせて、こまめに調整することが大切です。"},
      {text:"様子を見に行って確認する", effects:{"growth":1,"efficiency":-1}, result:"すぐに大きな問題はないとわかり、安心して次の作業に移れました。",
       point:"実際に見て確認することで、必要な対応が見えてきます。"}
    ]
  },
  {
    id:"ev_taifu", name:"台風", stages:["autumn"], weight:2,
    title:"台風接近", text:"台風が近づいています。収穫の時期が近づいているところです。",
    requiredLearning:["natural"],
    educationalIntent:"台風のような自然災害に対し、収穫のタイミングをどう判断するかを考えさせる。",
    choices:[
      {text:"予定通り収穫する", effects:{"growth":-1,"quality":-1}, result:"収穫は間に合いましたが、急いだため一部の作業が雑になりました。",
       point:"予定を守ることと、安全・確実さのバランスが求められます。"},
      {text:"天気をさらに確認してから決める", effects:{"growth":1,"efficiency":-1}, result:"最新の情報をもとに、無理のない範囲で収穫を終えられました。",
       point:"最新の天候情報を確認することが、判断の助けになります。"},
      {text:"地域の農家と相談する", effects:{"cooperation":1,"growth":1}, result:"周りの農家と協力し、被害を抑えながら収穫を進められました。",
       point:"一人で判断が難しいときは、周囲との相談が力になります。"}
    ]
  },
  {
    id:"ev_kouon", name:"高温", stages:["summer"], weight:2,
    title:"猛暑が続く", text:"厳しい暑さが続いています。稲の様子がいつもと少し違って見えます。",
    requiredLearning:["natural","water"],
    educationalIntent:"高温という自然条件の変化に、水管理などで対応する工夫を考えさせる。",
    choices:[
      {text:"特に何もせず様子を見る", effects:{"water":-1,"growth":-1}, result:"稲が水不足気味になり、生育に少し影響が出ました。",
       point:"暑さが続くときは、早めの対応が必要になることがあります。"},
      {text:"水を多めに入れて田んぼを冷やす", effects:{"water":1,"growth":1}, result:"稲への負担が和らぎ、生育が落ち着きました。",
       point:"水の管理は、暑さから稲を守る工夫にもなります。"},
      {text:"日中の作業を控え、朝夕に作業する", effects:{"efficiency":-1,"growth":1}, result:"作業の負担を減らしつつ、田んぼの確認もできました。",
       point:"気候に合わせて、作業の時間帯を工夫することも大切です。"}
    ]
  },
  {
    id:"ev_mizubusoku", name:"水不足", stages:["summer"], weight:2,
    title:"水不足", text:"雨が少なく、田んぼの水位が下がってきています。",
    requiredLearning:["water"],
    educationalIntent:"限られた水資源をどう配分し管理するかを考えさせる。",
    choices:[
      {text:"近くの用水路から多めに水を引く", effects:{"water":1,"cooperation":-1}, result:"田んぼの水は保てましたが、他の田んぼとの調整が必要になりました。",
       point:"水は地域で共有する資源でもあるため、調整が欠かせません。"},
      {text:"必要な分だけ水を引き、様子を見る", effects:{"water":1,"growth":0}, result:"最低限の水を保ちながら、大きな影響を防げました。",
       point:"限られた水を無駄なく使う工夫が求められます。"},
      {text:"地域で話し合って水を分け合う", effects:{"water":1,"cooperation":1}, result:"みんなで分け合うことで、どの田んぼも大きな被害を防げました。",
       point:"水の管理には、地域全体の協力が関わっています。"}
    ]
  },
  {
    id:"ev_gaichu", name:"害虫", stages:["summer"], weight:3,
    title:"害虫の発生", text:"田んぼの一部で、稲の葉に虫による被害が見つかりました。",
    requiredLearning:["quality","observe"],
    educationalIntent:"病害虫への対策には複数の方法があり、それぞれに利点と課題があることを考えさせる。",
    choices:[
      {text:"すぐに農薬を使う", effects:{"quality":1,"efficiency":-1}, result:"被害の広がりは防げましたが、費用と手間がかかりました。",
       point:"素早い対応にも、コストという別の面があります。"},
      {text:"被害の範囲をよく確認する", effects:{"quality":1,"growth":1}, result:"被害が一部だけとわかり、必要な範囲だけ対応できました。",
       point:"まず状況を確認することで、無駄のない対応につながります。"},
      {text:"しばらく様子を見る", effects:{"quality":-1,"growth":-1}, result:"被害が少し広がってしまい、後から対応が必要になりました。",
       point:"対応が遅れると、被害が広がる場合もあります。"}
    ]
  },
  {
    id:"ev_kikai", name:"機械トラブル", stages:["spring","autumn","post"], weight:2,
    title:"機械トラブル", text:"作業中に、使っていた機械の調子が悪くなってしまいました。",
    requiredLearning:["tech"],
    educationalIntent:"機械化された農業には、故障やメンテナンスという課題も伴うことを考えさせる。",
    choices:[
      {text:"自分で応急処置をする", effects:{"efficiency":1,"quality":-1}, result:"作業を止めずに済みましたが、根本的な修理は後回しになりました。",
       point:"応急処置には、その場をしのぐ良さと限界の両方があります。"},
      {text:"専門の業者に修理を頼む", effects:{"efficiency":-1,"quality":1}, result:"時間はかかりましたが、しっかりと直すことができました。",
       point:"機械の維持には、専門家の力を借りることも必要です。"},
      {text:"手作業に切り替えて作業を続ける", effects:{"efficiency":-1,"cooperation":1}, result:"時間はかかりましたが、作業を止めずに終えられました。",
       point:"機械が使えないときの備えを持つことも大切です。"}
    ]
  },
  {
    id:"ev_drone", name:"ドローン導入", stages:["summer"], weight:2,
    title:"新しい技術の提案", text:"知り合いの農家から、ドローンを使った農薬散布を試してみないかと誘われました。",
    requiredLearning:["tech"],
    educationalIntent:"新しい技術によって作業を効率化できる一方、導入や利用には条件があることを考えさせる。",
    choices:[
      {text:"導入してみる", effects:{"efficiency":1,"quality":1}, result:"広い田んぼでも短時間で作業でき、負担が減りました。",
       point:"新しい技術には、作業を効率化できるという良さがあります。"},
      {text:"費用や使い方をよく調べてから考える", effects:{"efficiency":-1,"quality":1}, result:"じっくり調べた結果、必要な部分だけ取り入れることにしました。",
       point:"新しい技術には、費用や操作方法などの条件もあります。"},
      {text:"今回は見送り、今まで通りにする", effects:{"efficiency":-1}, result:"大きな変化はありませんでしたが、導入のタイミングを見直すことにしました。",
       point:"新しい技術を使うかどうかも、農家の判断の一つです。"}
    ]
  },
  {
    id:"ev_kyouryoku", name:"地域の農家との協力", stages:["spring","autumn"], weight:2,
    title:"地域の農家から声かけ", text:"近くの農家から、作業を手伝い合わないかと声をかけられました。",
    requiredLearning:["society"],
    educationalIntent:"米づくりが個人だけでなく地域のつながりによって支えられていることを考えさせる。",
    choices:[
      {text:"協力する", effects:{"cooperation":1,"efficiency":1}, result:"作業がはかどり、困ったときに助け合える関係もできました。",
       point:"地域の助け合いが、米づくりを支える力になっています。"},
      {text:"自分の作業を優先する", effects:{"cooperation":-1}, result:"自分の田んぼの作業は予定通り進みましたが、協力の機会は逃しました。",
       point:"協力にはお互いの都合を合わせる難しさもあります。"},
      {text:"できる範囲で少しだけ協力する", effects:{"cooperation":1,"efficiency":-1}, result:"無理のない範囲で助け合うことができました。",
       point:"協力の形は一つではなく、状況に合わせて選ぶことができます。"}
    ]
  }
]
};