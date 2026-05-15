<template>
  <div>
<div v-if="tooltip.visible" class="tooltip-pop" :style="{left:tooltip.x+'px',top:tooltip.y+'px',transform:'translateX(-50%) translateY(-100%)'}"></div>
 npm install   <div class="tooltip-tag">{{ tooltip.tag }}</div>
    <div class="tooltip-desc">{{ tooltip.desc }}</div>
  </div>

  <!-- IMAGE VIEWER OVERLAY -->
  <div v-if="viewerImg" class="overlay" @click.self="viewerImg=null">
    <div class="glass" style="max-width:90vw;max-height:90vh;border-radius:12px;padding:16px;overflow:auto">
      <img :src="viewerImg.url" style="max-width:100%;max-height:70vh;border-radius:8px;display:block;margin:0 auto">
      <div style="margin-top:12px;font-size:.82rem;color:#a3a3a3;word-break:break-word">{{ viewerImg.prompt }}</div>
      <div v-if="viewerImg.params" style="margin-top:6px;font-size:.75rem;color:#52525b">{{ formatParams(viewerImg.params) }}</div>
      <div style="margin-top:12px;display:flex;gap:8px">
        <button @click="downloadImage(viewerImg.url, viewerImg.id)" class="btn btn-primary" style="padding:6px 16px;font-size:.8rem">Download</button>
        <button @click="galleryDelete(viewerImg.id); viewerImg=null" class="btn btn-secondary" style="padding:6px 16px;font-size:.8rem;color:#ef4444">Delete</button>
        <button @click="viewerImg=null" class="btn btn-secondary" style="padding:6px 16px;font-size:.8rem">Close</button>
      </div>
    </div>
  </div>

  <!-- HEADER -->
  <header class="glass" style="position:sticky;top:0;z-index:50;border-bottom:1px solid rgba(255,255,255,0.06)">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <span style="font-size:1.4rem;font-weight:700;background:linear-gradient(135deg,#fca5a5,#dc2626);-webkit-background-clip:text;-webkit-text-fill-color:transparent">PromptCraft</span>
        <span style="font-size:0.7rem;padding:2px 8px;border-radius:999px;background:rgba(220,38,38,0.15);color:#fca5a5;border:1px solid rgba(220,38,38,0.3);-webkit-text-fill-color:#fca5a5">18+</span>
      </div>
      <div class="flex items-center gap-2 flex-wrap" style="font-size:0.8rem">
        <span style="color:#71717a">Engine:</span>
        <select v-model="engineMode" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:4px 8px;color:#d4d4d4;font-size:0.8rem;outline:none">
          <option value="auto">Auto</option>
          <option value="manual">Manual</option>
        </select>
        <span v-if="engineMode==='manual'" style="display:flex;gap:4px">
          <button @click="manualEngine='flux'" :style="manualEngine==='flux'?'background:rgba(220,38,38,0.2);border-color:rgba(220,38,38,0.5);color:#fca5a5':''" style="padding:4px 10px;border-radius:6px;font-size:0.75rem;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#a1a1aa;cursor:pointer">Flux</button>
          <button @click="manualEngine='sdxl'" :style="manualEngine==='sdxl'?'background:rgba(220,38,38,0.2);border-color:rgba(220,38,38,0.5);color:#fca5a5':''" style="padding:4px 10px;border-radius:6px;font-size:0.75rem;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#a1a1aa;cursor:pointer">SDXL</button>
        </span>
        <span v-else :title="engineHint" style="display:flex;align-items:center;gap:4px;padding:4px 8px;border-radius:6px;background:rgba(220,38,38,0.08);color:#fca5a5;font-size:0.75rem;cursor:help">
          <span class="engine-dot" :style="{background:resolvedEngine==='flux'?'#f59e0b':'#7c3aed'}"></span>
          {{ resolvedEngine === 'flux' ? 'Flux Schnell' : 'SDXL' }}
        </span>
      </div>
    </div>
  </header>

  <div v-if="showDisclaimer" style="background:rgba(220,38,38,0.08);border-bottom:1px solid rgba(220,38,38,0.2);padding:10px 16px;font-size:0.8rem;color:#fca5a5;text-align:center;position:relative">
    <span>������ This tool is for <strong>adults 18+</strong> for research, artistic, and creative purposes only. Not for generating illegal content. Use responsibly.</span>
    <button @click="showDisclaimer=false" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#fca5a5;cursor:pointer;font-size:1.1rem">&times;</button>
  </div>

  <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
    <div class="flex items-center gap-2">
      <span style="font-size:0.8rem;color:#71717a;margin-right:4px">Style:</span>
      <button v-for="s in styles" :key="s.key" @click="activeStyle=s.key" class="style-btn" :class="{active:activeStyle===s.key}">{{ s.label }}</button>
    </div>
    <div class="flex items-center gap-2" style="font-size:0.8rem">
      <span style="color:#71717a">Mode:</span>
      <button @click="mode='simple'" :style="mode==='simple'?'background:rgba(220,38,38,0.2);border-color:rgba(220,38,38,0.5);color:#fca5a5':''" style="padding:4px 14px;border-radius:6px;font-size:0.75rem;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#a1a1aa;cursor:pointer">Simple</button>
      <button @click="mode='complex'" :style="mode==='complex'?'background:rgba(220,38,38,0.2);border-color:rgba(220,38,38,0.5);color:#fca5a5':''" style="padding:4px 14px;border-radius:6px;font-size:0.75rem;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#a1a1aa;cursor:pointer">Complex</button>
      <span style="color:#52525b;margin:0 4px">|</span>
      <span style="color:#71717a">Panels:</span>
      <button @click="panelMode='single'" :style="panelMode==='single'?'background:rgba(220,38,38,0.2);border-color:rgba(220,38,38,0.5);color:#fca5a5':''" style="padding:4px 14px;border-radius:6px;font-size:0.75rem;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#a1a1aa;cursor:pointer">Single</button>
      <button @click="panelMode='multi'" :style="panelMode==='multi'?'background:rgba(220,38,38,0.2);border-color:rgba(220,38,38,0.5);color:#fca5a5':''" style="padding:4px 14px;border-radius:6px;font-size:0.75rem;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#a1a1aa;cursor:pointer">Multi</button>
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-4" style="border-bottom:1px solid rgba(255,255,255,0.06)">
    <div class="flex">
      <button v-for="t in tabs" :key="t.key" class="tab-btn" :class="{active:activeTab===t.key}" @click="activeTab=t.key">{{ t.label }}</button>
    </div>
  </div>

  <main class="max-w-6xl mx-auto px-4 py-6" style="padding-bottom:200px">

    <!-- ===== BUILDER TAB ===== -->
    <div v-show="activeTab==='builder'" class="fade">
      <div v-if="activeConflicts.length > 0" class="glass" style="border:1px solid rgba(234,179,8,0.3);border-radius:12px;padding:12px 16px;margin-bottom:16px;background:rgba(234,179,8,0.05)">
        <span style="color:#fde047;font-size:0.82rem">������ <strong>{{ activeConflicts.length }}</strong> potential conflict{{ activeConflicts.length > 1 ? 's' : '' }}:
          <span v-for="(c,ci) in activeConflicts" :key="ci"><span style="color:#fca5a5">{{ c[0] }}</span> ��� <span style="color:#fca5a5">{{ c[1] }}</span><span v-if="ci < activeConflicts.length - 1">, </span></span>
        </span>
      </div>
      <div class="glass" style="border-radius:12px;padding:16px;margin-bottom:20px">
        <div class="flex items-center justify-between mb-2">
          <span style="font-size:0.85rem;font-weight:600;color:#c4a5fc">Negative Prompt</span>
          <span style="font-size:0.72rem;color:#71717a">{{ negPromptText.length }} chars</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">
          <span v-for="chip in negTags" :key="chip" class="chip chip-neg" :class="{active:negChips.includes(chip)}"
            @click="toggleNegChip(chip)"
            @pointerdown.prevent="startLongPress($event, chip, chipDesc(chip))"
            @pointerup="cancelLongPress" @pointerleave="cancelLongPress">{{ chip }}</span>
        </div>
        <textarea v-if="mode==='complex'" v-model="negCustom" placeholder="Custom negative terms..." style="margin-top:4px"></textarea>
        <div v-if="negChips.length||negCustom" style="margin-top:8px;padding:8px 12px;background:rgba(147,51,234,0.06);border-radius:8px;font-size:0.82rem;color:#a3a3a3;word-break:break-word">{{ negPromptText || '���' }}</div>
      </div>
      <template v-if="panelMode === 'single'">
        <div v-for="(cat,key) in categoryMap" :key="key" class="glass" style="border-radius:12px;padding:16px;margin-bottom:12px">
          <div class="section-toggle flex items-center justify-between" @click="toggleSection(key)">
            <span style="font-size:0.85rem;font-weight:600;color:#d4d4d4">{{ cat.label }}</span>
            <span style="font-size:0.75rem;color:#71717a;transition:transform 0.2s" :style="{transform:openSections[key]?'rotate(180deg)':'rotate(0)'}">���</span>
          </div>
          <div v-show="openSections[key]" style="margin-top:12px">
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              <span v-for="chip in cat.tags" :key="chip" class="chip" :class="{active:selections[key].chips.includes(chip),conflict:hasConflict(chip)&&selections[key].chips.includes(chip)}"
                @click="toggleChip(key,chip)"
                @pointerdown.prevent="startLongPress($event, chip, chipDesc(chip))"
                @pointerup="cancelLongPress" @pointerleave="cancelLongPress">{{ chip }}</span>
            </div>
            <textarea v-if="mode==='complex'" v-model="selections[key].custom" :placeholder="'Custom '+cat.label.toLowerCase()+'...'" style="margin-top:8px"></textarea>
          </div>
        </div>
      </template>
      <template v-if="panelMode === 'multi'">
        <div v-for="key in sharedKeys" :key="key" class="glass" style="border-radius:12px;padding:16px;margin-bottom:12px">
          <div class="section-toggle flex items-center justify-between" @click="toggleSection(key)">
            <span style="font-size:0.85rem;font-weight:600;color:#d4d4d4">{{ categoryMap[key].label }}</span>
            <span style="font-size:0.72rem;color:#52525b">shared</span>
            <span style="font-size:0.75rem;color:#71717a;transition:transform 0.2s" :style="{transform:openSections[key]?'rotate(180deg)':'rotate(0)'}">���</span>
          </div>
          <div v-show="openSections[key]" style="margin-top:12px">
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              <span v-for="chip in categoryMap[key].tags" :key="chip" class="chip" :class="{active:selections[key].chips.includes(chip),conflict:hasConflict(chip)&&selections[key].chips.includes(chip)}"
                @click="toggleChip(key,chip)"
                @pointerdown.prevent="startLongPress($event, chip, chipDesc(chip))"
                @pointerup="cancelLongPress" @pointerleave="cancelLongPress">{{ chip }}</span>
            </div>
            <textarea v-if="mode==='complex'" v-model="selections[key].custom" :placeholder="'Custom '+categoryMap[key].label.toLowerCase()+'...'" style="margin-top:8px"></textarea>
          </div>
        </div>
        <div class="glass" style="border-radius:12px;padding:16px;margin-bottom:16px">
          <div class="flex items-center gap-3 flex-wrap">
            <span style="font-size:0.85rem;font-weight:600;color:#d4d4d4">Panel Count</span>
            <select v-model.number="panelCount" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:4px 8px;color:#d4d4d4;font-size:0.85rem;outline:none">
              <option :value="2">2 Panels</option>
              <option :value="3">3 Panels</option>
              <option :value="4">4 Panels</option>
              <option :value="6">6 Panels</option>
            </select>
          </div>
        </div>
        <div v-for="(panel, pi) in panels" :key="pi" class="glass" style="border-radius:12px;padding:16px;margin-bottom:12px;border-color:rgba(220,38,38,0.15)">
          <div style="font-size:0.85rem;font-weight:600;color:#fca5a5;margin-bottom:12px">Panel {{ pi + 1 }}</div>
          <div style="margin-bottom:10px">
            <div style="font-size:0.78rem;color:#a1a1aa;margin-bottom:6px">Positions & Actions</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              <span v-for="chip in categoryMap.positions.tags" :key="chip" class="chip" :class="{active:panel.positions.includes(chip)}"
                @click="togglePanelChip(pi,'positions',chip)"
                @pointerdown.prevent="startLongPress($event, chip, chipDesc(chip))"
                @pointerup="cancelLongPress" @pointerleave="cancelLongPress">{{ chip }}</span>
            </div>
          </div>
          <div style="margin-bottom:10px">
            <div style="font-size:0.78rem;color:#a1a1aa;margin-bottom:6px">Camera & Perspective</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              <span v-for="chip in categoryMap.camera.tags" :key="chip" class="chip" :class="{active:panel.camera.includes(chip)}"
                @click="togglePanelChip(pi,'camera',chip)"
                @pointerdown.prevent="startLongPress($event, chip, chipDesc(chip))"
                @pointerup="cancelLongPress" @pointerleave="cancelLongPress">{{ chip }}</span>
            </div>
          </div>
          <div style="margin-bottom:8px">
            <div style="font-size:0.78rem;color:#a1a1aa;margin-bottom:6px">Body & Anatomy</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              <span v-for="chip in categoryMap.anatomy.tags" :key="chip" class="chip" :class="{active:panel.anatomy.includes(chip)}"
                @click="togglePanelChip(pi,'anatomy',chip)"
                @pointerdown.prevent="startLongPress($event, chip, chipDesc(chip))"
                @pointerup="cancelLongPress" @pointerleave="cancelLongPress">{{ chip }}</span>
            </div>
          </div>
          <textarea v-if="mode==='complex'" v-model="panel.custom" :placeholder="'Custom panel '+(pi+1)+'...'" style="margin-top:4px"></textarea>
        </div>
      </template>
      <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
        <button @click="clearAll" class="btn btn-secondary">Clear All</button>
        <button @click="generateRandom" class="btn btn-secondary">Randomize</button>
        <button @click="activeTab='generate'" class="btn btn-primary">Generate Images</button>
      </div>
    </div>

    <!-- ===== TAGS TAB ===== -->
    <div v-show="activeTab==='tags'" class="fade">
      <div style="margin-bottom:16px"><input v-model="tagSearch" placeholder="Search tags..." style="max-width:400px"></div>
      <div v-for="(cat,key) in categoryMap" :key="key" style="margin-bottom:24px">
        <h3 style="font-size:0.9rem;font-weight:600;color:#d4d4d4;margin-bottom:10px">{{ cat.label }}</h3>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          <span v-for="chip in filteredTags(cat.tags,tagSearch)" :key="chip" class="chip" :class="{active:selections[key].chips.includes(chip)}"
            @click="addFromTags(key,chip)"
            @pointerdown.prevent="startLongPress($event, chip, chipDesc(chip))"
            @pointerup="cancelLongPress" @pointerleave="cancelLongPress">{{ chip }}</span>
        </div>
      </div>
    </div>

    <!-- ===== GENERATE TAB ===== -->
    <div v-show="activeTab==='generate'" class="fade">
      <div class="glass" style="border-radius:12px;padding:16px;margin-bottom:16px">
        <div style="font-size:0.85rem;font-weight:600;color:#d4d4d4;margin-bottom:8px">Prompt</div>
        <textarea v-model="genPrompt" rows="3" style="font-size:0.85rem"></textarea>
        <div v-if="negPromptText" style="margin-top:8px;padding:8px 12px;background:rgba(147,51,234,0.06);border-radius:8px;font-size:0.8rem;color:#a3a3a3"><span style="color:#a78bfa">Negative:</span> {{ negPromptText }}</div>
      </div>

      <div class="glass" style="border-radius:12px;padding:16px;margin-bottom:16px">
        <div style="font-size:0.85rem;font-weight:600;color:#d4d4d4;margin-bottom:12px">Settings</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <div style="font-size:0.75rem;color:#71717a;margin-bottom:4px">Provider</div>
            <select v-model="genProvider" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:6px 10px;color:#d4d4d4;font-size:0.8rem;outline:none;width:100%">
              <option value="replicate">Replicate</option>
            </select>
          </div>
          <div>
            <div style="font-size:0.75rem;color:#71717a;margin-bottom:4px">Model</div>
            <select v-model="genModel" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:6px 10px;color:#d4d4d4;font-size:0.8rem;outline:none;width:100%">
              <option value="flux">Flux Schnell</option>
              <option value="sdxl">SDXL</option>
            </select>
          </div>
          <div>
            <div style="font-size:0.75rem;color:#71717a;margin-bottom:4px">Size</div>
            <select v-model="genSize" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:6px 10px;color:#d4d4d4;font-size:0.8rem;outline:none;width:100%">
              <option value="1024x1024">1024��1024</option>
              <option value="1024x768">1024��768</option>
              <option value="768x1024">768��1024</option>
              <option value="1216x832">1216��832</option>
              <option value="832x1216">832��1216</option>
            </select>
          </div>
          <div>
            <div style="font-size:0.75rem;color:#71717a;margin-bottom:4px">Outputs</div>
            <select v-model="genOutputs" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:6px 10px;color:#d4d4d4;font-size:0.8rem;outline:none;width:100%">
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="3">3</option>
              <option :value="4">4</option>
            </select>
          </div>
          <div>
            <div style="font-size:0.75rem;color:#71717a;margin-bottom:4px">Steps</div>
            <input v-model.number="genSteps" type="number" min="1" max="50" style="padding:6px 10px;font-size:0.8rem">
          </div>
          <div>
            <div style="font-size:0.75rem;color:#71717a;margin-bottom:4px">Guidance</div>
            <input v-model.number="genGuidance" type="number" min="1" max="20" step="0.5" style="padding:6px 10px;font-size:0.8rem">
          </div>
          <div style="grid-column:span 2">
            <div style="font-size:0.75rem;color:#71717a;margin-bottom:4px">Seed (leave blank for random)</div>
            <input v-model="genSeed" placeholder="random" style="padding:6px 10px;font-size:0.8rem">
          </div>
        </div>
        <div style="margin-bottom:12px">
          <div style="font-size:0.75rem;color:#71717a;margin-bottom:4px">API Key <span style="color:#52525b">(stored in browser only)</span></div>
          <div style="display:flex;gap:8px">
            <input v-model="apiKey" type="password" placeholder="r8_..." style="padding:6px 10px;font-size:0.8rem;flex:1">
            <button @click="saveApiKey" class="btn btn-secondary" style="padding:6px 14px;font-size:0.75rem;white-space:nowrap">{{ apiKeySaved ? 'Saved' : 'Save Key' }}</button>
          </div>
        </div>
      </div>

      <button @click="startGeneration" :disabled="genBusy || !apiKey" class="btn btn-primary" style="padding:12px 40px;font-size:1rem;width:100%">
        <span v-if="genBusy" style="display:flex;align-items:center;justify-content:center;gap:8px"><span class="spinner"></span> Generating... {{ genStatus }}</span>
        <span v-else>���� Generate</span>
      </button>

      <div v-if="!apiKey" style="margin-top:8px;font-size:0.8rem;color:#ef4444;text-align:center">Enter your Replicate API key above to generate images. Get one free at replicate.com</div>

      <!-- RESULTS -->
      <div v-if="genResults.length > 0" style="margin-top:20px">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">
          <div v-for="(img,ii) in genResults" :key="ii" class="glass" style="border-radius:12px;padding:10px;border-color:rgba(220,38,38,0.1)">
            <img :src="img" class="gen-img" style="aspect-ratio:1/1;object-fit:cover" @click="openViewer({url:img,prompt:genPrompt,id:'gen-'+Date.now()+'-'+ii,params:genParamsLabel})">
            <div style="margin-top:8px;display:flex;gap:6px">
              <button @click="downloadImage(img, 'promptcraft-'+Date.now())" class="btn btn-secondary" style="padding:4px 10px;font-size:0.75rem;flex:1">Download</button>
              <button @click="galleryAdd(img, genPrompt, genParamsLabel)" class="btn btn-secondary" style="padding:4px 10px;font-size:0.75rem;flex:1">Save</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="genError" class="glass" style="border-radius:12px;padding:16px;margin-top:16px;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.05)">
        <span style="color:#ef4444;font-size:0.85rem">������ {{ genError }}</span>
      </div>
    </div>

    <!-- ===== GALLERY TAB ===== -->
    <div v-show="activeTab==='gallery'" class="fade">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:0.9rem;font-weight:600;color:#d4d4d4">Gallery</span>
          <span style="font-size:0.78rem;color:#52525b">{{ gallery.length }} image{{ gallery.length!==1?'s':'' }}</span>
        </div>
        <div style="display:flex;gap:8px">
          <input v-model="gallerySearch" placeholder="Filter..." style="padding:6px 10px;font-size:0.8rem;max-width:200px">
          <button v-if="gallery.length" @click="galleryClear" class="btn btn-secondary" style="padding:4px 12px;font-size:0.75rem;color:#ef4444">Clear All</button>
        </div>
      </div>
      <div v-if="gallery.length===0" style="text-align:center;padding:60px 20px;color:#52525b">
        <p style="font-size:2rem;margin-bottom:8px">����</p>
        <p style="font-size:0.9rem">No saved images yet.</p>
        <p style="font-size:0.8rem;margin-top:4px">Generate images and save them to your gallery.</p>
      </div>
      <div v-if="filteredGallery.length===0 && gallery.length>0" style="text-align:center;padding:40px;color:#52525b;font-size:0.9rem">No images match "{{ gallerySearch }}"</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px">
        <div v-for="(item,gi) in filteredGallery" :key="item.id" class="glass" style="border-radius:12px;padding:10px;border-color:rgba(220,38,38,0.1)">
          <img :src="item.url" class="gen-img" style="aspect-ratio:1/1;object-fit:cover;cursor:pointer" @click="openViewer(item)" @error="item.broken=true">
          <div v-if="item.broken" style="padding:12px;text-align:center;color:#52525b;font-size:0.75rem">Image expired</div>
          <div style="margin-top:8px">
            <div style="font-size:0.72rem;color:#71717a;word-break:break-word;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">{{ item.prompt || item.params }}</div>
            <div style="font-size:0.65rem;color:#52525b;margin-top:4px">{{ formatDate(item.timestamp) }}</div>
          </div>
          <div style="margin-top:8px;display:flex;gap:6px">
            <button @click="openViewer(item)" class="btn btn-secondary" style="padding:4px 10px;font-size:0.75rem;flex:1">View</button>
            <button @click="galleryDelete(item.id)" class="btn btn-secondary" style="padding:4px 10px;font-size:0.75rem;color:#ef4444">Del</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== SAVED TAB ===== -->
    <div v-show="activeTab==='saved'" class="fade">
      <div v-if="savedPrompts.length===0" style="text-align:center;padding:60px 20px;color:#52525b">
        <p style="font-size:2rem;margin-bottom:8px">����</p>
        <p style="font-size:0.9rem">No saved prompts yet.</p>
        <p style="font-size:0.8rem;margin-top:4px">Build a prompt and save it from the Builder.</p>
      </div>
      <div v-for="(sp,i) in savedPrompts" :key="i" class="glass" style="border-radius:12px;padding:16px;margin-bottom:12px">
        <div style="font-size:0.82rem;color:#a3a3a3;margin-bottom:6px;display:flex;justify-content:space-between">
          <span>{{ sp.style }} �� {{ sp.engine==='flux'?'Flux Schnell':'SDXL' }}<span v-if="sp.panelMode==='multi'"> �� {{ sp.panelCount }} Panels</span></span>
          <span style="font-size:0.72rem">{{ formatDate(sp.timestamp) }}</span>
        </div>
        <div style="font-size:0.85rem;color:#d4d4d4;word-break:break-word;margin-bottom:10px;max-height:80px;overflow:hidden">{{ sp.promptText }}</div>
        <div style="display:flex;gap:6px">
          <button @click="copyText(sp.promptText)" class="btn btn-secondary" style="padding:4px 12px;font-size:0.75rem">Copy</button>
          <button @click="loadPrompt(i)" class="btn btn-secondary" style="padding:4px 12px;font-size:0.75rem">Load</button>
          <button @click="deletePrompt(i)" class="btn btn-secondary" style="padding:4px 12px;font-size:0.75rem;color:#ef4444">Delete</button>
        </div>
      </div>
    </div>

    <!-- ===== RANDOM TAB ===== -->
    <div v-show="activeTab==='random'" class="fade" style="text-align:center;padding:40px 20px">
      <p style="font-size:0.9rem;color:#71717a;margin-bottom:20px">Stuck? Let the muse decide. Generates a conflict-free random prompt.</p>
      <button @click="generateRandom" class="btn btn-primary" style="padding:12px 40px;font-size:1rem">���� Generate Random</button>
      <div v-if="promptText" class="glass" style="border-radius:12px;padding:20px;margin-top:24px;text-align:left">
        <div class="prompt-text" style="white-space:pre-wrap">{{ promptText }}</div>
        <div style="margin-top:12px;display:flex;gap:8px">
          <button @click="copyPrompt" class="btn btn-primary" style="padding:6px 16px;font-size:0.8rem">{{ copied ? 'Copied!' : 'Copy Prompt' }}</button>
          <button @click="savePrompt" class="btn btn-secondary" style="padding:6px 16px;font-size:0.8rem">Save</button>
          <button @click="sendToGenerate" class="btn btn-secondary" style="padding:6px 16px;font-size:0.8rem">Generate</button>
        </div>
      </div>
    </div>

  </main>

  <!-- PREVIEW BAR -->
  <div class="glass" style="position:fixed;bottom:0;left:0;right:0;z-index:50;border-top:1px solid rgba(220,38,38,0.2);padding:10px 20px">
    <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span style="font-size:0.7rem;font-weight:600;color:#dc2626">{{ resolvedEngine==='flux'?'FLUX SCHNELL':'SDXL' }}</span>
          <span v-if="panelMode==='multi'" style="font-size:0.65rem;padding:1px 6px;border-radius:4px;background:rgba(220,38,38,0.1);color:#fca5a5;border:1px solid rgba(220,38,38,0.2)">{{ panelCount }}p</span>
          <span style="font-size:0.65rem;color:#52525b">{{ promptText.length }}c</span>
        </div>
        <div class="prompt-text" style="max-height:60px;overflow-y:auto;font-size:0.82rem;white-space:pre-wrap">{{ promptText || 'Start building...' }}</div>
        <div v-if="negChips.length||negCustom" style="margin-top:4px;font-size:0.72rem;color:#71717a">
          <span style="color:#a78bfa;font-size:0.65rem">N:</span> {{ negPromptText }}
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap">
        <button @click="copyPrompt" class="btn btn-primary" style="padding:5px 14px;font-size:0.75rem">{{ copied ? 'Copied!' : 'Copy' }}</button>
        <button @click="sendToGenerate" class="btn btn-secondary" style="padding:5px 14px;font-size:0.75rem">Generate</button>
        <button @click="savePrompt" class="btn btn-secondary" style="padding:5px 14px;font-size:0.75rem">Save</button>
      </div>
    </div>
  </div>

  <div v-if="toast" class="toast" style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1a1a2e;border:1px solid rgba(220,38,38,0.3);border-radius:10px;padding:10px 20px;font-size:0.85rem;color:#d4d4d4;z-index:100;box-shadow:0 4px 30px rgba(0,0,0,0.5)">{{ toast }}
  </div>
</template>

<script>
import { createLegacyApp } from "./legacy/legacyApp";

export default {
  name: "App",
  mounted() {
    // Boot the legacy logic against this component root.
    // This keeps your original PromptCraft app behavior intact while we modularize.
    createLegacyApp(this.$el);
  },
};
</script>
