import { color } from "d3-color";


export function fontColor(bgColor) {
    //https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
    const rgb = color(bgColor).rgb();
    return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 186
        ? "#000000"
        : "#ffffff";
}

export function titleCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function flat() {
    return this.reduce(function (acc, curr) {
        return acc.concat(curr);
    }, []);
}


export function numberFormat(total = 1) {
    return v =>
        total
            ? Math.round(v).toLocaleString()
            : v.toLocaleString(undefined, {
                minimumSignificantDigits: 3,
                maximumSignificantDigits: 3
            });
}

export function makeQueryURL(params, baseURL = "__root__") {
    return `${baseURL}?${params
        .map(d => `${d.name}=${d.value}`)
        .join("&")}`;
}


export async function dataFetch(queryURL) {
    const data = await fetch(queryURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(json => {
            if (json.length == 0) {
                throw new Error("No data.");
            } else {
                return json;
            }
        })
        .catch(error => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
    return data;
}

// Underscore.js 1.9.2
// https://underscorejs.org
// (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
// Underscore may be freely distributed under the MIT license.
const restArguments = function (func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function () {
        var length = Math.max(arguments.length - startIndex, 0),
            rest = Array(length),
            index = 0;
        for (; index < length; index++) {
            rest[index] = arguments[index + startIndex];
        }
        switch (startIndex) {
            case 0: return func.call(this, rest);
            case 1: return func.call(this, arguments[0], rest);
            case 2: return func.call(this, arguments[0], arguments[1], rest);
        }
        var args = Array(startIndex + 1);
        for (index = 0; index < startIndex; index++) {
            args[index] = arguments[index];
        }
        args[startIndex] = rest;
        return func.apply(this, args);
    };
};

const delay = restArguments(function (func, wait, args) {
    return setTimeout(function () {
        return func.apply(null, args);
    }, wait);
});

export function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function () {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };

    throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
};

export function debounce(func, wait, immediate) {
    var timeout, result;

    var later = function (context, args) {
        timeout = null;
        if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function (args) {
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            var callNow = !timeout;
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(this, args);
        } else {
            timeout = delay(later, wait, this, args);
        }

        return result;
    });

    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
};

// A function to break text into tspans. Adapted from [this Stack Overflow answer](https://stackoverflow.com/questions/475804/svg-word-wrap-show-stopper)
//   and [Wrapping Long Labels](https://bl.ocks.org/mbostock/7555321) 
//   and the function format of [Inputs](https://beta.observablehq.com/@jashkenas/inputs).`

export function createSVGtext(config = {}) {

    let { text, x = 0, y = 0,
        fontSize = 14, fill = '#333',
        textAnchor = "left",
        maxCharsPerLine = 65,
        lineHeight = 1.3 } = config;

    if (typeof config == "string") text = config;

    let svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    svgText.setAttributeNS(null, 'x', x);
    svgText.setAttributeNS(null, 'y', y);
    svgText.setAttributeNS(null, 'font-size', fontSize);
    svgText.setAttributeNS(null, 'fill', fill);
    svgText.setAttributeNS(null, 'text-anchor', textAnchor);

    let words = text.trim().split(/\s+/).reverse(),
        word,
        dy = 0,
        lineNumber = 0,
        line = [];

    while (word = words.pop()) {

        line.push(word);
        let testLineLength = line.join(" ").length;

        if (testLineLength > maxCharsPerLine) {
            line.pop();

            let svgTSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            svgTSpan.setAttributeNS(null, 'x', x);
            svgTSpan.setAttributeNS(null, 'dy', dy + "em");

            let tSpanTextNode = document.createTextNode(line.join(" "));
            svgTSpan.appendChild(tSpanTextNode);
            svgText.appendChild(svgTSpan);

            line = [word];
            dy = lineHeight;
        }
    }

    let svgTSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
    svgTSpan.setAttributeNS(null, 'x', x);
    svgTSpan.setAttributeNS(null, 'dy', dy + "em");

    let tSpanTextNode = document.createTextNode(line.join(" "));
    svgTSpan.appendChild(tSpanTextNode);
    svgText.appendChild(svgTSpan);

    return svgText;
}