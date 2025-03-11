"use strict";

import { Display } from "./display.js";

export class Calculator {

    constructor(displayID, btnsID) {
        this.display = new Display(displayID);
        this.btns = document.querySelector(`#${btnsID}`);
        this.abortController = new AbortController();

        this.evaluator = new Worker("/scripts/workers/evaluator.js");

        this.init();
    }

    // Add event handlers.
    init() {
        this.btns.addEventListener("click", e => this.handleClickEvent(e), { signal: this.abortController.signal });
        document.addEventListener("keydown", e => this.handleKeyEvents(e), { signal: this.abortController.signal });
        this.evaluator.addEventListener("message", e => this.handleResult(e), { signal: this.abortController.signal });
    }

    // Handle click events from buttons using event delegation.
    handleClickEvent(e) {
        const btn = e.target.closest("button.btn");

        if (!btn?.value) return;

        if (!isNaN(btn.value)) {
            this.display.append(btn.value);
            return;
        }

        switch (btn.value) {
            case "clear":
                this.display.clear();
                return;
            case "backspace":
                this.display.backspace();
                return;
            case "+":
            case "-":
            case "*":
            case "/":
            case ".":
            case "(":
            case ")":
                this.display.append(btn.value);
                return;
            case "=":
                this.evaluator.postMessage(this.display.get());
                return;
        }
    }

    // Handle Key Events.
    handleKeyEvents(e) {
        const key = e.key;

        if (!isNaN(key)) {
            this.display.append(key);
            return;
        }

        switch (key) {
            case "c":
            case "C":
                this.display.clear();
                return;
            case "Backspace":
                this.display.backspace();
                return;
            case "+":
            case "-":
            case "*":
            case "/":
            case ".":
            case "(":
            case ")":
                this.display.append(key);
                return;
            case "=":
            case "Enter":
                this.evaluator.postMessage(this.display.get());
                return;
        }
    }

    // Handle message events from evaluator worker.
    handleResult(e) {
        if (e.data.success) {
            this.display.set(e.data.result);
        }
        else {
            alert(`Error: ${e.data.error.message}`);
            console.error(e.data.error);
        }
    }

    // Remove all event handlers and terminate evaluator worker.
    destroy() {
        this.abortController?.abort();
        this.evaluator.terminate();
    }
}