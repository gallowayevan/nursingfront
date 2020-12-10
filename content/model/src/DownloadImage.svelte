<script>
  import saveSvgAsPng from "save-svg-as-png";
  import { createSVGtext } from "./utilities.js";
  export let chartType;

  function generateLineChartImage() {
    //Get and prepare non-svg elements for conversion into svg elements
    const div = document.getElementById("line-chart-div");
    const title = div.querySelector(".title").innerText;
    const subtitle = div.querySelector(".subtitle").innerText;

    let legendArray = [];
    const legendItems = div.querySelectorAll(".message");
    for (let legendItem of legendItems) {
      const color = legendItem.querySelector(".message-header").style
        .backgroundColor;
      const legendText = legendItem
        .querySelector(".message-body")
        .innerText.split("\n");

      legendArray.push({ color, legendText });
    }

    const maxFieldLengthArray = legendArray.reduce(function(acc, curr) {
      curr.legendText.forEach(function(d, i) {
        if (d.length > acc[i] || acc[i] === undefined) acc[i] = d.length;
      });
      return acc;
    }, []);

    const legendLine = legendArray.map(function(d) {
      const legendText = d.legendText.map(function(e, i) {
        return e.padEnd(maxFieldLengthArray[i]);
      });

      //Cut up into lines to allow line wrapping
      const maxLineLength = 100;
      let legendSubLines = [];
      let legendSubLinesIndex = 0;
      let currentLineLength = 0;
      for (let i = 0; i < legendText.length; i++) {
        if (currentLineLength + legendText[i].length < maxLineLength) {
          legendSubLines[legendSubLinesIndex] =
            legendSubLines[legendSubLinesIndex] == undefined
              ? legendText[i] + "   "
              : legendSubLines[legendSubLinesIndex] + legendText[i] + "   ";
          currentLineLength = legendSubLines[legendSubLinesIndex].length;
        } else {
          legendSubLinesIndex++;
          legendSubLines[legendSubLinesIndex] = legendText[i] + "   ";
          currentLineLength = 0;
        }
      }
      legendSubLines = legendSubLines.map(e => e.trim());
      return { color: d.color, legendSubLines };
    });

    //Get SVG, format, and add elements
    const width = 900;

    const lineHeight = 15;
    const numberOfLines = legendLine
      .map(d => [...d.legendSubLines, "blank line"])
      .reduce((acc, val) => acc.concat(val), []).length;
    const heightOfLines = numberOfLines * lineHeight + 50; //50 is some padding
    const height = 580 + heightOfLines;

    const svg = document.getElementById("line-chart-svg").cloneNode(true);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.fontFamily = "Helvetica, Arial, sans-serif";
    svg
      .querySelector(".chart-container")
      .setAttribute("transform", "translate(20, 100)");

    //Title
    const titleText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    titleText.setAttributeNS(null, "font-size", "30px");
    titleText.setAttributeNS(null, "transform", `translate(40,50)`);
    titleText.innerHTML = title;

    // Subtitle
    const subtitleText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    subtitleText.setAttributeNS(null, "font-size", "20px");
    subtitleText.setAttributeNS(null, "transform", `translate(40,80)`);
    subtitleText.innerHTML = subtitle;

    //Source
    const sourceText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    sourceText.setAttributeNS(null, "font-size", "12px");
    sourceText.setAttributeNS(
      null,
      "transform",
      `translate(40,${height - 20})`
    );
    sourceText.innerHTML = "See more at " + window.location.href;

    //Legend
    legendLine.forEach(function(d, i) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttributeNS(
        null,
        "transform",
        `translate(40, ${height -
          heightOfLines +
          i * (lineHeight + d.legendSubLines.length * lineHeight)})`
      );

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.style.fontFamily = "monospace";
      text.style.whiteSpace = "pre";
      text.setAttributeNS(null, "font-size", 12);
      const x = 50;
      text.setAttributeNS(null, "x", x);
      text.setAttributeNS(null, "dy", lineHeight);

      d.legendSubLines.forEach(function(l) {
        let svgTSpan = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "tspan"
        );
        svgTSpan.setAttributeNS(null, "x", x);
        svgTSpan.setAttributeNS(null, "dy", 1.3 + "em");
        let tSpanTextNode = document.createTextNode(l);
        svgTSpan.appendChild(tSpanTextNode);
        text.appendChild(svgTSpan);
      });

      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

      rect.setAttributeNS(null, "width", 40);
      rect.setAttributeNS(null, "height", 20);
      rect.setAttributeNS(null, "fill", d.color);

      group.appendChild(text);
      group.appendChild(rect);

      svg.appendChild(group);
    });

    //Append elements
    svg.appendChild(titleText);
    svg.appendChild(subtitleText);
    svg.appendChild(sourceText);

    // console.log(svg);
    saveSvgAsPng.saveSvgAsPng(svg, "nurse_line_chart.png", {
      backgroundColor: "#fff",
      scale: 2
    });
  }

  function generateMapImage() {
    //Get and prepare non-svg elements for conversion into svg elements
    const div = document.getElementById("simple-map-container");
    const title = div.querySelector(".title").innerText;
    const subtitle = div.querySelector(".subtitle").innerText;

    //Clone svgs and combine

    //Get map
    const svg = document.getElementById("map-svg").cloneNode(true);

    //Get row chart elements
    const chartGroup = document
      .getElementById("row-chart-svg")
      .firstChild.cloneNode(true);

    //Get number of row chart rect elements to calculate height
    const rowChartElementCount = chartGroup.querySelectorAll("rect").length;

    const width = 1100;
    const height = Math.max(450, 200 + rowChartElementCount * 50);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.fontFamily = "Helvetica, Arial, sans-serif";
    svg.firstChild.setAttributeNS(
      null,
      "transform",
      `translate(630,200) scale(1.4)`
    );

    chartGroup.setAttributeNS(null, "transform", `translate(0, 140) scale(2)`);
    chartGroup.setAttributeNS(null, "font-size", "10px");
    svg.appendChild(chartGroup);

    //Title
    const titleText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    titleText.setAttributeNS(null, "font-size", "42px");
    titleText.setAttributeNS(null, "transform", `translate(20,60)`);
    titleText.innerHTML = title;

    //Subtitle
    const subtitleText = createSVGtext({
      text: subtitle,
      x: 20,
      y: 90,
      fontSize: 20,
      maxCharsPerLine: 100
    });

    //Source
    const sourceText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    sourceText.setAttributeNS(null, "font-size", "12px");
    sourceText.setAttributeNS(
      null,
      "transform",
      `translate(40,${height - 20})`
    );
    sourceText.innerHTML = "See more at " + window.location.href;

    //Append elements
    svg.appendChild(titleText);
    svg.appendChild(subtitleText);
    svg.appendChild(sourceText);

    saveSvgAsPng.saveSvgAsPng(svg, "nurse_projection_map.png", {
      backgroundColor: "#fff"
    });
  }

  function handleSaveImage() {
    if (chartType == "line") {
      generateLineChartImage();
    } else if (chartType == "map") {
      generateMapImage();
    }
  }
</script>

<button title="Save Image" class="button" on:click={handleSaveImage}>
  <svg class="button-icon-svg has-fill-primary">
    <use xlink:href="#fa-image" />
  </svg>
</button>
