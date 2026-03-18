/**
 * File: tst-services.js
 * Description: AI API service integration for the TVCNet Social Toolkit.
 * Author: TVCNet
 * Version: 4.7.6
 */

const TST_AIService = {
  async callClaude(p, key) {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'anthropic-version': '2023-06-01', 
        'anthropic-dangerous-direct-browser-access': 'true', 
        'x-api-key': key 
      },
      body: JSON.stringify({ model: 'claude-3-5-haiku-latest', max_tokens: 4096, messages: [{ role: 'user', content: p }] })
    });
    if (!r.ok) throw new Error(`Claude API error: ${r.status}`);
    const d = await r.json();
    return d.content?.[0]?.text || '';
  },

  async callOpenAI(p, key) {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model: 'gpt-5-nano', messages: [{ role: 'user', content: p }] })
    });
    if (!r.ok) throw new Error(`OpenAI API error: ${r.status}`);
    const d = await r.json();
    return d.choices?.[0]?.message?.content || '';
  },

  async callGemini(p, key) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${key}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] })
    });
    if (!r.ok) {
      const errData = await r.json().catch(() => ({}));
      console.error('[Gemma] API Failure:', r.status, errData);
      throw new Error(`Gemma API error: ${r.status} ${errData.error?.message || ''}`);
    }
    const d = await r.json();
    return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
  },

  async callOllama(p, baseUrlRaw, model) {
    const baseUrl = baseUrlRaw.trim().replace(/\/+$/, '');
    const r = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: model, messages: [{ role: 'user', content: p }] })
    });
    if (!r.ok) throw new Error(`Ollama API error: ${r.status}`);
    const d = await r.json();
    return d.choices?.[0]?.message?.content || '';
  }
};
