"use strict";

export class Display {
    
    constructor(id) {
        this.displayText = document.querySelector(`#${id}`);
        if (!this.displayText) {
            throw new Error("Display element not found on page.");
        }
    }

    clear() {
        this.displayText.textContent = "";
    }

    append(txt) {
        if (typeof txt !== "string" && typeof txt !== "number")
            throw new TypeError("Display only contains string or number");

        if (this.displayText.textContent.trim() === "0") {
            this.clear();
        }
        
        this.displayText.textContent += txt;
        this.displayText.scrollTo(this.displayText.offsetWidth, 0);
    }

    backspace() {
        const txt = this.displayText.textContent;
        this.displayText.textContent = txt.substring(0, txt.length - 1);
    }

    get() {
        return this.displayText.textContent;
    }

    set(txt) {
        this.clear();
        this.append(txt);
    }
}