<script>
  import saveSvgAsPng from "save-svg-as-png";
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

    const maxFieldLength = 23;
    const maxFieldLengthArray = legendArray.reduce(function(acc, curr) {
      curr.legendText.forEach(function(d, i) {
        if (d.length > acc[i] || acc[i] === undefined)
          acc[i] = d.length > maxFieldLength ? maxFieldLength : d.length;
      });
      return acc;
    }, []);

    const legendLine = legendArray.map(function(d) {
      const legendText = d.legendText
        .map(function(e, i) {
          let currString = e;
          if (e.length > maxFieldLength) {
            currString = e.slice(0, maxFieldLength - 3) + "...";
          } else {
            currString = e.padEnd(maxFieldLengthArray[i]);
          }
          return currString;
        })
        .join("   ");
      return { color: d.color, legendText };
    });

    //Get SVG, format, and add elements
    const width = 1050;
    const height = 810;
    const svg = document.getElementById("line-chart-svg").cloneNode(true);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.fontFamily = "Helvetica, Arial, sans-serif";
    svg
      .querySelector(".chart-container")
      .setAttribute("transform", "translate(0, 80)");

    //Title
    const titleText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    titleText.setAttributeNS(null, "font-size", "30px");
    titleText.setAttributeNS(null, "transform", `translate(20,30)`);
    titleText.innerHTML = title;

    //Subtitle
    const subtitleText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    subtitleText.setAttributeNS(null, "font-size", "20px");
    subtitleText.setAttributeNS(null, "transform", `translate(20,60)`);
    subtitleText.innerHTML = subtitle;

    //Legend
    legendLine.forEach(function(d, i) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttributeNS(
        null,
        "transform",
        `translate(30, ${height - 250 + i * 25})`
      );

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.style.fontFamily = "monospace";
      text.style.whiteSpace = "pre";
      text.setAttributeNS(null, "font-size", 14);
      text.setAttributeNS(null, "dx", 50);
      text.setAttributeNS(null, "dy", 15);
      const textNode = document.createTextNode(d.legendText);
      text.appendChild(textNode);

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

    // console.log(svg);
    saveSvgAsPng.saveSvgAsPng(svg, "nurse_line_chart.png", {
      backgroundColor: "#fff"
    });
  }

  function generateMapImage() {
    //Get and prepare non-svg elements for conversion into svg elements
    const div = document.getElementById("simple-map-container");
    const title = div.querySelector(".title").innerText;
    const subtitle = div.querySelector(".subtitle").innerText;

    const width = 1080;
    const height = 510;

    //Clone svgs and combine
    const svg = document.getElementById("map-svg").cloneNode(true);
    // svg.setAttribute("width", width);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.fontFamily = "Helvetica, Arial, sans-serif";
    svg.firstChild.setAttributeNS(
      null,
      "transform",
      `translate(630,200) scale(1.4)`
    );
    const chartGroup = document
      .getElementById("row-chart-svg")
      .firstChild.cloneNode(true);

    chartGroup.setAttributeNS(null, "transform", `translate(0, 100) scale(2)`);
    chartGroup.setAttributeNS(null, "font-size", "10px");
    svg.appendChild(chartGroup);

    //Title
    const titleText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    titleText.setAttributeNS(null, "font-size", "42px");
    titleText.setAttributeNS(null, "transform", `translate(5,40)`);
    titleText.innerHTML = title;

    //Subtitle
    const subtitleText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    subtitleText.setAttributeNS(null, "font-size", "21px");
    subtitleText.setAttributeNS(null, "transform", `translate(5,70)`);
    subtitleText.innerHTML = subtitle;

    //Append elements
    svg.appendChild(titleText);
    svg.appendChild(subtitleText);

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
