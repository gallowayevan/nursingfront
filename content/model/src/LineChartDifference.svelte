<script>
  import Line from "./Line.svelte";
  import LineChartLegendTable from "./LineChartLegendTable.svelte";
  import { scaleLinear } from "d3-scale";
  import { extent, max, group, descending, mean } from "d3-array";
  import { line as d3line, area as d3area, curveMonotoneX } from "d3-shape";
  import XTick from "./XTick.svelte";
  import YTick from "./YTick.svelte";
  import { fade } from "svelte/transition";
  import "array-flat-polyfill";
  import DifferenceToolTipTable from "./DifferenceToolTipTable.svelte";
  import LineLegend from "./LineLegend.svelte";

  export let data;
  export let projectionStartYear;

  const width = 800;
  const height = 475;
  const margin = { top: 30, right: 60, bottom: 65, left: 90 };
  const colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf"
  ];

  let colorMap = new Map();

  //Could this be cleaner?
  $: {
    //Remove unused colors
    colorMap.forEach(function(value, key) {
      if (!data.map(d => d.id).includes(+key)) {
        colorMap.delete(key);
      }
    });

    //Assign color to new data
    data.forEach(function(d) {
      if (!colorMap.has(d.id)) {
        const availableColors = colors.filter(
          d => !Array.from(colorMap.values()).includes(d)
        );
        colorMap.set(d.id, availableColors[0]);
      }
    });
  }

  //Setting for actual line elements
  const transitionDuration = 400;
  const dashArray = "4";
  const strokeWidth = 2;
  const curve = curveMonotoneX;

  //Shape generators
  $: line = d3line()
    .curve(curve)
    .defined(d => !isNaN(d.value))
    .x(d => x(d.year))
    .y(d => y(d.value));

  $: aboveClip = d3area()
    .x(d => x(d.year))
    .y0(0)
    .y1(d => y(d.value))
    .curve(curve);

  $: belowClip = d3area()
    .x(d => x(d.year))
    .y0(height)
    .y1(d => y(d.value))
    .curve(curve);

  $: aboveArea = d3area()
    .curve(curve)
    .x(d => x(d.year))
    .y0(d => y(d.min))
    .y1(d => y(d.value));

  $: belowArea = d3area()
    .curve(curve)
    .x(d => x(d.year))
    .y0(d => y(d.max))
    .y1(d => y(d.value));

  //clipAbove and clipBelow generators
  //Then use clip component to create clipPaths and
  //https://observablehq.com/@d3/difference-chart

  $: flatData = data
    .map(d =>
      d.values.map(e =>
        Object.assign(
          {
            id: d.id,
            rateOrTotal: d.params.find(d => d[0] == "rateOrTotal")[1],
            color: colorMap.get(d.id)
          },
          e
        )
      )
    )
    .flat();
  $: byYearData = group(flatData, d => d.year);
  $: xExtent =
    flatData.length > 0 ? extent(flatData, d => d.year) : [2015, 2032];
  $: xHalfway = Math.round((xExtent[1] + xExtent[0]) / 2);
  $: yMax =
    flatData.length > 0
      ? max(flatData.flatMap(d => [d.supplyMean, d.demandMean]))
      : 50;
  $: x = scaleLinear()
    .domain(xExtent)
    .range([margin.left, width - margin.right]);
  $: xTicks = x.ticks();
  $: y = scaleLinear()
    .domain([0, yMax])
    .nice()
    .range([height - margin.bottom, margin.top]);
  $: yTicks = y.ticks();

  let lineChartPosition = [];
  let hoverData;
  function handleHover(e) {
    const { clientY } = e;
    let hoverYear = Math.round(x.invert(getContainerCoords(this, e)[0]));
    const boundingRect = e.target.getBoundingClientRect();
    const scaling = boundingRect.width / width;
    lineChartPosition = {
      left: boundingRect.left,
      right: boundingRect.right,
      top: boundingRect.top,
      scaling: scaling,
      clientY
    };
    if (hoverYear < xExtent[0]) {
      hoverYear = xExtent[0];
    } else if (hoverYear > xExtent[1]) {
      hoverYear = xExtent[1];
    }
    hoverData = {
      year: hoverYear,
      values: byYearData.get(hoverYear).sort(function(a, b) {
        return descending(
          mean([a.supplyMean, a.demandMean]),
          mean([b.supplyMean, b.demandMean])
        );
      })
    };
  }

  function handleMouseLeave() {
    hoverData = undefined;
  }

  function addExtentToValues(values) {
    const [min, max] = extent(
      values.flatMap(d => [d.supplyMean, d.demandMean])
    );
    return values.map(d => Object.assign({ min, max }, d));
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
      event.clientY - rect.top - node.clientTop
    ];
  }
</script>

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

<div id="line-chart-div">
  {#if data.length > 0}
    <h1 class="title">Projection of Nurse Workforce, Supply - Demand</h1>
    <h2 class="subtitle">North Carolina, {xExtent[0]} - {xExtent[1]}</h2>
    <svg id="line-chart-svg" viewBox="0 0 {width} {height}">
      <defs>
        {#each data as gradient (gradient.id)}
          <linearGradient
            id={'gradientBelow' + gradient.id}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%">
            <stop
              offset="0%"
              stop-color={colorMap.get(gradient.id)}
              stop-opacity="1" />
            <stop offset="100%" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id={'gradientAbove' + gradient.id}
            x1="0%"
            y1="100%"
            x2="0%"
            y2="0%">
            <stop
              offset="0%"
              stop-color={colorMap.get(gradient.id)}
              stop-opacity="1" />
            <stop offset="100%" stop-color="white" stop-opacity="0" />
          </linearGradient>
        {/each}
      </defs>
      {#each data as clip (clip.id)}
        <clipPath id={'above' + clip.id}>
          <path
            d={aboveClip(clip.values.map(({ year, demandMean }) => ({
                year,
                value: demandMean
              })))} />
        </clipPath>
        <clipPath id={'below' + clip.id}>
          <path
            d={belowClip(clip.values.map(({ year, demandMean }) => ({
                year,
                value: demandMean
              })))} />
        </clipPath>
      {/each}
      <g class="chart-container">
        <rect
          width={width - margin.right - x(projectionStartYear - 1)}
          x={x(projectionStartYear - 1)}
          y={margin.top}
          height={height - margin.bottom - margin.top}
          fill="#ececec" />
        <text
          class="is-size-5"
          transform="translate({x(projectionStartYear - 1)},{margin.top - 10})">
          Projected
        </text>
        <LineLegend
          {dashArray}
          {strokeWidth}
          transform="translate({width - 285},{margin.top - 10})" />
        <g
          class="xAxis is-size-6"
          transform="translate(0,{height - margin.bottom})">
          {#each xTicks as tick (tick)}
            <XTick
              position={[x(tick), 0]}
              value={tick}
              duration={transitionDuration} />
          {/each}
        </g>
        <g class="yAxis is-size-6" transform="translate({margin.left},0)">
          {#each yTicks as tick (tick)}
            <YTick
              {y}
              value={tick}
              duration={transitionDuration}
              chartWidth={width - margin.right - margin.left} />
          {/each}
        </g>
        {#each data as lineElement (lineElement.id)}
          <Line
            linePath={line(lineElement.values.map(({ year, supplyMean }) => ({
                year,
                value: supplyMean
              })))}
            color={colorMap.get(lineElement.id)}
            duration={transitionDuration}
            {strokeWidth} />
          <Line
            linePath={line(lineElement.values.map(({ year, demandMean }) => ({
                year,
                value: demandMean
              })))}
            {dashArray}
            color={colorMap.get(lineElement.id)}
            duration={transitionDuration}
            {strokeWidth} />

          <path
            clip-path={`url(#above${lineElement.id})`}
            fill={`url(#gradientBelow${lineElement.id})`}
            d={aboveArea(addExtentToValues(lineElement.values).map(
                ({ year, supplyMean, min, max }) => ({
                  year,
                  value: supplyMean,
                  min,
                  max
                })
              ))} />
          <path
            clip-path={`url(#below${lineElement.id})`}
            fill={`url(#gradientAbove${lineElement.id})`}
            d={belowArea(addExtentToValues(lineElement.values).map(
                ({ year, supplyMean, min, max }) => ({
                  year,
                  value: supplyMean,
                  min,
                  max
                })
              ))} />
          <!-- <path clip-path={`url(#below${lineElement.id})`}
            d={aboveClip(lineElement.values.map(({ year, supplyMean }) => ({
                year,
                value: supplyMean
              })))}
            fill={`url(#gradientAbove${lineElement.id})`} /> -->
          <!-- <path
            d={belowClip(lineElement.values.map(({ year, supplyMean }) => ({
                year,
                value: supplyMean
              })))}
            fill={`url(#gradientBelow${lineElement.id})`} /> -->
        {/each}
        <text
          class="is-size-5"
          transform="translate({margin.left - 70},{height / 1.5}) rotate(270)">
          Nurse FTE or Head Count
        </text>
        <text
          class="is-size-5"
          text-anchor="middle"
          transform="translate({(width - margin.left - margin.right) / 2 + margin.left},{height - 10})">
          Year
        </text>

        {#if hoverData && data.length > 0}
          <line
            x1={x(hoverData.year)}
            x2={x(hoverData.year)}
            y1={margin.top}
            y2={height - margin.bottom}
            stroke="#333"
            stroke-width="2" />
          {#each hoverData.values as row}
            <g transform="translate({x(hoverData.year)} {y(row.demandMean)})">
              <circle cx="0" cy="0" r="5" stroke="#333" fill="none" />
            </g>
            <g transform="translate({x(hoverData.year)} {y(row.supplyMean)})">
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
          style="pointer-events:all;" />
      </g>

    </svg>
    {#if hoverData}
      <div
        class="tooltip"
        style="position:fixed; top:{lineChartPosition.clientY}px; left:{hoverData.year < xHalfway ? lineChartPosition.left + lineChartPosition.scaling * x(hoverData.year) + 8 : lineChartPosition.left + lineChartPosition.scaling * x(hoverData.year) - 268}px;
        background: rgba(255, 255, 255, 0.9); border-radius:5px;border: 1px
        solid #333333;padding:3px
        3px;z-index:200;font-weight:600;width:260px;pointer-events:none;">
        <DifferenceToolTipTable rows={hoverData.values} />
      </div>
    {/if}
  {:else}
    <div class="notification">Select model options and click "Show".</div>
  {/if}
  <LineChartLegendTable
    on:deleteProjection
    legendData={data.map((d, i) => ({
      params: d.params,
      color: colorMap.get(d.id),
      id: d.id
    }))} />
</div>
