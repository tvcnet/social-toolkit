/**
 * File: tst-history.js
 * Description: Post history management for the TVCNet Social Toolkit.
 * Author: TVCNet
 * Version: 4.10.0
 */

const TST_History = {
  STORAGE_KEY: 'tst_history',
  MAX_ENTRIES: 20,

  /** Load history from storage, sanitizing entries */
  load() {
    return TSTStorage.getJSON(this.STORAGE_KEY, []).filter(h => h && h.post);
  },

  /** Add a new entry to the top of history */
  add(history, entry) {
    history.unshift(entry);
    if (history.length > this.MAX_ENTRIES) history.pop();
    TSTStorage.set(this.STORAGE_KEY, history);
    return history;
  },

  /** Remove an entry by ID */
  remove(history, id) {
    const updated = history.filter(h => h.id !== id);
    TSTStorage.set(this.STORAGE_KEY, updated);
    return updated;
  },

  /** Clear all history */
  clear(confirmed = false) {
    if (confirmed || confirm('Clear history?')) {
      TSTStorage.remove(this.STORAGE_KEY);
      return [];
    }
    return null; // User cancelled
  }
};
