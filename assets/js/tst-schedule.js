/**
 * File: tst-schedule.js
 * Description: Content calendar / schedule management for the TVCNet Social Toolkit.
 * Author: TVCNet
 * Version: 4.11.0
 */

const TST_Schedule = {
  STORAGE_KEY: 'tst_sched',

  /** Load schedule from storage */
  load() {
    return TSTStorage.getJSON(this.STORAGE_KEY, []);
  },

  /** Add a new entry to the schedule */
  add(schedule, entry) {
    schedule.unshift(entry);
    TSTStorage.set(this.STORAGE_KEY, schedule);
    return schedule;
  },

  /** Remove an entry by ID */
  remove(schedule, id) {
    const updated = schedule.filter(s => s.id !== id);
    TSTStorage.set(this.STORAGE_KEY, updated);
    return updated;
  },

  /** Clear all schedule entries */
  clear(confirmed = false) {
    if (confirmed || confirm('Clear calendar?')) {
      TSTStorage.remove(this.STORAGE_KEY);
      return [];
    }
    return null; // User cancelled
  },

  /** Export schedule as CSV and trigger download */
  exportCSV(schedule) {
    const hdr = 'AI Provider,Platform,Post,Date,Time\n';
    const rows = schedule.map(s =>
      `"${s.ai}","${s.platform}","${s.post.replace(/"/g, '""')}","${s.date}","${s.time}"`
    ).join('\n');
    const blob = new Blob([hdr + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'socialtoolkit-calendar.csv' });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
};
