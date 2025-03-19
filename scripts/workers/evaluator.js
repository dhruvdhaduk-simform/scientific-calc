"use strict";

// Initialize some global variable to use directly inside eval()
const abs = Math.abs;
const floor = Math.floor;
const ceil = Math.ceil;
const round = Math.round;
const cbrt = Math.cbrt;

const log = Math.log10;
const ln = Math.log;

const π = Math.PI;
const e = Math.E;

const sqrt = Math.sqrt;

function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

// Handle message events from main script.
globalThis.addEventListener("message", function(event) {
    try {
        let result = eval(event.data);

        // Handle divide by 0
        if (!isFinite(result)) {
            throw new Error("This operation is not allowed");
        }

        globalThis.postMessage({
            success: true,
            q: event.data,
            result
        });
    } catch (error) {
        globalThis.postMessage({
            success: false,
            q: event.data,
            error: error.toString()
        })
    }
});
