"use strict";

const abs = Math.abs;
const floor = Math.floor;
const ceil = Math.ceil;

const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;

const log = Math.log;

globalThis.addEventListener("message", function(event) {
    try {
        let result = eval(event.data);
        globalThis.postMessage({
            success: true,
            q: event.data,
            result
        });
    } catch (error) {
        globalThis.postMessage({
            success: false,
            q: event.data,
            error
        })
    }
});