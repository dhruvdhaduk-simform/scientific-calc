"use strict";

export class Memory {
    #value;

    constructor(key) {
        this.key = key;

        const storedMemory = Number(localStorage.getItem(key));
        if (storedMemory && !isNaN(storedMemory))
            this.#value = storedMemory;
        else
            this.#value = 0;
    }

    storeCurrentValue() {
        localStorage.setItem(this.key, this.#value);
    }

    clear() {
        this.#value = 0;
        this.storeCurrentValue();
    }

    recall(callback = () => { }) {
        callback(this.#value);
        return this.#value;
    }

    plus(x) {
        x = Number(x);
        if (isNaN(x)) {
            const msg = "Only Numbers are allowed to add inside memory";
            alert(msg);
            throw new TypeError(msg);
        }

        this.#value += x;
        this.storeCurrentValue();
    }

    minus(x) {
        x = Number(x);
        if (isNaN(x)) {
            const msg = "Only Numbers are allowed to subtract from memory";
            alert(msg);
            throw new TypeError(msg);
        }

        this.#value -= x;
        this.storeCurrentValue();
    }

    store(x) {
        x = Number(x);
        if (isNaN(x)) {
            const msg = "Only Numbers are allowed to store inside memory";
            alert(msg);
            throw new TypeError(msg);
        }

        this.#value = x;
        this.storeCurrentValue();
    }

}
