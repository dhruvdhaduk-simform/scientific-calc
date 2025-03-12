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

        this.handleInput(btn.value);
    }

    // Handle Key Events.
    handleKeyEvents(e) {
        this.handleInput(e.key);
    }

    // Actual Logic to handle input from both Keyboard and Button click
    handleInput(input) {
        if (typeof input !== "string")
            throw new TypeError("Input must be string");
        
        if (!isNaN(input)) {
            this.display.append(input);
            return;
        }
        
        input = input.toLowerCase();

        switch (input) {
            case "c":
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
                this.display.append(input);
                return;
            case "=":
            case "enter":
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