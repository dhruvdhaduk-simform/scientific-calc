"use strict";

import { Calculator } from "./calculator.js";

// Initialize the calculator.
let calculator = new Calculator("memoryKey", {
    displayId: "display-text",
    btnsId: "control",
    degRanBtnId: "deg-rad",
    fnModeBtnId: "fn-mode",
    resultModeBtnId: "result-mode",
    sinBtnId: "sin-btn",
    cosBtnId: "cos-btn",
    tanBtnId: "tan-btn",
});
