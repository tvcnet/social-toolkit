/**
 * File: social-toolkit.js
 * Description: Main Alpine.js Controller for the TVCNet Social Toolkit.
 * Author: TVCNet
 * Version: 4.7.7
 */

document.addEventListener('alpine:init', () => {
  Alpine.data('socialToolkit', () => ({
    // UI State
    showModal: false,
    isGenerating: false,
    isEditing: false,
    isDragging: false,
    isFetchingModels: false,
    todayDate: new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
    toast: { show: false, msg: '' },
    copyLabel: '⎘ Copy',
    loadingMessage: 'Writing...',
    emptyStateIndex: 0,
    konamiSequence: [],

    // Core State
    aiProv: TSTStorage.getStr('tst_ai_provider', 'gemini'),
    platforms: [
      { name: 'X', key: 'twitter', lim: 280, canDirect: true },
      { name: 'Instagram', key: 'instagram', lim: 2200 },
      { name: 'Facebook', key: 'facebook', lim: 63206 },
      { name: 'Threads', key: 'threads', lim: 500 },
      { name: 'TikTok', key: 'tiktok', lim: 2200 },
      { name: 'Bluesky', key: 'bluesky', lim: 300, canDirect: true },
      { name: 'LinkedIn', key: 'linkedin', lim: 3000, canDirect: true }
    ],
    selectedPlatform: null,

    // Form Inputs
    who: '', what: '', where: '', why: '',
    whenDate: new Date().toISOString().split('T')[0],
    whenTime: new Date().toTimeString().slice(0, 5),
    hashtags: '',
    tone: 'casual',
    contentLength: 2,
    includeUrl: false,
    photos: [],
    customInstructions: TSTStorage.getStr('tst_custom_instructions', ''),

    // Output
    generatedPost: '',
    tempPost: '',
    scheduleDate: new Date().toISOString().split('T')[0],
    scheduleTime: new Date().toTimeString().slice(0, 5),
    schedule: TSTStorage.getJSON('tst_sched', []),
    activityLogs: TSTStorage.getJSON('tst_logs', []),
    postHistory: TSTStorage.getJSON('tst_history', []),
    showHistory: TSTStorage.getBool('tst_show_history', false),

    // Help Modal System (v4.5.0)
    isHelpOpen: false,
    helpTitle: '',
    helpContent: '',

    showHelp(key) {
      const titles = {
        platforms: 'Platform Optimization',
        who: 'Target Audience Selection',
        what: 'Core Message & Link Research',
        urlToggle: 'Organic Reach Strategy',
        where: 'Geographical Relevance',
        why: 'Emotional Hook & Purpose',
        when: 'Temporal Context & Urgency',
        hashtags: 'Discovery & Tagging Strategy',
        tone: 'Narrative Personality',
        length: 'Content Depth & Strategy',
        generate: 'AI Content Generation',
        photos: 'Visual Storytelling',
        schedule: 'Smart Content Scheduling',
        calendar: 'Editorial Calendar & Export',
        history: 'Content Generation Archive',
        activity: 'System Activity & Audit Log',
        postDirect: 'Direct Posting Strategy',
        aiProvider: 'AI Neural Engine Selection',
        apiKeys: 'API Authentication & Security',
        ollama: 'Local Ollama Configuration',
        customInstructions: 'Global Writing Style Rules',
        backupRestore: 'Settings Backup & Portability'
      };
      this.helpTitle = titles[key] || 'SocialToolkit Help';
      this.helpContent = TST_HELP_CONTENT[key] || '';
      this.isHelpOpen = true;
    },

    closeHelp() {
      this.isHelpOpen = false;
    },

    // Keys & Config
    keys: {
      anthropic: TSTStorage.getStr('tst_claude', ''),
      openai: TSTStorage.getStr('tst_openai', ''),
      google: TSTStorage.getStr('tst_gemini', '')
    },
    ollamaUrl: TSTStorage.getStr('tst_ollama_url', 'http://127.0.0.1:11434'),
    ollamaModel: TSTStorage.getStr('tst_ollama_model', ''),
    ollamaModelsPath: TSTStorage.getStr('tst_ollama_models_path', ''),
    ollamaModels: [],

    init() {
      this.migrateLegacyData();
      this.selectedPlatform = this.platforms[0];
      const savedOllama = TSTStorage.getStr('tst_ollama_model', '');
      if (savedOllama) {
        this.ollamaModels = [savedOllama];
        this.$nextTick(() => { this.ollamaModel = savedOllama; });
      }
      
      // Rotate empty state messages
      setInterval(() => { this.emptyStateIndex = (this.emptyStateIndex + 1) % TST_WHIMSY.empty.length; }, 4000);
      
      // Konami code Easter egg
      document.addEventListener('keydown', (e) => {
        this.konamiSequence.push(e.key);
        this.konamiSequence = this.konamiSequence.slice(-10);
        if (this.konamiSequence.join(',') === 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a') {
          this._triggerRainbow();
        }
      });

      // Smart Auto-Selection (v4.2.0)
      this.$nextTick(() => {
        if (!localStorage.getItem('tst_ai_provider')) {
          const hasOllama = !!this.ollamaModel;
          const hasOtherKeys = this.keys.anthropic || this.keys.openai || this.keys.google;
          if (hasOllama && !hasOtherKeys) {
            this.aiProv = 'ollama';
            TSTStorage.set('tst_ai_provider', 'ollama');
            this.logAction('Smart auto-selected Ollama (only provider ready)');
          }
        }
      });
    },

    migrateLegacyData() {
      const legacyMap = {
        'pc_custom_instructions': 'tst_custom_instructions',
        'pc_sched': 'tst_sched',
        'pc_logs': 'tst_logs',
        'pc_history': 'tst_history',
        'pc_show_history': 'tst_show_history',
        'pc_claude': 'tst_claude',
        'pc_openai': 'tst_openai',
        'pc_gemini': 'tst_gemini',
        'pc_ollama_url': 'tst_ollama_url',
        'pc_ollama_model': 'tst_ollama_model',
        'pc_ai_provider': 'tst_ai_provider'
      };

      let migrated = false;
      Object.entries(legacyMap).forEach(([oldKey, newKey]) => {
        const val = localStorage.getItem(oldKey);
        if (val !== null) {
          localStorage.setItem(newKey, val);
          localStorage.removeItem(oldKey);
          migrated = true;
        }
      });

      if (migrated) {
        this.customInstructions = TSTStorage.getStr('tst_custom_instructions', '');
        this.schedule = TSTStorage.getJSON('tst_sched', []);
        this.activityLogs = TSTStorage.getJSON('tst_logs', []);
        this.postHistory = TSTStorage.getJSON('tst_history', []);
        this.showHistory = TSTStorage.getBool('tst_show_history', false);
        this.keys.anthropic = TSTStorage.getStr('tst_claude', '');
        this.keys.openai = TSTStorage.getStr('tst_openai', '');
        this.keys.google = TSTStorage.getStr('tst_gemini', '');
        this.ollamaUrl = TSTStorage.getStr('tst_ollama_url', 'http://127.0.0.1:11434');
        this.ollamaModel = TSTStorage.getStr('tst_ollama_model', '');
        this.aiProv = TSTStorage.getStr('tst_ai_provider', 'gemini');
        this.logAction('Successfully migrated data from previous brand 🚀');
      }
    },

    get emptyStateMessage() { return TST_WHIMSY.empty[this.emptyStateIndex]; },
    get isConfigured() { return !!(this.keys.anthropic || this.keys.openai || this.keys.google || (this.ollamaUrl && this.ollamaModel)); },
    get charCount() { return this.generatedPost.length; },
    get wordCount() {
      if (!this.generatedPost) return 0;
      const text = this.generatedPost.trim();
      if (!text) return 0;
      return text.split(/\s+/).length;
    },
    get charBarColor() {
      if (!this.selectedPlatform || !this.generatedPost) return 'bg-sky-400';
      const pct = this.charProgress;
      if (pct > 100) return 'bg-red-500';
      if (pct < 60) return 'bg-amber-400';
      return 'bg-emerald-400';
    },
    get charProgress() {
      if (!this.selectedPlatform) return 0;
      return (this.charCount / this.selectedPlatform.lim) * 100;
    },
    get charCountLabel() {
      if (!this.selectedPlatform) return '0 characters';
      return `${this.charCount} / ${this.selectedPlatform.lim} characters`;
    },
    get services() {
      return [
        { id: 'claude', name: 'Claude (Anthropic)', sub: 'claude-3-5-haiku-latest', icon: '🤖', link: 'https://console.anthropic.com/settings/keys', keyId: 'anthropic', placeholder: 'sk-ant-api03-...', showKey: false },
        { id: 'openai', name: 'OpenAI', sub: 'gpt-5-nano', icon: '✦', link: 'https://platform.openai.com/api-keys', keyId: 'openai', placeholder: 'sk-proj-...', showKey: false },
        { id: 'gemini', name: 'Google (Gemma)', sub: 'gemma-3-27b-it', icon: '🔵', link: 'https://aistudio.google.com/app/apikey', keyId: 'google', placeholder: 'AIza...', showKey: false },
        { id: 'ollama', name: 'Ollama', sub: 'Local server', icon: '🦙', link: 'https://ollama.com/download' }
      ];
    },
    providers: [
      { id: 'gemini', name: 'Gemma', icon: '🔵', model: '3 27B', key: 'google' },
      { id: 'openai', name: 'OpenAI', icon: '✦', model: 'GPT-5 Nano', key: 'openai' },
      { id: 'claude', name: 'Claude', icon: '🤖', model: '3.5 Haiku', key: 'anthropic' },
      { id: 'ollama', name: 'Ollama', icon: '🦙', model: 'Local' }
    ],

    openModal() { this.showModal = true; },
    closeModal() { this.showModal = false; },

    isSvcReady(svc) {
      if (!svc) return false;
      if (svc.id === 'ollama') return !!(this.ollamaUrl && this.ollamaModel);
      const keyMap = { claude: 'anthropic', openai: 'openai', gemini: 'google', google: 'google' };
      const keyId = svc.keyId || svc.key || keyMap[svc.id];
      return !!this.keys[keyId];
    },
    svcStatusMessage(svc) {
      if (svc?.id === 'ollama' && !this.ollamaModel) return 'Model needed';
      return this.isSvcReady(svc) ? 'Connected' : 'Key needed';
    },
    getProviderLabel() { return TST_PROV_LABEL[this.aiProv] || this.aiProv; },

    handleDrop(e) { this.isDragging = false; this.addFiles(e.dataTransfer.files); },
    handleUpload(e) { this.addFiles(e.target.files); },
    addFiles(files) {
      Array.from(files).forEach(f => {
        if (!f.type.startsWith('image/')) return;
        const r = new FileReader();
        r.onload = e => this.photos.push({ name: f.name, url: e.target.result });
        r.readAsDataURL(f);
      });
    },
    removePhoto(i) { this.photos.splice(i, 1); },

    pickPlatform(p) {
      this.selectedPlatform = p;
      this.logAction(`Switched to ${p.name} (${p.lim} chars) 📱`);
    },

    startEdit() { this.tempPost = this.generatedPost; this.isEditing = true; },
    cancelEdit() { this.isEditing = false; },
    saveEdit() {
      this.generatedPost = this.tempPost;
      this.isEditing = false;
      this.logAction('Post edited and saved ✍️');
      this.toastMsg('Post updated!');
    },

    async saveKeys() {
      TSTStorage.set('tst_claude', this.keys.anthropic);
      TSTStorage.set('tst_openai', this.keys.openai);
      TSTStorage.set('tst_gemini', this.keys.google);
      TSTStorage.set('tst_ollama_url', this.ollamaUrl);
      TSTStorage.set('tst_ollama_model', this.ollamaModel);
      TSTStorage.set('tst_ollama_models_path', this.ollamaModelsPath);
      TSTStorage.set('tst_ai_provider', this.aiProv);
      TSTStorage.set('tst_custom_instructions', this.customInstructions);
      this.showModal = false;
      this.toastMsg('Settings saved!');
      this.logAction('Settings saved to local storage 💾');
    },

    async fetchOllamaModels() {
      this.isFetchingModels = true;
      try {
        const baseUrl = this.ollamaUrl.trim().replace(/\/+$/, '');
        const r = await fetch(`${baseUrl}/api/tags`, { mode: 'cors' });
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        const d = await r.json();
        if (d && d.models && d.models.length > 0) {
          this.ollamaModels = d.models.map(m => m.name);
          this.toastMsg(`Found ${this.ollamaModels.length} models!`);
          this.logAction(`Discovered ${this.ollamaModels.length} Ollama models 🦙`);
        } else {
          this.toastMsg('Ollama returned no models', true);
        }
      } catch (e) {
        console.error('[Ollama] Connection Error:', e);
        this.toastMsg(`Ollama: ${e.message}`, true);
      } finally {
        this.isFetchingModels = false;
      }
    },

    pickAI(id) {
      if (id !== 'ollama' && !this.keys[id === 'gemini' ? 'google' : (id === 'claude' ? 'anthropic' : id)]) {
        this.toastMsg(`Add ${id} key first!`, true);
        this.showModal = true;
        return;
      }
      if (id === 'ollama' && !this.ollamaModel) {
        this.toastMsg('Select Ollama model first!', true);
        this.showModal = true;
        return;
      }
      this.aiProv = id;
      TSTStorage.set('tst_ai_provider', id);
    },

    async generate() {
      if (!this.who && !this.what && !this.where && !this.why) {
        this.toastMsg('Fill in at least one W!', true);
        return;
      }
      this.isGenerating = true;
      const msgInterval = setInterval(() => {
        this.loadingMessage = TST_WHIMSY.loading[Math.floor(Math.random() * TST_WHIMSY.loading.length)];
      }, 2000);

      try {
        const p = TST_ContentEngine.buildPrompt(this);
        this.logAction(`Generating post for ${this.selectedPlatform.name} using ${this.getProviderLabel()}... ⏳`);
        
        let txt = '';
        if (this.aiProv === 'claude') txt = await TST_AIService.callClaude(p, this.keys.anthropic, this.photos);
        else if (this.aiProv === 'openai') txt = await TST_AIService.callOpenAI(p, this.keys.openai, this.photos);
        else if (this.aiProv === 'gemini') txt = await TST_AIService.callGemini(p, this.keys.google, this.photos);
        else if (this.aiProv === 'ollama') txt = await TST_AIService.callOllama(p, this.ollamaUrl, this.ollamaModel, this.photos);

        this.generatedPost = txt.trim();

        // Pass 2: Final Polish if over limit
        if (this.charCount > this.selectedPlatform.lim) {
          clearInterval(msgInterval);
          this.loadingMessage = "Polishing text to fit platform limits... 🛠️";
          this.logAction(`Post over limit (${this.charCount}/${this.selectedPlatform.lim}). Polishing... 🛠️`);
          this.generatedPost = await TST_ContentEngine.polish(this.generatedPost, this.selectedPlatform.lim, this);
        }

        // Final Safety Nets
        this.generatedPost = TST_Utils.stripMarkdown(this.generatedPost);
        if (!this.includeUrl) {
          this.generatedPost = TST_Utils.stripLinks(this.generatedPost);
        }

        // Auto-save to history
        this.postHistory.unshift({
          id: Date.now(),
          post: this.generatedPost,
          platform: this.selectedPlatform.name,
          ai: this.getProviderLabel(),
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
        if (this.postHistory.length > 20) this.postHistory.pop();
        TSTStorage.set('tst_history', this.postHistory);
        this.toastMsg('Boom! Your post is ready 🎉');
        if (typeof this._burstConfetti === 'function') this._burstConfetti();
      } catch (e) {
        this.logAction(`Error: ${e.message} 🛑`);
        this.toastMsg(e.message || 'Oops… API error!', true);
      } finally {
        clearInterval(msgInterval);
        this.isGenerating = false;
      }
    },

    doGenerate() { this.generate(); },
    regeneratePost() {
      if (this.isGenerating) return;
      this.logAction('Regenerating post with same inputs ↻');
      this.generate();
    },

    removeFromSched(index) {
      const id = this.schedule[index]?.id;
      if (id) this.rmvRow(id);
    },

    copyPost() {
      navigator.clipboard.writeText(this.generatedPost);
      this.copyLabel = 'Copied! ✨';
      if (typeof this._spawnSparkle === 'function') this._spawnSparkle();
      this.logAction('Post copied to clipboard 📋');
      this.toastMsg('Copied to clipboard!');
      setTimeout(() => { this.copyLabel = '⎘ Copy'; }, 2000);
    },

    postDirectly() {
      if (!this.generatedPost || !this.selectedPlatform) {
        this.toastMsg('Generate a post first!', true);
        return;
      }
      const text = encodeURIComponent(this.generatedPost);
      let url = '';
      switch (this.selectedPlatform.key) {
        case 'twitter': url = `https://x.com/compose/tweet?text=${text}`; break;
        case 'linkedin': url = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`; break;
        case 'bluesky': url = `https://bsky.app/intent/compose?text=${text}`; break;
      }
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    },

    googleSearch() {
      const q = [this.who, this.what, this.where, this.why].filter(Boolean).join(' ');
      window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}&udm=50`, '_blank');
    },

    addToSched() {
      if (!this.generatedPost) {
        this.toastMsg('Generate a post first!', true);
        return;
      }
      this.schedule.unshift({
        id: Date.now(),
        ai: this.getProviderLabel(),
        platform: this.selectedPlatform.name,
        post: this.generatedPost,
        date: this.scheduleDate,
        time: this.scheduleTime
      });
      TSTStorage.set('tst_sched', this.schedule);
      this.logAction(`Added post to calendar for ${this.selectedPlatform.name} 🗓️`);
      this.toastMsg('Added to calendar!');
    },

    rmvRow(id) {
      this.schedule = this.schedule.filter(s => s.id !== id);
      TSTStorage.set('tst_sched', this.schedule);
      this.logAction('Removed post from calendar 🗑️');
    },

    clearSched() {
      if (confirm('Clear calendar?')) {
        this.schedule = [];
        TSTStorage.remove('tst_sched');
        this.logAction('Calendar cleared 🧹');
      }
    },

    exportCSV() {
      const hdr = 'AI Provider,Platform,Post,Date,Time\n';
      const rows = this.schedule.map(s => `"${s.ai}","${s.platform}","${s.post.replace(/"/g, '""')}","${s.date}","${s.time}"`).join('\n');
      const blob = new Blob([hdr + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href: url, download: 'socialtoolkit-calendar.csv' });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    },

    exportBackup() {
      const data = {
        keys: this.keys,
        ollamaUrl: this.ollamaUrl,
        ollamaModel: this.ollamaModel,
        customInstructions: this.customInstructions,
        aiProv: this.aiProv,
        selectedPlatformKey: this.selectedPlatform?.key,
        schedule: this.schedule,
        history: this.postHistory,
        logs: this.activityLogs,
        timestamp: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href: url, download: `socialtoolkit-backup-${new Date().toISOString().split('T')[0]}.json` });
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      this.logAction('Full data backup exported 📦');
      this.toastMsg('Full backup downloaded!');
    },

    importBackup(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (confirm('Import backup? Overwrites current settings.')) {
            Object.assign(this, data);
            if (data.selectedPlatformKey) {
              this.selectedPlatform = this.platforms.find(pl => pl.key === data.selectedPlatformKey) || this.selectedPlatform;
            }
            this.saveKeys();
            this.logAction('Full data backup imported 📥');
            this.toastMsg('Backup restored!');
          }
        } catch (err) { this.toastMsg('Error reading backup file', true); }
      };
      reader.readAsText(file);
    },

    clearForm() {
      this.who = ''; this.what = ''; this.where = ''; this.why = ''; this.hashtags = '';
      this.photos = []; this.generatedPost = '';
      this.logAction('Form cleared 🧼');
      this.toastMsg('Form cleared');
    },

    toastMsg(m, err = false) {
      this.toast = { show: true, msg: m, err };
      setTimeout(() => this.toast.show = false, 3000);
    },

    logAction(m) {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.activityLogs.unshift({ id: Date.now(), msg: m, time });
      if (this.activityLogs.length > 50) this.activityLogs.pop();
      TSTStorage.set('tst_logs', this.activityLogs);
    },

    clearLogs() {
      this.activityLogs = []; TSTStorage.remove('tst_logs');
      this.logAction('Activity logs cleared 🧹');
    },

    exportLog() {
      const lines = this.activityLogs.map(l => `[${l.time}] ${l.msg}`).join('\n');
      const blob = new Blob([lines], { type: 'text/plain' });
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'tvcnet-social-toolkit-log.txt' });
      a.click();
      this.logAction('Activity log exported 📥');
    },

    toggleHistory() {
      this.showHistory = !this.showHistory;
      TSTStorage.set('tst_show_history', this.showHistory);
    },

    clearHistory() {
      if (confirm('Clear history?')) {
        this.postHistory = [];
        TSTStorage.remove('tst_history');
        this.logAction('History cleared 🧹');
      }
    },

    removeFromHistory(id) {
      this.postHistory = this.postHistory.filter(h => h.id !== id);
      TSTStorage.set('tst_history', this.postHistory);
      this.logAction('Removed entry from history 🗑️');
    },

    restoreFromHistory(entry) {
      if (!entry) return;
      this.generatedPost = entry.post;
      const p = this.platforms.find(pl => pl.name === entry.platform);
      if (p) this.selectedPlatform = p;
      this.logAction(`Restored post from history (${entry.platform}) ⇮`);
      this.toastMsg('Post restored!');
    },

    _burstConfetti() {
      const colors = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'tst-confetti-particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.width = Math.random() * 8 + 4 + 'px';
        p.style.height = p.style.width;
        p.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 2000);
      }
    },
    
    _spawnSparkle() {
      const s = document.createElement('div');
      s.className = 'tst-sparkle';
      s.textContent = '✨';
      s.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 100) + 'px';
      s.style.top = (window.innerHeight / 2 + (Math.random() - 0.5) * 100) + 'px';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    },

    _triggerRainbow() {
      document.body.classList.toggle('tst-rainbow-mode');
      this.logAction('🌈 Rainbow Mode Activated!');
    }
  }));
});
