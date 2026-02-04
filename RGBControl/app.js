// Grab DOM elements
const redSlider = document.getElementById("red");
const greenSlider = document.getElementById("green");
const blueSlider = document.getElementById("blue");
const brightnessSlider = document.getElementById("brightness");

const redValue = document.getElementById("redValue");
const greenValue = document.getElementById("greenValue");
const blueValue = document.getElementById("blueValue");
const brightnessValue = document.getElementById("brightnessValue");

const preview = document.getElementById("preview");
const hexValue = document.getElementById("hexValue");

const jsonOutput = document.getElementById("jsonOutput");
const sendBtn = document.getElementById("sendBtn");
const status = document.getElementById("status");

// Convert 0-255 values to 2-Digit Hex String

function toHex2(n) {
    const clamped = Math.max(0, Math.min(255, Number(n) || 0));
    return clamped.toString(16).padStart(2, "0").toUpperCase();
}

/**
 * Apply brightness to RGB
 * RGB is scaled by brightness/100
 */

function applyBrightness(rgb, brightnessPct) {
    const factor = Math.max(0, Math.min(100, Number(brightnessPct) || 0)) / 100;

    return {
        r: Math.round(rgb.r * factor),
        g: Math.round(rgb.g * factor),
        b: Math.round(rgb.b * factor),
    };
}

/**
 * Build the payload that would be sent to an API later.
 * Include both "raw" values as seen in sliders and "effective" values that are applied after brightness.
 */

function buildPayload() {
    const raw = {
        r: Number(redSlider.value),
        g: Number(greenSlider.value),
        b: Number(blueSlider.value),
        brightness: Number(brightnessSlider.value),
    };

    const effective = applyBrightness({ r: raw.r, g: raw.g, b: raw.b}, raw.brightness);

    const hex = `#${toHex2(effective.r)}${toHex2(effective.g)}${toHex2(effective.b)}`;

    return {
        power: raw.brightness > 0,
        raw,
        effective,
        hex,
    };
}

function render() {
    redValue.textContent = redSlider.value;
    greenValue.textContent = greenSlider.value;
    blueValue.textContent = blueSlider.value;
    brightnessValue.textContent = brightnessSlider.value;

    const payload = buildPayload();

    const { r, g, b } = payload.effective;
    preview.style.background = `rgb(${r}, ${g}, ${b})`;

    hexValue.textContent = payload.hex;

    jsonOutput.textContent = JSON.stringify(payload, null, 2);

    status.textContent = "";
}

function sendToApiSimulated() {
    const payload = buildPayload();

    status.textContent = "sending to /api/light ...";
    sendBtn.disabled = true;

    setTimeout(() => {
        console.log("SIMULATED API SEND -> /api/light", payload);
        status.textContent = "Successfully sent to /api/light (SIMULATED). Check the console.";
        sendBtn.disabled = false;

    }, 600);
}

[redSlider, greenSlider, blueSlider, brightnessSlider].forEach(slider =>{
    slider.addEventListener("input", render);
});

sendBtn.addEventListener("click", sendToApiSimulated);

render();
