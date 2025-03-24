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

    assertNumber(x) {
        x = Number(x);
        if (!isFinite(x)) {
            const msg = "Only Numbers are allowed to add inside memory";
            alert(msg);
            throw new TypeError(msg);
        }

        return x;
    }

    clear() {
        this.#value = 0;
        this.storeCurrentValue();
    }

    recall() {
        return this.#value;
    }

    plus(x) {
        x = this.assertNumber(x);

        this.#value += x;
        this.storeCurrentValue();
    }

    minus(x) {
        x = this.assertNumber(x);

        this.#value -= x;
        this.storeCurrentValue();
    }

    store(x) {
        x = this.assertNumber(x);

        this.#value = x;
        this.storeCurrentValue();
    }

}
