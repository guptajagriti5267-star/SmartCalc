const display = document.getElementById("display");
const historyContainer = document.getElementById("history");
const themeBtn = document.getElementById("themeBtn");
const copyBtn = document.getElementById("copyBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

// Add value to display
function appendValue(value) {
    display.value += value;
}

// Clear display
function clearDisplay() {
    display.value = "";
}

// Delete last character
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Calculate result
function calculate() {

    if (display.value.trim() === "") {
        return;
    }

    try {

        let expression = display.value;

        // Allow only safe calculator characters
        if (!/^[0-9+\-*/().%a-zA-Z]+$/.test(expression)) {
            throw new Error("Invalid input");
        }

        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid calculation");
        }

        addToHistory(expression, result);

        display.value = result;

    } catch (error) {

        display.value = "Error";

        setTimeout(() => {
            display.value = "";
        }, 1000);
    }
}

// Square root
function squareRoot() {

    try {

        let value = Number(display.value);

        if (value < 0 || isNaN(value)) {
            throw new Error();
        }

        let result = Math.sqrt(value);

        addToHistory(`√${value}`, result);
        display.value = result;

    } catch {
        showError();
    }
}

// Square
function square() {

    try {

        let value = Number(display.value);

        if (isNaN(value)) {
            throw new Error();
        }

        let result = value * value;

        addToHistory(`${value}²`, result);
        display.value = result;

    } catch {
        showError();
    }
}

// Inverse
function inverse() {

    try {

        let value = Number(display.value);

        if (isNaN(value) || value === 0) {
            throw new Error();
        }

        let result = 1 / value;

        addToHistory(`1/${value}`, result);
        display.value = result;

    } catch {
        showError();
    }
}

// Sin
function sinValue() {

    try {

        let value = Number(display.value);

        if (isNaN(value)) {
            throw new Error();
        }

        let result = Math.sin(value * Math.PI / 180);

        addToHistory(`sin(${value}°)`, result);
        display.value = result.toFixed(6);

    } catch {
        showError();
    }
}

// Cos
function cosValue() {

    try {

        let value = Number(display.value);

        if (isNaN(value)) {
            throw new Error();
        }

        let result = Math.cos(value * Math.PI / 180);

        addToHistory(`cos(${value}°)`, result);
        display.value = result.toFixed(6);

    } catch {
        showError();
    }
}

// Tan
function tanValue() {

    try {

        let value = Number(display.value);

        if (isNaN(value)) {
            throw new Error();
        }

        let result = Math.tan(value * Math.PI / 180);

        addToHistory(`tan(${value}°)`, result);
        display.value = result.toFixed(6);

    } catch {
        showError();
    }
}

// Log
function logValue() {

    try {

        let value = Number(display.value);

        if (value <= 0 || isNaN(value)) {
            throw new Error();
        }

        let result = Math.log10(value);

        addToHistory(`log(${value})`, result);
        display.value = result;

    } catch {
        showError();
    }
}

// Show error
function showError() {

    display.value = "Error";

    setTimeout(() => {
        display.value = "";
    }, 1000);
}

// Add calculation to history
function addToHistory(expression, result) {

    history.unshift({
        expression: expression,
        result: result
    });

    // Keep only latest 10 calculations
    history = history.slice(0, 10);

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );

    displayHistory();
}

// Display history
function displayHistory() {

    historyContainer.innerHTML = "";

    if (history.length === 0) {

        historyContainer.innerHTML =
            "<p>No calculations yet.</p>";

        return;
    }

    history.forEach((item) => {

        const div = document.createElement("div");

        div.className = "history-item";

        div.textContent =
            `${item.expression} = ${item.result}`;

        div.addEventListener("click", () => {
            display.value = item.result;
        });

        historyContainer.appendChild(div);
    });
}

// Clear history
clearHistoryBtn.addEventListener("click", () => {

    history = [];

    localStorage.removeItem("calculatorHistory");

    displayHistory();
});

// Copy result
copyBtn.addEventListener("click", async () => {

    if (display.value === "") {
        return;
    }

    try {

        await navigator.clipboard.writeText(display.value);

        copyBtn.textContent = "✓ Copied";

        setTimeout(() => {
            copyBtn.textContent = "📋 Copy";
        }, 1000);

    } catch {
        alert("Could not copy result");
    }
});

// Dark/light mode
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});

// Load saved theme
if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";
}

// Keyboard support
document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        ["+", "-", "*", "/", ".", "(", ")", "%"].includes(key)
    ) {
        appendValue(key);
    }

    else if (key === "Enter") {
        calculate();
    }

    else if (key === "Backspace") {
        deleteLast();
    }

    else if (key === "Escape") {
        clearDisplay();
    }
});

// Initial history display
displayHistory();