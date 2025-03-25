"use strict";

const HISTORY_LIMIT = 20;

export class History {

    constructor(key, onHistoryChange) {
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

        this.onHistoryChange = onHistoryChange;
        this.onHistoryChange(this.history);
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
        this.onHistoryChange(this.history);
    }

    getAll() {
        return this.history;
    }

    clear() {
        this.history = [];
        this.storeCurrentHistory();
        this.onHistoryChange(this.history);
    }
}
