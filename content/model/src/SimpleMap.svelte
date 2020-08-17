<script>
  import { permute } from "d3-array";
  import { geoPath, geoAlbers } from "d3-geo";
  import { scaleOrdinal } from "d3-scale";
  import { max, extent } from "d3-array";
  import RowChart from "./RowChart.svelte";
  import options from "./data/options.js";
  import { fontColor } from "./utilities.js";
  import { interpolateHcl, quantize } from "d3-interpolate";

  // import { interpolatePurples as colorSchemeInterpolator } from "d3-scale-chromatic";

  export let data;
  export let geoJSON;
  export let projectionStartYear;

  let currentYear = 2018;
  const baseYear = projectionStartYear - 1;

  let hovered = undefined;
  const hoveredColor = "#898989";

  const locationNamesMap = new Map(
    options.get("location").options.map(d => [d.value, d.label])
  );

  $: params =
    data.length > 0
      ? data.params.reduce((acc, curr) => {
          acc[curr.name] = curr.display.trim();
          return acc;
        }, {})
      : {};

  $: yearExtent = extent(data || [{ year: 2015 }, { year: 2032 }], d => d.year);

  $: baseYearOrder = data
    .filter(d => d.year == baseYear)
    .sort((a, b) => a.mean - b.mean)
    .map(d => d.location);

  $: currentYearOrder = data
    .filter(d => d.year == currentYear)
    .sort((a, b) => a.mean - b.mean)
    .map(d => d.location);

  $: currentYearData = new Map(
    data
      .filter(d => d.year == currentYear)
      .map(d => [
        d.location,
        {
          fill: color(d.location),
          fontFill: fontColor(color(d.mean)),
          value: d.mean,
          display: d.display,
          name: locationNamesMap.get(d.location)
        }
      ])
  );

  $: mapYearData = new Map(baseYearOrder.map(d => [d, currentYearData.get(d)]));

  $: valueExtentAllTime = [0, max(data || [], d => d.mean)];

  $: colorScheme = quantize(
    interpolateHcl("#e0f3db", "#084081"),
    baseYearOrder.length
  );

  const metroNonmetroColorScale = scaleOrdinal()
    .domain(["700", "701"])
    .range(["#1f78b4", "#33a02c"]);

  $: color =
    params["locationType"] == "Metro/Nonmetro"
      ? metroNonmetroColorScale
      : scaleOrdinal()
          .domain(currentYearOrder)
          .range(colorScheme);

  const width = 320;
  const height = 160;
  let path;
  let projection;

  $: if (geoJSON) {
    projection = geoAlbers()
      .rotate([0, 62, 0])
      .fitSize([width, height], geoJSON[0].geo);

    path = geoPath(projection);
  }

  function handleLocationHover(id) {
    hovered = id;
  }
  function handleLocationLeave() {
    hovered = undefined;
  }
</script>

<div id="simple-map-container">
  {#if data.length > 0}
    <h1 class="title is-4">
      {params['type']}s by {params['locationType']}, North Carolina, {currentYear}{currentYear >= projectionStartYear ? ' (Projected)' : ''}
    </h1>
    <h2 class="subtitle is-6">
      {permute(params, [
        'scenario',
        'setting',
        'education',
        'fteOrHeadcount',
        'rateOrTotal',
        'calculation'
      ]).join(', ')}
    </h2>

    <div class="columns">
      <div class="column is-three-fifths" style="padding: 0px 0px 0px 5px;">
        <RowChart
          {mapYearData}
          {valueExtentAllTime}
          locationType={params['locationType']}
          rateOrTotal={params['rateOrTotal']}
          on:locationHover={e => handleLocationHover(e.detail)}
          on:locationLeave={handleLocationLeave}
          {hovered}
          {hoveredColor} />
      </div>
      <div class="column is-two-fifths" style="padding: 0px 5px 0px 0px;">
        <svg viewBox="0 0 {width} {height}" id="map-svg">
          <g>
            {#if geoJSON && path}
              {#each geoJSON as layer}
                <g class={layer.name}>
                  {#each layer.geo.features as feature}
                    <path
                      class="feature"
                      fill={hovered == +feature.properties.id ? hoveredColor : mapYearData.has(+feature.properties.id) ? mapYearData.get(+feature.properties.id).fill : 'none'}
                      stroke-width={layer.name == 'county' ? 1 : mapYearData.has(+feature.properties.id) ? 2 : 0}
                      stroke="#333"
                      style="pointer-events:{mapYearData.has(+feature.properties.id) ? 'all' : 'none'};"
                      d={path(feature)}
                      on:mouseenter={() => handleLocationHover(+feature.properties.id)}
                      on:mouseleave={handleLocationLeave}>

                      {#if mapYearData.has(+feature.properties.id)}
                        <title>
                          {mapYearData.get(+feature.properties.id).name}: {mapYearData.get(+feature.properties.id).display}
                        </title>
                      {/if}
                    </path>
                  {/each}
                </g>
              {/each}
            {/if}
          </g>
        </svg>
      </div>

    </div>
    <div class="range">
      <div class="range-title">
        Year of Selected Projection to Map:
        <span class="range-output">
          {currentYear}{currentYear >= projectionStartYear ? ' (Projected)' : ''}
        </span>
      </div>
      <input
        class="slider"
        name="input"
        type="range"
        min={yearExtent[0]}
        max={yearExtent[1]}
        step="1"
        bind:value={currentYear} />
    </div>
  {:else}
    <div class="notification">
      Choose a combination of selections and click "Show" to see a map of the
      model's projections.
    </div>
  {/if}
</div>
