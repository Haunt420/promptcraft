// This file contains the original inlined app logic extracted from your AnyClaw export.
// We keep it mostly untouched so functionality stays identical.
// Next step: gradually refactor this into proper Vue components + composables.

export function createLegacyApp(mountEl) {
  // The legacy code expected a global document and an element with id="app".
  // We temporarily create a fake #app wrapper inside mountEl and run the code.

  const existing = mountEl.querySelector("#app");
  if (!existing) {
    const wrapper = document.createElement("div");
    wrapper.id = "app";
    wrapper.innerHTML = mountEl.innerHTML;
    mountEl.innerHTML = "";
    mountEl.appendChild(wrapper);
  }

  // --- BEGIN ORIGINAL SCRIPT ---

const TAGS = {
  participants: {
    label: 'Participants',
    tags: ['couple','threesome','foursome','group','orgy','male/female','male/male','female/female','MMF','MFF','FFM','FFF','MMM','female','male','futanari','trans female','trans male','non-binary','muscular','curvy','petite','voluptuous','athletic','thick','slender','toned','BBW','BHM','tattooed','pierced','hairy','shaved','trimmed','collared','cuffed','dom','sub','switch','master','slave']
  },
  positions: {
    label: 'Positions & Actions',
    tags: ['missionary','doggy style','reverse cowgirl','cowgirl','lotus','prone bone','spooning','scissors','standing doggy','piledriver','frogtie','pretzel dip','amazon','butterfly','mating press','G-whiz','wheelbarrow','suspended congress','tribadism','hotdogging','intercrural','docking','fellatio','cunnilingus','69','face sitting','deep throat','irrumatio','anal missionary','anal doggy','reverse cowgirl anal','anal prone bone','double penetration','double vaginal','double anal','spitroast','daisy chain','Eiffel tower','gangbang','bukkake','thrusting','grinding','bouncing','arching back','spreading','gaping','creampie','cumshot','facial','cumswap','snowballing','ejaculation','squirting','orgasm','trembling','moaning','eye contact','hair pulling','spanking','choking','biting','scratching','kissing','making out','nipple play','fingering','handjob','footjob','titfuck','body worship','oil massage','dry humping','lap dance','striptease','foreplay','buildup','penetration','thrusting rhythm','climax','aftermath','aftercare']
  },
  anatomy: {
    label: 'Body & Anatomy',
    tags: ['breasts','buttocks','thighs','abs','arms','feet','hands','back','neck','shoulders','hips','waist','pussy','labia','clit','vaginal opening','wetness','gaping pussy','pussy juices','cock','balls','shaft','head','foreskin','precum','erect cock','veiny cock','futanari','cock with pussy','both holes','close-up penetration','insertion','cream pie','cum dripping','erect nipples','areola','pierced nipples','nipple clamps','pubic hair','shaved','landing strip','asshole','rimjob','anal gaping','ass spread','dildo insertion','butt plug','pawg','huge ass','thick thighs','big tits','small tits','flat chest','muscular abs','innie pussy','outie pussy','lips','tongue','mouth open','drool','facial expressions']
  },
  attire: {
    label: 'Attire & Props',
    tags: ['lingerie','corset','stockings','garter belt','thigh highs','bodysuit','babydoll','leather','latex','PVC','lace','silk','mesh','see-through','crotchless','open cup','slutty','school uniform','maid outfit','nurse uniform','police uniform','cosplay','naked apron','trench coat','boots','heels','thigh boots','gloves','choker','collar','cuffs','ropes','shibari','handcuffs','shackles','spreader bar','ball gag','blindfold','paddle','whip','flogger','leash','chain','ankle cuffs','nipple clamps','butt plug','dildo','strap-on','vibrator','hitachi wand','spreader bench','cross','cage','ring gag','bit gag','penis gag','bondage tape','suspension','full body harness']
  },
  setting: {
    label: 'Setting',
    tags: ['bedroom','bed','floor','couch','chair','table','bathroom','shower','bathtub','mirror','staircase','kitchen counter','balcony','car','elevator','locker room','dungeon','BDSM dungeon','changing room','office','club','strip club','bar','hotel room','penthouse','beach','forest','park','public restroom','alley','rooftop','pool','hot tub','lake','waterfall','garden','parking lot','car backseat','void','neon','dark room','spotlight','colored backdrop','moody','red room','mirrored ceiling']
  },
  lighting: {
    label: 'Lighting',
    tags: ['golden hour','window light','moonlight','candlelight','sunset','sunrise','ring light','softbox','side lighting','backlighting','dramatic lighting','cinematic lighting','neon lighting','uv light','blacklight','rim lighting','god rays','volumetric','colored gels','moody','silhouette','underlighting','top lighting','practical lights','christmas lights']
  },
  camera: {
    label: 'Camera & Perspective',
    tags: ['close-up','mid-shot','full-body','wide-angle','extreme close-up','POV','cowboy shot','over-the-shoulder','eye-level','low angle','high angle','dutch angle','top-down','from below','from behind','side view','portrait lens','wide lens','macro','bokeh','shallow depth of field','fisheye','tilt-shift','sharp focus','soft focus','motion blur']
  },
  qualifiers: {
    label: 'Quality & Style',
    tags: ['masterpiece','best quality','high resolution','8k','detailed','highly detailed','sharp focus','ultra detailed','max detail','photorealistic','raw photo','DSLR','film grain','35mm','shot on Portra','HDR','unretouched','hyperrealistic','ultra detailed','hyperdetailed','fine texture','skin pores','macro detail','anime style','semi-realistic','digital art','cel shade','illustration','concept art','character design','sharp lines','vibrant colors','sensual','erotic','passionate','rough','intimate','moody','cinematic','dreamy','intense','raw']
  }
};
const CONFLICT_PAIRS = [
  ['close-up','wide-angle'],['close-up','full-body'],['close-up','cowboy shot'],['close-up','mid-shot'],['mid-shot','wide-angle'],['mid-shot','extreme close-up'],['mid-shot','full-body'],['full-body','extreme close-up'],['cowboy shot','extreme close-up'],['cowboy shot','wide-angle'],['cowboy shot','full-body'],['wide-angle','extreme close-up'],['POV','over-the-shoulder'],
  ['eye-level','low angle'],['eye-level','high angle'],['eye-level','dutch angle'],['eye-level','top-down'],['eye-level','from below'],['low angle','high angle'],['low angle','top-down'],['low angle','from below'],['high angle','top-down'],['high angle','from below'],['top-down','from below'],['from behind','from below'],
  ['sharp focus','soft focus'],['sharp focus','motion blur'],['soft focus','motion blur'],['wide lens','macro'],['wide lens','fisheye'],['portrait lens','macro'],['portrait lens','fisheye'],
  ['golden hour','moonlight'],['golden hour','candlelight'],['moonlight','sunlight'],['sunlight','candlelight'],['sunset','moonlight'],['sunset','sunlight'],['dramatic lighting','softbox'],['backlighting','ring light'],['silhouette','underlighting'],
  ['photorealistic','anime style'],['photorealistic','cel shade'],['photorealistic','digital art'],['photorealistic','illustration'],['photorealistic','concept art'],['anime style','raw photo'],['anime style','film grain'],['anime style','HDR'],['cel shade','raw photo'],['cel shade','film grain'],['raw photo','digital art'],['raw photo','illustration'],['raw photo','concept art'],['film grain','smooth'],['digital art','film grain'],['sensual','rough'],['intimate','rough'],['dreamy','raw'],
  ['nude','fully clothed'],['nude','lingerie'],['nude','corset'],['nude','bikini'],['nude','swimwear'],['nude','school uniform'],['nude','maid outfit'],['nude','nurse uniform'],['nude','cosplay'],['nude','bodysuit'],['shaved','hairy'],
  ['void','bedroom'],['void','beach'],['void','forest'],['void','dungeon'],['void','club'],['male/female','male/male'],['male/female','female/female'],['male/male','female/female']
];
const TAG_DESCRIPTIONS = {
  'reverse cowgirl':'Woman on top facing away from partner, riding motion. Rear-entry view.','doggy style':'Rear-entry position. Receiving partner on hands and knees, giving partner enters from behind.','prone bone':'Receiving partner lies flat on stomach. Giving partner lies on top and enters from behind.','lotus':'Face-to-face seated position. Receiving partner wraps legs around giving partner\'s waist.','piledriver':'Receiving partner on back with legs up and back over shoulders. Deep penetration.','frogtie':'Legs bent and pressed toward shoulders, exposing fully. Deep access.','pretzel dip':'Side-lying position with legs interlocked. Partners face same direction.','amazon':'Woman on top, partner sitting. Woman supports her weight on her feet, bouncing motion.','butterfly':'Woman on back with legs pulled back toward her head. Partner enters from front.','mating press':'Like missionary but receiving partner\'s legs pressed up to their chest. Very deep.','G-whiz':'Modified missionary with legs on partner\'s shoulders. Angled for G-spot stimulation.','wheelbarrow':'Giving partner holds receiving partner\'s legs while standing. Requires strength.','suspended congress':'Carrying position intercourse. Giving partner supports receiving partner\'s weight.','tribadism':'Scissoring ��� vulva-to-vulva stimulation. Grinding motion.','hotdogging':'Penis between thighs/thigh folds without penetration. External stimulation.','intercrural':'Penis between partner\'s thighs, thrusting without penetration.','docking':'Inserting penis into partner\'s foreskin. Between uncircumcised individuals.','spitroast':'One person penetrated vaginally/anally while performing oral on another.','Eiffel tower':'Two people high-five over a person performing oral sex below.','daisy chain':'Chain of oral sex in a group. Each person gives and receives simultaneously.','irrumatio':'Thrusting into partner\'s mouth while they remain passive.','deep throat':'Penetration deep enough into the mouth/throat.','face sitting':'Sitting on partner\'s face.','fellatio':'Oral stimulation of penis.','cunnilingus':'Oral stimulation of vulva/vagina.','anal missionary':'Missionary position with anal penetration.','anal doggy':'Doggy style with anal penetration.','reverse cowgirl anal':'Woman on top facing away, anal penetration.','anal prone bone':'Prone bone position with anal penetration.','double penetration':'Two penetrations simultaneously in two different orifices (e.g., vaginal + anal).','double vaginal':'Two penises/objects in vagina at the same time.','double anal':'Two penises/objects in anus at the same time.','gangbang':'Multiple people sequentially or simultaneously engaging with one receiving partner.','bukkake':'Multiple people ejaculating on one person\'s body or face.','snowballing':'Passing ejaculate mouth-to-mouth between partners.','creampie':'Internal ejaculation visible leaking out of the orifice afterward.','gaping':'Orifice remaining visibly open after penetration.','cumswap':'Passing ejaculate from one person to another, often mouth-to-mouth.','ahegao':'Exaggerated orgasm face ��� eyes rolled back, tongue out, flushed.','rimjob':'Oral stimulation of the anus.','cowboy shot':'Camera framing from mid-thigh to top of head. Not a sexual position ��� a film term.','dutch angle':'Tilted camera angle creating a sense of unease, drama, or disorientation.','POV':'Point of view. First-person camera perspective showing what a participant sees.','over-the-shoulder':'Camera shot framed from behind one person\'s shoulder, looking at the other.','rim lighting':'Light hitting the edges of a subject, creating an outline or halo effect.','god rays':'Visible beams of light streaming through the scene (crepuscular rays).','volumetric':'Lighting that appears as visible volumes, like light through fog or dust.','cel shade':'Flat coloring style without gradient transitions. Mimics traditional animation cel art.','bokeh':'Aesthetic blurred background effect from out-of-focus areas of the lens.','aftercare':'Tender moments after sexual activity ��� cuddling, kissing, gentle touching.'
};
const NEG_TAGS = {
  general: ['worst quality','low quality','blurry','deformed','bad anatomy','ugly','extra limbs','poorly drawn','disfigured','bad proportions','duplicate','morbid','mutated','stiff','lifeless','awkward pose','plastic'],
  photorealistic: ['cartoon','anime','illustration','painting','CGI','render','3D','smooth','waxy','uncanny valley','fake','over-processed'],
  hyperrealistic: ['cartoon','anime','illustration','painting','CGI','render','3D','soft','waxy','over-sharpened','artificial'],
  realisticAnime: ['photorealistic','realistic','photograph','live action','3D render','CGI','poorly drawn hands','stiff pose','wrong proportions']
};
const SHARED_KEYS = ['participants','attire','setting','lighting','qualifiers'];
const PER_PANEL_KEYS = ['positions','camera','anatomy'];
const {createApp}=Vue;
createApp({
  data(){
    return{
      activeTab:'builder',mode:'simple',engineMode:'auto',manualEngine:'flux',activeStyle:'photorealistic',panelMode:'single',panelCount:2,
      showDisclaimer:true,
      openSections:{participants:true,positions:true,anatomy:true,attire:true,setting:true,lighting:true,camera:true,qualifiers:true},
      selections:{participants:{chips:[],custom:''},positions:{chips:[],custom:''},anatomy:{chips:[],custom:''},attire:{chips:[],custom:''},setting:{chips:[],custom:''},lighting:{chips:[],custom:''},camera:{chips:[],custom:''},qualifiers:{chips:[],custom:''}},
      negChips:[],negCustom:'',savedPrompts:[],copied:false,toast:'',tagSearch:'',pointerTimer:null,longPressed:false,
      tooltip:{visible:false,tag:'',desc:'',x:0,y:0},
      styles:[{key:'photorealistic',label:'Photorealistic'},{key:'hyperrealistic',label:'Hyperrealistic'},{key:'realisticAnime',label:'Realistic Anime'}],
      tabs:[{key:'builder',label:'Builder'},{key:'tags',label:'Tags'},{key:'generate',label:'Generate'},{key:'gallery',label:'Gallery'},{key:'saved',label:'Saved'},{key:'random',label:'Random'}],
      // generation
      genPrompt:'',genProvider:'replicate',genModel:'flux',genSize:'1024x1024',genOutputs:1,genSteps:4,genGuidance:3.5,genSeed:'',apiKey:'',apiKeySaved:false,
      genBusy:false,genStatus:'',genResults:[],genError:'',genParamsLabel:'',
      // gallery
      gallery:[],gallerySearch:'',viewerImg:null
    }
  },
  computed:{
    categoryMap(){return TAGS},categoryKeys(){return Object.keys(TAGS)},sharedKeys(){return SHARED_KEYS},
    panels:{
      get(){
        if(!this._panels||this._panels.length!==this.panelCount){const arr=[];for(let i=0;i<this.panelCount;i++)arr.push(this._panels&&this._panels[i]?this._panels[i]:{positions:[],camera:[],anatomy:[],custom:''});return arr}
        return this._panels
      },set(v){this._panels=v}
    },
    negTags(){const b=NEG_TAGS.general,s=NEG_TAGS[this.activeStyle]||[];return[...new Set([...b,...s])]},
    resolvedEngine(){if(this.engineMode==='manual')return this.manualEngine;return this.activeStyle==='realisticAnime'?'sdxl':'flux'},
    activeConflicts(){
      const found=[],all=[];
      if(this.panelMode==='single'){for(const k of this.categoryKeys)for(const c of this.selections[k].chips)all.push(c)}
      else{for(const k of SHARED_KEYS)for(const c of this.selections[k].chips)all.push(c)}
      for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){const a=all[i],b=all[j];if(CONFLICT_PAIRS.some(p=>(p[0]===a&&p[1]===b)||(p[0]===b&&p[1]===a))&&!found.some(f=>(f[0]===a&&f[1]===b)||(f[0]===b&&f[1]===a)))found.push([a,b])}
      return found
    },
    promptText(){return this.panelMode==='single'?this.buildSinglePrompt():this.buildMultiPrompt()},
    negPromptText(){let p=[...this.negChips];if(this.negCustom)p.push(this.negCustom);return p.join(', ')},
    engineHint(){return this.resolvedEngine==='flux'?'Flux Schnell: Keep prompts concise. Place key descriptors at the beginning.':'SDXL: Detailed natural language descriptions work best.'},
    filteredGallery(){
      if(!this.gallerySearch)return this.gallery;const q=this.gallerySearch.toLowerCase();return this.gallery.filter(i=>(i.prompt||'').toLowerCase().includes(q)||(i.params||'').toLowerCase().includes(q))
    }
  },
  watch:{
    panelCount(n){const o=this._panels||[],arr=[];for(let i=0;i<n;i++)arr.push(o[i]?{positions:[...(o[i].positions||[])],camera:[...(o[i].camera||[])],anatomy:[...(o[i].anatomy||[])],custom:o[i].custom||''}:{positions:[],camera:[],anatomy:[],custom:''});this._panels=arr}
  },
  methods:{
    toggleChip(cat,chip){if(this.longPressed){this.longPressed=false;return}const a=this.selections[cat].chips,i=a.indexOf(chip);i>-1?a.splice(i,1):a.push(chip)},
    toggleNegChip(chip){if(this.longPressed){this.longPressed=false;return}const i=this.negChips.indexOf(chip);i>-1?this.negChips.splice(i,1):this.negChips.push(chip)},
    togglePanelChip(pi,cat,chip){if(this.longPressed){this.longPressed=false;return}const p=this._panels[pi];if(!p)return;const a=p[cat],i=a.indexOf(chip);i>-1?a.splice(i,1):a.push(chip)},
    toggleSection(k){this.openSections[k]=!this.openSections[k]},
    chipDesc(c){return TAG_DESCRIPTIONS[c]||''},
    hasConflict(t){return CONFLICT_PAIRS.some(([a,b])=>{if(a===t||b===t){const o=a===t?b:a;for(const k of this.categoryKeys)if(this.selections[k].chips.includes(o))return true}return false})},
    getConflictsFor(t){return CONFLICT_PAIRS.filter(([a,b])=>a===t||b===t).map(([a,b])=>a===t?b:a)},
    startLongPress(e,tag,desc){if(!desc)return;this.longPressed=false;const t=e.currentTarget;this.pointerTimer=setTimeout(()=>{this.longPressed=true;const r=t.getBoundingClientRect();this.tooltip={visible:true,tag,desc,x:r.left+r.width/2,y:r.top}},500)},
    cancelLongPress(){if(this.pointerTimer){clearTimeout(this.pointerTimer);this.pointerTimer=null}},
    closeTooltip(){this.tooltip.visible=false},
    clearAll(){for(const k of this.categoryKeys){this.selections[k].chips=[];this.selections[k].custom=''}if(this._panels)for(const p of this._panels){p.positions=[];p.camera=[];p.anatomy=[];p.custom=''}this.negChips=[];this.negCustom=''},
    buildSinglePrompt(){
      const s=this.selections,p={};for(const k of this.categoryKeys){const c=s[k].chips,u=s[k].custom;p[k]=u?u:c.join(', ')}
      if(this.resolvedEngine==='flux'){let o=[];for(const k of this.categoryKeys)if(p[k])o.push(p[k]);return o.join(', ')}
      let o='';if(p.participants)o+=p.participants;if(p.positions)o+=', '+p.positions;if(p.anatomy)o+=', '+p.anatomy;if(p.attire)o+=', wearing '+p.attire;if(p.setting)o+=', in '+p.setting;if(p.lighting)o+=', '+p.lighting;if(p.camera)o+=', '+p.camera;if(p.qualifiers)o+=', '+p.qualifiers;return o.replace(/^,\s*/,'')
    },
    buildMultiPrompt(){
      const s=this.selections,sh={};for(const k of SHARED_KEYS){const c=s[k].chips,u=s[k].custom;sh[k]=u?u:c.join(', ')}
      const pt=(this._panels||[]).map((p,i)=>{const pos=p.custom?p.custom:[p.positions.join(', '),p.camera.join(', '),p.anatomy.join(', ')].filter(Boolean).join(', ');return'panel '+(i+1)+': '+(pos||'...')});
      const sp=[];for(const k of this.categoryKeys)if(sh[k])sp.push(sh[k]);const ss=sp.filter(Boolean).join(', ');
      if(this.resolvedEngine==='flux')return[ss,'comic book style comic strip split into '+this.panelCount+' panels',...pt].filter(Boolean).join(', ')
      return[ss,'comic book style strip split into '+this.panelCount+' panels showing different moments',...pt].filter(Boolean).join(', ')
    },
    copyPrompt(){if(!this.promptText)return;this.copyText(this.promptText)},
    copyText(t){navigator.clipboard.writeText(t).then(()=>{this.copied=true;this.showToast('Copied!');setTimeout(()=>{this.copied=false},2000)}).catch(()=>this.showToast('Failed to copy'))},
    showToast(m){this.toast=m;setTimeout(()=>{this.toast=''},2500)},
    savePrompt(){
      if(!this.promptText){this.showToast('Build a prompt first');return}
      const c=JSON.parse(JSON.stringify({selections:this.selections,negChips:this.negChips,negCustom:this.negCustom,panels:this._panels||[],panelMode:this.panelMode,panelCount:this.panelCount,style:this.activeStyle,engine:this.resolvedEngine,promptText:this.promptText,timestamp:Date.now()}))
      this.savedPrompts.unshift(c);localStorage.setItem('promptcraft_saved',JSON.stringify(this.savedPrompts));this.showToast('Prompt saved!')
    },
    deletePrompt(i){this.savedPrompts.splice(i,1);localStorage.setItem('promptcraft_saved',JSON.stringify(this.savedPrompts))},
    loadPrompt(i){const sp=this.savedPrompts[i];this.selections=JSON.parse(JSON.stringify(sp.selections));this.negChips=[...(sp.negChips||[])];this.negCustom=sp.negCustom||'';this.panelMode=sp.panelMode||'single';this.panelCount=sp.panelCount||2;if(sp.panels)this._panels=JSON.parse(JSON.stringify(sp.panels));this.activeStyle=sp.style;this.activeTab='builder';this.showToast('Prompt loaded!')},
    generateRandom(){
      if(this.panelMode==='multi'){this.generateRandomMulti();return}
      const all=[];
      for(const k of this.categoryKeys){
        const tags=TAGS[k].tags,shuf=[...tags].sort(()=>Math.random()-0.5),sel=[];
        for(const t of shuf){if(sel.length>=2)break;const c=this.getConflictsFor(t);if(!all.some(s=>c.includes(s))&&!sel.some(s=>c.includes(s))){sel.push(t);all.push(t)}}
        if(sel.length===0&&shuf.length>0){sel.push(shuf[0]);all.push(shuf[0])}
        this.selections[k].chips=sel;this.selections[k].custom=''
      }
      const nc=Math.min(2,this.negTags.length),ns=[...this.negTags].sort(()=>Math.random()-0.5);this.negChips=ns.slice(0,nc);this.negCustom=''
      if(this.activeTab==='random')this.showToast('Random prompt generated!')
    },
    generateRandomMulti(){
      this._panels=[];const all=[];
      for(const k of SHARED_KEYS){
        const tags=TAGS[k].tags,shuf=[...tags].sort(()=>Math.random()-0.5),sel=[];
        for(const t of shuf){if(sel.length>=2)break;const c=this.getConflictsFor(t);if(!all.some(s=>c.includes(s))&&!sel.some(s=>c.includes(s))){sel.push(t);all.push(t)}}
        if(sel.length===0&&shuf.length>0){sel.push(shuf[0]);all.push(shuf[0])}
        this.selections[k].chips=sel;this.selections[k].custom=''
      }
      for(let pi=0;pi<this.panelCount;pi++){const p={positions:[],camera:[],anatomy:[],custom:''};for(const k of PER_PANEL_KEYS){const tags=TAGS[k].tags,shuf=[...tags].sort(()=>Math.random()-0.5);p[k]=shuf.slice(0,2)}this._panels.push(p)}
      if(this.activeTab==='random')this.showToast('Random prompt generated!')
    },
    addFromTags(k,c){this.toggleChip(k,c);this.activeTab='builder'},
    filteredTags(t,s){if(!s)return t;const q=s.toLowerCase();return t.filter(x=>x.toLowerCase().includes(q))},
    formatDate(t){return new Date(t).toLocaleDateString()},
    sendToGenerate(){this.genPrompt=this.promptText;this.genModel=this.resolvedEngine;this.activeTab='generate'},

    // Generation methods
    saveApiKey(){localStorage.setItem('promptcraft_apikey',this.apiKey);this.apiKeySaved=true;this.showToast('API key saved');setTimeout(()=>{this.apiKeySaved=false},2000)},
    formatParams(p){return p},
    downloadImage(url,name){
      const a=document.createElement('a');a.href=url;a.download=name+'.png';document.body.appendChild(a);a.click();a.remove()
    },
    openViewer(item){this.viewerImg=item},
    galleryAdd(url,prompt,params){
      const item={id:Date.now(),url,prompt:prompt||'',params:params||'',timestamp:Date.now()};
      this.gallery.unshift(item);localStorage.setItem('promptcraft_gallery',JSON.stringify(this.gallery));this.showToast('Saved to gallery!')
    },
    galleryDelete(id){this.gallery=this.gallery.filter(i=>i.id!==id);localStorage.setItem('promptcraft_gallery',JSON.stringify(this.gallery))},
    galleryClear(){this.gallery=[];localStorage.removeItem('promptcraft_gallery');this.showToast('Gallery cleared')},

    async startGeneration(){
      if(!this.apiKey){this.showToast('Enter your API key first');return}
      this.genBusy=true;this.genResults=[];this.genError='';this.genStatus='starting...';
      const [w,h]=this.genSize.split('x').map(Number);
      const prompt=this.genPrompt||this.promptText;
      if(!prompt){this.genError='No prompt to generate from';this.genBusy=false;return}

      try{
        this.genStatus='sending...';
        if(this.genModel==='flux'){
          const body={input:{prompt,num_outputs:this.genOutputs,num_inference_steps:this.genSteps,width:w,height:h,go_fast:true,output_format:'png'}};
          if(this.genSeed)body.input.seed=parseInt(this.genSeed);
          const res=await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',{method:'POST',headers:{'Authorization':'Token '+this.apiKey,'Content-Type':'application/json'},body:JSON.stringify(body)});
          const data=await res.json();
          if(!res.ok||data.detail){this.genError=data.detail||'API error';this.genBusy=false;return}
          this.genStatus='processing...';this.genParamsLabel=this.genSize+' | '+this.genSteps+' steps';
          await this.pollPrediction(data.id)
        } else {
          const body={input:{prompt,negative_prompt:this.negPromptText||'',num_outputs:this.genOutputs,num_inference_steps:this.genSteps,guidance_scale:this.genGuidance,width:w,height:h,scheduler:'DPMSolverMultistep',apply_watermark:false}};
          if(this.genSeed)body.input.seed=parseInt(this.genSeed);
          const res=await fetch('https://api.replicate.com/v1/models/stability-ai/sdxl/predictions',{method:'POST',headers:{'Authorization':'Token '+this.apiKey,'Content-Type':'application/json'},body:JSON.stringify(body)});
          const data=await res.json();
          if(!res.ok||data.detail){this.genError=data.detail||'API error';this.genBusy=false;return}
          this.genStatus='processing...';this.genParamsLabel=this.genSize+' | '+this.genSteps+' steps | cfg:'+this.genGuidance;
          await this.pollPrediction(data.id)
        }
      }catch(e){this.genError=e.message||'Network error';this.genBusy=false}
    },
    async pollPrediction(id){
      let attempts=0;
      while(attempts<120){
        await new Promise(r=>setTimeout(r,1500));attempts++;
        const res=await fetch('https://api.replicate.com/v1/predictions/'+id,{headers:{'Authorization':'Token '+this.apiKey}});
        const data=await res.json();
        if(data.status==='succeeded'){
          const urls=Array.isArray(data.output)?data.output:[data.output];
          this.genResults=urls;this.genBusy=false;this.genStatus='done!';this.showToast('Generation complete!');
          return
        }
        if(data.status==='failed'){this.genError=data.error||'Generation failed';this.genBusy=false;return}
        this.genStatus='processing ('+Math.round(attempts*1.5)+'s)...'
      }
      this.genError='Timed out';this.genBusy=false
    }
  },
  mounted(){
    this._panels=[{positions:[],camera:[],anatomy:[],custom:''},{positions:[],camera:[],anatomy:[],custom:''}];
    const s=localStorage.getItem('promptcraft_saved');if(s)try{this.savedPrompts=JSON.parse(s)}catch(e){}
    const k=localStorage.getItem('promptcraft_apikey');if(k)this.apiKey=k;
    const g=localStorage.getItem('promptcraft_gallery');if(g)try{this.gallery=JSON.parse(g)}catch(e){}
    document.addEventListener('click',()=>{if(this.tooltip.visible)this.closeTooltip()})
  }
}).mount('#app');

  // --- END ORIGINAL SCRIPT ---
}
