"use strict";

const NUMBERS_CHARACTER_LIMIT = 15;

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

        if (!isNaN(txt)) {
            let digitCount = txt.length;
            const displayedTxt = this.get();
            for (let i = displayedTxt.length - 1; i >= 0; i--) {
                if (!isNaN(displayedTxt[i]) || displayedTxt[i] === '.') {
                    digitCount++;
                    continue;
                }
                break;
            }

            if (digitCount > NUMBERS_CHARACTER_LIMIT) {
                alert(`Only ${NUMBERS_CHARACTER_LIMIT} digits long numbers are allowed.`);
                return;
            }
        }

        if (txt.endsWith(".")) {
            let multipleDots = false;
            if (txt[length - 2] === '.') {
                multipleDots = true;
            }

            if (multipleDots) {
                return;
            }

            if (txt.length === 1 && this.get().endsWith(".")) {
                return;
            }
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
