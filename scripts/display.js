"use strict";

const CHARACTER_LIMIT = 25;

export class Display {

    constructor(id) {
        this.displayText = document.querySelector(`#${id}`);
        if (!this.displayText) {
            throw new Error("Display element not found on page.");
        }
    }

    clear() {
        this.displayText.textContent = "0";
    }

    append(txt) {
        if (this.displayText.textContent.length >= CHARACTER_LIMIT) {
            alert(`You can only enter 25 characters.`);
            return;
        }

        if (typeof txt !== "string" && typeof txt !== "number")
            throw new TypeError("Display only contains string or number");

        if (this.displayText.textContent.trim() === "0") {
            this.set(txt)
        }
        else {
            this.displayText.textContent += txt;
        }

        this.displayText.scrollTo(this.displayText.offsetWidth, 100);
    }

    backspace() {
        const txt = this.displayText.textContent;
        this.displayText.textContent = txt.substring(0, txt.length - 1);
        if (this.displayText.textContent.trim() === '') {
            this.clear();
        }
    }

    get() {
        return this.displayText.textContent;
    }

    set(txt) {
        this.displayText.textContent = txt;
    }
}
