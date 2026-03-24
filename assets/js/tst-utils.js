/**
 * File: tst-utils.js
 * Description: Utility functions and storage management for the TVCNet Social Toolkit.
 * Author: TVCNet
 * Version: 4.10.0
 */

/* --- Utilities --- */
const TST_Utils = {
  /* Sanitize helper — validates strings from localStorage to prevent XSS */
  sanitize(str) {
    if (typeof str !== 'string') return str;
    const el = document.createElement('div');
    el.textContent = str;
    return el.innerHTML;
  },

  /* --- String Utils --- */
  stripLinks(text) {
    if (!text) return "";
    // More robust URL regex covering http, https, and common TLD patterns
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]*\.(com|org|net|edu|gov|io|biz|info|me|co|uk|tv|sh|link)\b([^\s]*))/gi;
    // Replace URLs and clean up resulting horizontal spaces, carefully preserving newlines (\n)
    return text.replace(urlRegex, "").replace(/[ \t]+/g, " ").trim();
  },

  stripMarkdown(text) {
    if (!text) return "";
    // Simple regex to strip basic markdown common in LLM outputs: **bold**, _italics_, `code`
    return text
      .replace(/\*\*+(.*?)\*\*+/g, "$1") // Bold
      .replace(/__+(.*?)__+/g, "$1")     // Bold alt
      .replace(/\*+(.*?)\*+/g, "$1")      // Italics
      .replace(/_+(.*?)_+/g, "$1")       // Italics alt
      .replace(/`+(.*?)`+/g, "$1")       // Code
      .trim();
  }
};

/* --- StorageManager --- */
const TSTStorage = {
  getStr: (key, def = '') => {
    const v = localStorage.getItem(key);
    return v !== null ? v : def;
  },
  getBool: (key, def = false) => {
    const v = localStorage.getItem(key);
    return v !== null ? v === 'true' : def;
  },
  getJSON: (key, def = []) => {
    const v = localStorage.getItem(key);
    if (v === null) return def;
    try { return JSON.parse(v) || def; } catch { return def; }
  },
  set: (key, val) => localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val),
  remove: (key) => localStorage.removeItem(key)
};
