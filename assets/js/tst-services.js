/**
 * File: tst-services.js
 * Description: AI API service integration for the TVCNet Social Toolkit.
 * Author: TVCNet
 * Version: 4.9.0
 */

const TST_AIService = {
  /**
   * Unified dispatcher — routes to the correct AI provider.
   * Adding a new provider only requires adding one case here.
   */
  async call(provider, prompt, keys, options = {}) {
    const { photos = [], ollamaUrl, ollamaModel } = options;
    const keyMap = TST_PROVIDER_KEY_MAP || {};
    switch (provider) {
      case 'claude':  return this.callClaude(prompt, keys[keyMap.claude], photos);
      case 'openai':  return this.callOpenAI(prompt, keys[keyMap.openai], photos);
      case 'gemini':  return this.callGemini(prompt, keys[keyMap.gemini], photos);
      case 'ollama':  return this.callOllama(prompt, ollamaUrl, ollamaModel, photos);
      default: throw new Error(`Unknown AI provider: ${provider}`);
    }
  },

  _extractBase64(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const base64 = arr[1];
    return { mime, base64 };
  },

  async callClaude(p, key, photos = []) {
    let content = [];
    
    photos.forEach(photo => {
      const { mime, base64 } = this._extractBase64(photo.url);
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: mime, data: base64 }
      });
    });
    content.push({ type: 'text', text: p });

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'anthropic-version': '2023-06-01', 
        'anthropic-dangerous-direct-browser-access': 'true', 
        'x-api-key': key 
      },
      body: JSON.stringify({ model: 'claude-3-5-haiku-latest', max_tokens: 4096, messages: [{ role: 'user', content }] })
    });
    if (!r.ok) throw new Error(`Claude API error: ${r.status}`);
    const d = await r.json();
    return d.content?.[0]?.text || '';
  },

  async callOpenAI(p, key, photos = []) {
    let content = [{ type: 'text', text: p }];
    photos.forEach(photo => {
      content.push({ type: 'image_url', image_url: { url: photo.url } });
    });

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model: 'gpt-5-nano', messages: [{ role: 'user', content }] })
    });
    if (!r.ok) throw new Error(`OpenAI API error: ${r.status}`);
    const d = await r.json();
    return d.choices?.[0]?.message?.content || '';
  },

  async callGemini(p, key, photos = []) {
    let parts = [{ text: p }];
    photos.forEach(photo => {
      const { mime, base64 } = this._extractBase64(photo.url);
      parts.push({ inline_data: { mime_type: mime, data: base64 } });
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${key}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] })
    });
    if (!r.ok) {
      const errData = await r.json().catch(() => ({}));
      console.error('[Gemma] API Failure:', r.status, errData);
      throw new Error(`Gemma API error: ${r.status} ${errData.error?.message || ''}`);
    }
    const d = await r.json();
    return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
  },

  async callOllama(p, baseUrlRaw, model, photos = []) {
    const baseUrl = baseUrlRaw.trim().replace(/\/+$/, '');
    let content = [{ type: 'text', text: p }];
    
    photos.forEach(photo => {
      content.push({ type: 'image_url', image_url: { url: photo.url } });
    });

    const r = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: model, messages: [{ role: 'user', content }] })
    });
    if (!r.ok) throw new Error(`Ollama API error: ${r.status}`);
    const d = await r.json();
    return d.choices?.[0]?.message?.content || '';
  }
};
