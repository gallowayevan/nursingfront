<script>
  // import { color } from "d3-color";
  import { max } from "d3-array";
  import saveSvgAsPng from "save-svg-as-png";
  import { createSVGtext } from "./utilities.js";
  export let chartType;

  function generateLineChartImage() {
    //Get and prepare non-svg elements for conversion into svg elements
    const div = document.getElementById("line-chart-div");
    const title = div.querySelector(".title").innerText;
    const subtitle = div.querySelector(".subtitle").innerText;

    const lineChartHeight = 580; // So we know where to put the legend
    const tablePadding = 40; //Define some space between chart and table and footer.

    const width = 960;

    ///////////////////////////////////////////////////////
    ////////////Legend Table///////////////////////////////
    //////////////////////////////////////////////////////

    //Extract information from legend table
    const legendTable = document.getElementById("line-chart-table");
    const tableFontFill = "#6C7480";
    const tableHeader = {
      cells: Array.from(
        legendTable.querySelector("thead").querySelectorAll("th"),
        function (d) {
          const svgText = createSVGtext({
            text: d.innerText,
            fill: tableFontFill,
            maxCharsPerLine: 14,
          });
          return {
            text: d.innerText,
            isBold: true,
            svgText,
          };
        }
      ).slice(1), //Lop off first empty element
      type: "header",
      color: "none",
    };

    const tableBody = Array.from(
      legendTable.querySelector("tbody").querySelectorAll("tr"),
      function (d) {
        const columns = Array.from(d.children, function (e, i) {
          if (i == 0) {
            return e.style.backgroundColor; //First cell in each row indicates color of associated line
          }
          const svgText = createSVGtext({
            text: e.innerText,
            fill: tableFontFill,
            maxCharsPerLine: 14,
          });
          return {
            text: e.innerText,
            isBold: e.classList.value.indexOf("has-text-weight-bold") >= 0,
            svgText,
          };
        });

        return {
          cells: columns.slice(1), // Lop off color cell
          color: columns[0], //Store color
          type: "body",
        };
      }
    );
    const tableRows = [tableHeader, ...tableBody];

    //Construct table in SVG
    const tableGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    tableGroup.setAttributeNS(
      null,
      "transform",
      `translate(20, ${lineChartHeight + tablePadding})`
    );
    tableGroup.setAttributeNS(null, "fill", tableFontFill);

    const lineHeight = 17;
    const rowHeight =
      max(tableBody, (d) => max(d.cells, (e) => e.svgText.childElementCount)) *
      lineHeight;
    const headerHeight =
      max(tableHeader.cells, (e) => e.svgText.childElementCount) * lineHeight;

    const rectWidth = 15;
    const colWidth = (width - 40) / tableRows[0].cells.length - rectWidth;
    tableRows.forEach(function (d, i) {
      const row = document.createElementNS("http://www.w3.org/2000/svg", "g");
      row.setAttributeNS(
        null,
        "transform",
        `translate(0, ${i == 0 ? 0 : headerHeight + rowHeight * (i - 1)})`
      );

      const colorRectangle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      colorRectangle.setAttributeNS(null, "width", rectWidth);
      colorRectangle.setAttributeNS(null, "height", rowHeight);
      colorRectangle.setAttributeNS(null, "fill", d.color);
      colorRectangle.setAttributeNS(
        null,
        "transform",
        `translate(${-rectWidth - 3}, -12)`
      );

      row.append(colorRectangle);

      d.cells.forEach(function (e, j) {
        // const cellText = document.createElementNS(
        //   "http://www.w3.org/2000/svg",
        //   "text"
        // );
        e.svgText.setAttributeNS(null, "font-size", "12px");
        e.svgText.setAttributeNS(
          null,
          "transform",
          `translate(${j * colWidth},0)`
        );
        if (e.isBold) {
          e.svgText.setAttributeNS(null, "font-weight", 600);
        }
        // cellText.innerHTML = e.text;
        row.appendChild(e.svgText);
      });

      //Create lines that divide rows
      const ledger = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      ledger.setAttributeNS(null, "x2", colWidth * d.cells.length);
      ledger.setAttributeNS(
        null,
        "transform",
        `translate(0, ${i == 0 ? headerHeight - 12 : rowHeight - 12})`
      );
      // ledger.setAttributeNS(null, "y1", 5);
      // ledger.setAttributeNS(null, "y2", 5);
      ledger.setAttributeNS(null, "stroke", tableFontFill);
      if (i == 0) {
        ledger.setAttributeNS(null, "stroke-width", 2);
      }
      row.appendChild(ledger);
      tableGroup.appendChild(row);
    });

    /////////////////////////////////////
    //////////////Assemble SVG//////////
    ////////////////////////////////////

    //Get SVG, format, and add elements
    const height =
      lineChartHeight + tableRows.length * rowHeight + 2 * tablePadding; //Table padding for top and bottom of table

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

    //Append elements
    svg.appendChild(titleText);
    svg.appendChild(subtitleText);
    svg.appendChild(tableGroup);
    svg.appendChild(sourceText);

    saveSvgAsPng.saveSvgAsPng(svg, "nurse_line_chart.png", {
      backgroundColor: "#fff",
      scale: 2,
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
      maxCharsPerLine: 100,
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
      backgroundColor: "#fff",
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
