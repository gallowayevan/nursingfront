<script>
  import { scaleLinear, scaleBand } from "d3-scale";
  import { format } from "d3-format";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let mapYearData;
  export let valueExtentAllTime;
  export let locationType;
  export let hovered;
  export let hoveredColor;
  export let rateOrTotal;

  $: margin = {
    top: 30,
    right: 10,
    bottom: 10,
    left: locationType == "Medicaid Region" ? 155 : 110
  };
  const width = 320;
  $: height = mapYearData.size * 20 + margin.top + margin.bottom;

  $: x = scaleLinear()
    .domain(valueExtentAllTime)
    .range([margin.left, width - margin.right]);

  $: y = scaleBand()
    .domain(Array.from(mapYearData).map(d => d[0]))
    .range([height - margin.bottom, margin.top])
    .paddingInner(0.1);

  const tickFormat = t => t.toLocaleString();

  function handleLocationHover(id) {
    dispatch("locationHover", id);
  }
  function handleLocationLeave(id) {
    dispatch("locationLeave");
  }
</script>

<style>
  .yAxis {
    text-anchor: end;
  }

  .anchor-middle {
    text-anchor: middle;
  }

  svg text {
    font-size: 12px;
    fill: #363636;
  }
</style>

<svg id="row-chart-svg" viewBox="0 0 {width} {height}">
  <g>
    <text
      class="anchor-middle"
      transform="translate({margin.left + (width - margin.left - margin.right) / 2}
      10)">
      {rateOrTotal}
    </text>
    <g>
      {#each Array.from(mapYearData) as bar}
        <g transform="translate({margin.left} {y(bar[0])})">
          <rect
            width={x(bar[1].value) - x(0)}
            height={y.bandwidth()}
            fill={hovered == bar[0] ? hoveredColor : bar[1].fill}
            stroke-width={hovered == bar[0] ? 3 : 0}
            on:mouseenter={() => handleLocationHover(bar[0])}
            on:mouseleave={handleLocationLeave}>
            <title>{bar[1].name}: {bar[1].display}</title>
          </rect>
          <text class="yAxis" dy="1em" dx="-3">{bar[1].name}</text>
        </g>
      {/each}
      <g transform="translate(0 {margin.top})">
        {#each x.ticks(5) as tick}
          <g transform="translate({x(tick)} 0)">
            <line y1="0" y2={height} stroke="#fff" />
            <text class="anchor-middle" dy="-5">{tickFormat(tick)}</text>
          </g>
        {/each}
      </g>
    </g>
  </g>
</svg>
