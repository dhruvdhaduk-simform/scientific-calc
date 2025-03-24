"use strict";

import { Display } from "./display.js";
import { Memory } from "./memory.js";

export class Calculator {

    constructor(displayID, btnsID, memoryKey) {
        this.display = new Display(displayID);
        this.btns = document.querySelector(`#${btnsID}`);
        this.abortController = new AbortController();

        this.degRadBtn = document.querySelector("#deg-rad");
        this.fnModeBtn = document.querySelector("#fn-mode");
        this.resultModeBtn = document.querySelector("#result-mode");

        this.sinBtn = document.querySelector("#sin-btn");
        this.cosBtn = document.querySelector("#cos-btn");
        this.tanBtn = document.querySelector("#tan-btn");

        this.evaluator = new Worker("/scripts/workers/evaluator.js");

        this.memory = new Memory(memoryKey);

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

        if (btn?.dataset?.type === "memory") {
            this.handleMemoryFunctions(btn.value);
        }
        else {
            this.handleInput(btn.value);
        }
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
                this.sendQuery(this.display.get());
                return;
            case "e":
                this.display.append(input);
                return;
            case "pi":
                this.display.append("π");
                return;
            case "square":
                this.display.append("^2");
                return;
            case "sqrt":
                this.display.append("√");
                return;
            case "power10":
                this.display.append("10^");
                return;
            case "^":
            case "power":
                this.display.append("^");
                return;
            case "reciprocal":
                this.display.append("1/");
                return;
            case "!":
            case "factorial":
                this.display.append("!");
                return;
            case "log":
                this.display.append("log(");
                return;
            case "ln":
                this.display.append("ln(");
                return;
            case "%":
            case "mod":
                this.display.append("%");
                return;
            case "exp":
                this.display.append("e^");
                return;
            case "abs":
                this.display.append("abs(");
                return;
            case "plusminus":
                this.sendQuery(`(-1) * (${this.display.get()})`);
                return;
            case "sin":
            case "cos":
            case "tan":
            case "asin":
            case "acos":
            case "atan":
            case "floor":
            case "ceil":
            case "round":
            case "cbrt":
                this.display.append(`${input}(`);
                return;
            case "deg":
            case "rad":
                this.toggleDegRad();
                return;
            case "fn1":
            case "fn2":
                this.toggleFnMode();
                return;
            case "f-e":
            case "ex":
                this.toggleResultMode();
                return;
        }
    }

    handleMemoryFunctions(input) {
        switch(input) {
            case "mc":
                this.memory.clearMemory();
                return;
            case "mr":
                this.display.set(this.memory.recallMemory());
                return;
            case "m+":
                this.memory.plusMemory(this.display.get());
                return;
            case "m-":
                this.memory.minusMemory(this.display.get());
                return;
            case "ms":
                this.memory.storeMemory(this.display.get());
                return;
        }
    }


    sendQuery(query) {
        this.evaluator.postMessage({
            query,
            degreeMode: this.degRadBtn.value === "deg",
            exponentialResult: this.resultModeBtn.value === "ex",
        });
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

    toggleDegRad() {
        if (this.degRadBtn.value === "deg") {
            this.degRadBtn.value = "rad";
            this.degRadBtn.textContent = "RAD";
            this.degRadBtn.ariaLabel = "Radian Mode";
        }
        else {
            this.degRadBtn.value = "deg";
            this.degRadBtn.textContent = "DEG";
            this.degRadBtn.ariaLabel = "Degree Mode";
        }
    }

    toggleFnMode() {
        if (this.fnModeBtn.value === "fn2") {
            this.fnModeBtn.value = "fn1";
            this.fnModeBtn.textContent = "Primary";
            this.fnModeBtn.ariaLabel = "Primary Function Mode";

            this.sinBtn.value = this.sinBtn.ariaLabel = this.sinBtn.textContent = "asin";
            this.cosBtn.value = this.cosBtn.ariaLabel = this.cosBtn.textContent = "acos";
            this.tanBtn.value = this.tanBtn.ariaLabel = this.tanBtn.textContent = "atan";
        }
        else {
            this.fnModeBtn.value = "fn2";
            this.fnModeBtn.innerHTML = "2<sup>nd</sup>";
            this.fnModeBtn.ariaLabel = "Second Function Mode";

            this.sinBtn.value = this.sinBtn.ariaLabel = this.sinBtn.textContent = "sin";
            this.cosBtn.value = this.cosBtn.ariaLabel = this.cosBtn.textContent = "cos";
            this.tanBtn.value = this.tanBtn.ariaLabel = this.tanBtn.textContent = "tan";
        }
    }

    toggleResultMode() {
        if (this.resultModeBtn.value === "f-e") {
            this.resultModeBtn.value = "ex";
            this.resultModeBtn.textContent = "E";
            this.resultModeBtn.ariaLabel = "Scientific Notation Mode";
        }
        else {
            this.resultModeBtn.value = "f-e";
            this.resultModeBtn.textContent = "F-E";
            this.resultModeBtn.ariaLabel = "Default Notation Mode";
        }
    }

    // Remove all event handlers and terminate evaluator worker.
    destroy() {
        this.abortController?.abort();
        this.evaluator?.terminate();
    }
}
