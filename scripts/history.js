"use strict";

const HISTORY_LIMIT = 20;

export class History {

    constructor(key, onHistoryUpdate) {
        this.key = key;

        let storedHistory;
        try {
            storedHistory = JSON.parse(localStorage.getItem(key));
        } catch (err) { }

        if (storedHistory && Array.isArray(storedHistory)) {
            this.history = storedHistory;
        }
        else {
            this.history = [];
            this.storeCurrentHistory();
        }

        this.onHistoryUpdate = onHistoryUpdate;
        this.onHistoryUpdate (this.history);
    }

    removeOldHistory() {
        this.history.splice(0, this.history.length - HISTORY_LIMIT);
    }

    storeCurrentHistory() {
        localStorage.setItem(this.key, JSON.stringify(this.history));
    }

    push(query, result) {
        if (!query || !isFinite(result)) return;

        this.history.push({ query, result });
        this.removeOldHistory();
        this.storeCurrentHistory();
        this.onHistoryUpdate(this.history);
    }

    getAll() {
        return this.history;
    }

    clear() {
        this.history = [];
        this.storeCurrentHistory();
        this.onHistoryUpdate(this.history);
    }
}
