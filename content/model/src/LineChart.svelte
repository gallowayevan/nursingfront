<script>
  import Line from "./Line.svelte";
  import LineChartLegendTable from "./LineChartLegendTable.svelte";
  import DifferenceToolTipTable from "./DifferenceToolTipTable.svelte";
  import { scaleLinear } from "d3-scale";
  import { extent, max, group, mean, descending } from "d3-array";
  import { line as d3line, area as d3area, curveMonotoneX } from "d3-shape";
  import XTick from "./XTick.svelte";
  import YTick from "./YTick.svelte";
  import { fade } from "svelte/transition";
  import "array-flat-polyfill";
  import { numberFormat } from "./utilities.js";

  export let data;
  // export let projectionStartYear;
  export let calculation;

  const width = 800;
  const height = 475;
  const margin = { top: 20, right: 60, bottom: 65, left: 90 };

  const colors = [
    "rgb(31, 119, 180)",
    "rgb(255, 127, 14)",
    "rgb(44, 160, 44)",
    "rgb(214, 39, 40)",
    "rgb(148, 103, 189)",
    "rgb(140, 86, 75)",
    "rgb(227, 119, 194)",
    "rgb(127, 127, 127)",
    "rgb(188, 189, 34)",
    "rgb(23, 190, 207)",
    "rgb(174, 199, 232)",
    "rgb(255, 187, 120)",
    "rgb(152, 223, 138)",
    "rgb(255, 152, 150)",
    "rgb(197, 176, 213)",
    "rgb(196, 156, 148)",
    "rgb(247, 182, 210)",
    "rgb(199, 199, 199)",
    "rgb(219, 219, 141)",
    "rgb(158, 218, 229)",
  ];

  let colorMap = new Map();

  //Could this be cleaner?
  $: {
    //Remove unused colors
    colorMap.forEach(function (value, key) {
      if (!data.map((d) => d.id).includes(+key)) {
        colorMap.delete(key);
      }
    });

    //Assign color to new data
    data.forEach(function (d) {
      if (!colorMap.has(d.id)) {
        const availableColors = colors.filter(
          (d) => !Array.from(colorMap.values()).includes(d)
        );
        colorMap.set(d.id, availableColors[0]);
      }
    });
  }

  const transitionDuration = 400;

  //Shape generators
  $: line = d3line()
    .curve(curveMonotoneX)
    .defined((d) => !isNaN(d.value))
    .x((d) => x(d.year))
    .y((d) => y(d.value));

  $: area = d3area()
    .x((d) => x(d.year))
    .y0((d) => y(d.uci))
    .y1((d) => y(d.lci))
    .curve(curveMonotoneX);
  $: console.log(flatData);
  //Scale
  $: flatData = data
    .map((d) =>
      d.values.map((e) =>
        Object.assign(
          {
            id: d.id,
            rateOrTotal: d.params.find((d) => d[0] == "rateOrTotal")[1],
            color: colorMap.get(d.id),
          },
          e
        )
      )
    )
    .flat();
  $: byYearData = group(flatData, (d) => d.year);
  $: xExtent =
    flatData.length > 0 ? extent(flatData, (d) => d.year) : [2015, 2032];
  $: xHalfway = Math.round((xExtent[1] - xExtent[0]) / 2 + xExtent[0]);
  $: yExtent = flatData.length > 0 ? extent(flatData, (d) => d.value) : [0, 50];
  $: x = scaleLinear()
    .domain(xExtent)
    .range([margin.left, width - margin.right]);
  $: xTicks = x.ticks();
  $: y = scaleLinear()
    .domain([yExtent[0] >= 0 ? 0 : yExtent[0], yExtent[1]])
    .nice()
    .range([height - margin.bottom, margin.top]);
  $: yTicks = y.ticks();
  $: yFormat = (val) =>
    calculation === "percentage"
      ? val.toLocaleString(undefined, {
          style: "percent",
          signDisplay: "exceptZero",
          maximumFractionDigits: 2,
        })
      : val.toLocaleString();

  let hoverData;
  let lineChartPosition = [];
  function handleHover(e) {
    const { clientY } = e;
    let hoverYear = Math.round(x.invert(getContainerCoords(this, e)[0]));
    const boundingRect = e.target.getBoundingClientRect();
    const scaling = boundingRect.width / width;
    lineChartPosition = {
      left: boundingRect.left,
      top: boundingRect.top,
      scaling: scaling,
      clientY,
    };
    if (hoverYear < xExtent[0]) {
      hoverYear = xExtent[0];
    } else if (hoverYear > xExtent[1]) {
      hoverYear = xExtent[1];
    }
    hoverData = {
      year: hoverYear,
      values: byYearData.get(hoverYear).sort(function (a, b) {
        return descending(a.value, b.value);
      }),
    };
  }

  function handleMouseLeave() {
    hoverData = undefined;
  }

  function getContainerCoords(node, event) {
    //From d3
    //https://github.com/d3/d3-selection/blob/master/src/point.js

    var svg = node.ownerSVGElement || node;

    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      (point.x = event.clientX), (point.y = event.clientY);
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }

    var rect = node.getBoundingClientRect();
    return [
      event.clientX - rect.left - node.clientLeft,
      event.clientY - rect.top - node.clientTop,
    ];
  }
</script>

<div id="line-chart-div">
  {#if data.length > 0}
    <h1 class="title">
      Projection of Nurse Workforce, {calculation == "percentage"
        ? "Percent Surplus or Shortage"
        : calculation.slice(0, 1).toUpperCase() + calculation.slice(1)}
    </h1>
    <h2 class="subtitle">North Carolina, {xExtent[0]} - {xExtent[1]}</h2>
    <svg id="line-chart-svg" viewBox="0 0 {width} {height}">
      <g class="chart-container">
        <!-- <rect
          width={width - margin.right - x(projectionStartYear - 1)}
          x={x(projectionStartYear - 1)}
          y={margin.top}
          height={height - margin.bottom - margin.top}
          fill="#ececec" />
        <text
          class="is-size-5"
          transform="translate({x(projectionStartYear - 1)},{margin.top - 5})">
          Projected
        </text> -->
        <g
          class="xAxis is-size-6"
          transform="translate(0,{height - margin.bottom})"
        >
          {#each xTicks as tick (tick)}
            <XTick
              position={[x(tick), 0]}
              value={tick}
              duration={transitionDuration}
            />
          {/each}
        </g>
        <g class="yAxis is-size-6" transform="translate({margin.left},0)">
          {#each yTicks as tick (tick)}
            <YTick
              {y}
              value={tick}
              duration={transitionDuration}
              chartWidth={width - margin.right - margin.left}
              format={yFormat}
            />
          {/each}
        </g>
        {#each data as lineElement (lineElement.id)}
          <Line
            areaPath={area(lineElement.values)}
            linePath={line(lineElement.values)}
            color={colorMap.get(lineElement.id)}
            duration={transitionDuration}
          />
        {/each}
        <text
          class="is-size-5"
          transform="translate({margin.left - 70},{height / 1.5}) rotate(270)"
        >
          Nurse FTE or Head Count
        </text>
        <text
          class="is-size-5"
          text-anchor="middle"
          transform="translate({(width - margin.left - margin.right) / 2 +
            margin.left},{height - 10})"
        >
          Year
        </text>
        {#if hoverData && data.length > 0}
          <line
            x1={x(hoverData.year)}
            x2={x(hoverData.year)}
            y1={margin.top}
            y2={height - margin.bottom}
            stroke="#333"
            stroke-width="2"
          />
          {#each hoverData.values as row}
            <g transform="translate({x(hoverData.year)} {y(row.value)})">
              <circle cx="0" cy="0" r="5" stroke="#333" fill="none" />
            </g>
          {/each}
        {/if}
        <rect
          {width}
          {height}
          fill="none"
          on:mousemove={handleHover}
          on:mouseleave={handleMouseLeave}
          style="pointer-events:all;"
        />
      </g>
    </svg>
    {#if hoverData}
      {#if calculation === "percentage"}
        <div
          class="tooltip"
          style="position:fixed; top:{lineChartPosition.clientY}px; left:{hoverData.year <
          xHalfway
            ? lineChartPosition.left +
              lineChartPosition.scaling * x(hoverData.year) +
              8
            : lineChartPosition.left +
              lineChartPosition.scaling * x(hoverData.year) -
              318}px;
      background: rgba(255, 255, 255, 0.9); border-radius:5px;border: 1px
      solid #333333;padding:3px
      3px;z-index:200;font-weight:600;width:310px;pointer-events:none;"
        >
          <DifferenceToolTipTable rows={hoverData.values} />
        </div>
      {:else}
        <div
          style="position:fixed; top:{lineChartPosition.clientY}px; left:{lineChartPosition.left +
            lineChartPosition.scaling * (x(hoverData.year) + 8)}px;
        background: rgba(255, 255, 255, 0.9); border-radius:5px;border: 1px
        solid #333333;padding:3px
        3px;z-index:200;font-weight:600;pointer-events:none;"
        >
          <div class="table-container">
            <table class="table is-narrow">
              <thead>
                <tr>
                  <th>{hoverData.year}</th>
                </tr>
              </thead>
              <tbody>
                {#each hoverData.values as row}
                  <tr>
                    <td style="color:{colorMap.get(row.id)}; text-align:right;">
                      {numberFormat(row.rateOrTotal)(row.value)}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    {/if}
  {:else}
    <div class="notification">Select model options and click "Show".</div>
  {/if}
  <LineChartLegendTable
    on:deleteProjection
    legendData={data.map((d, i) => ({
      params: d.params,
      color: colorMap.get(d.id),
      id: d.id,
    }))}
  />
</div>

<style>
  .xAxis {
    text-anchor: middle;
  }

  .yAxis {
    text-anchor: end;
  }

  text {
    /* has-text-grey-dark */
    fill: hsl(0, 0%, 29%);
  }
</style>
