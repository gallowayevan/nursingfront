<script>
  import { ascending, permute } from "d3-array";
  import { geoPath, geoAlbers } from "d3-geo";
  import { color as d3color } from "d3-color";
  import { scaleOrdinal, scaleSequential, scaleDiverging } from "d3-scale";
  import { interpolateRdYlBu, interpolateBlues } from "d3-scale-chromatic";
  import { extent } from "d3-array";
  import RowChart from "./RowChart.svelte";
  import MapTable from "./MapTable.svelte";
  import options from "./data/options.js";
  import { fontColor, strokeColorContrast } from "./utilities.js";

  export let data;
  export let geoJSON;
  export let projectionStartYear;

  let currentYear = 2033;
  const baseYear = 2019;

  let hovered = undefined;
  const hoveredColor = "#898989";

  const locationNamesMap = new Map(
    options.get("location").options.map((d) => [d.value, d.label])
  );

  $: params = data.params
    ? data.params.reduce((acc, curr) => {
        acc[curr[0]] = options
          .get(curr[0])
          .options.find((d) => d.value == curr[1]).label;
        return acc;
      }, {})
    : {};

  $: yearExtent = extent(
    data.values || [{ year: 2019 }, { year: 2032 }],
    (d) => d.year
  );

  $: locationsSet = new Set(data.values.map((d) => d.location));
  $: baseYearOrder = options
    .get("location")
    .options.filter((d) => locationsSet.has(d.value))
    .map((d) => d.value);

  $: currentYearData = new Map(
    data.values
      .filter((d) => d.year == currentYear)
      .map((d) => [
        d.location,
        {
          fill: color(d.value),
          fontFill: fontColor(color(d.value)),
          value: d.value,
          name: locationNamesMap.get(d.location),
        },
      ])
  );

  $: mapYearDataArray = baseYearOrder.map((d) => [d, currentYearData.get(d)]);
  $: mapYearData = new Map(mapYearDataArray);

  $: valueExtentAllTime = extent(data.values || [], (d) => d.value);

  // const metroNonmetroColorScale = scaleOrdinal()
  //   .domain(["700", "701"])
  //   .range(["#1f78b4", "#33a02c"]);

  $: sequentialScale =
    scaleSequential(interpolateBlues).domain(valueExtentAllTime);

  $: divergingScaleAbsoluteMax = Math.max(
    ...valueExtentAllTime.map((d) => Math.abs(d))
  );
  $: divergingScale = scaleDiverging(interpolateRdYlBu).domain([
    -divergingScaleAbsoluteMax,
    0,
    divergingScaleAbsoluteMax,
  ]);

  $: color =
    (calculation === "difference" || calculation === "percentage") &
    (valueExtentAllTime[0] < 0)
      ? divergingScale
      : sequentialScale;

  $: valueFormat = (val) =>
    calculation === "percentage"
      ? val.toLocaleString(undefined, {
          style: "percent",
          signDisplay: "exceptZero",
        })
      : rateOrTotal === 1
      ? val.toLocaleString(undefined, { notation: "compact" })
      : val.toLocaleString();

  $: calculation = data.params.find((d) => d[0] === "calculation")[1];
  $: rateOrTotal = data.params.find((d) => d[0] === "rateOrTotal")[1];

  //Need these to be able to lookup parent geography for each county.
  $: locationCode = data.params.find((d) => d[0] === "locationType")[1];
  const locationTypeTranslateMap = new Map([
    [8, "medicaid"],
    [5, "ahec"],
    [7, "metro"],
  ]);

  $: layerMap = new Map(geoJSON.map((d) => [d.name, d]));

  $: locationTypeTranslate = locationTypeTranslateMap.get(locationCode);

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

  function getCountyStroke(feature, hovered, mapYearData) {
    const parentLocationValue =
      feature.properties[locationTypeTranslate + "_code"];

    const parentFill =
      hovered == +parentLocationValue
        ? hoveredColor
        : mapYearData.has(+parentLocationValue)
        ? mapYearData.get(+parentLocationValue).fill
        : "none";
    return strokeColorContrast(parentFill);
  }

  function handleLocationHover(id) {
    hovered = id;
  }
  function handleLocationLeave() {
    hovered = undefined;
  }
</script>

<div id="simple-map-container">
  {#if data.values}
    <h1 class="title is-4">
      {params["type"]}s by {params["locationType"]}, North Carolina, {currentYear}{currentYear >=
      projectionStartYear
        ? " (Projected)"
        : ""}
    </h1>
    <h2 class="subtitle is-6">
      {permute(params, [
        "calculation",
        "setting",
        "education",
        "fteOrHeadcount",
        "rateOrTotal",
        ...data.params
          .filter((d) => d[0].includes("Scenario"))
          .map((d) => d[0]),
      ]).join(", ")}
    </h2>

    <div class="columns">
      <div class="column is-three-fifths" style="padding: 0px 0px 0px 5px;">
        <RowChart
          {mapYearDataArray}
          {valueExtentAllTime}
          locationType={params["locationType"]}
          rateOrTotal={params["rateOrTotal"]}
          on:locationHover={(e) => handleLocationHover(e.detail)}
          on:locationLeave={handleLocationLeave}
          {hovered}
          {hoveredColor}
          tickFormat={valueFormat}
          {calculation}
        />
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
                      fill={hovered == +feature.properties.id
                        ? hoveredColor
                        : mapYearData.has(+feature.properties.id)
                        ? mapYearData.get(+feature.properties.id).fill
                        : "none"}
                      stroke={layer.name === "county"
                        ? getCountyStroke(feature, hovered, mapYearData)
                        : "none"}
                      style="pointer-events:{mapYearData.has(
                        +feature.properties.id
                      )
                        ? 'all'
                        : 'none'};"
                      d={path(feature)}
                      on:mouseenter={() =>
                        handleLocationHover(+feature.properties.id)}
                      on:mouseleave={handleLocationLeave}
                    >
                      {#if mapYearData.has(+feature.properties.id)}
                        <title>
                          {mapYearData.get(+feature.properties.id).name}: {valueFormat(
                            mapYearData.get(+feature.properties.id).value
                          )}
                        </title>
                      {/if}
                    </path>
                  {/each}
                </g>
              {/each}
              <!-- Overlay of parent layer to get stroke on top -->
              <g class="parent-overlay">
                {#each layerMap.get(locationTypeTranslate).geo.features as feature}
                  <path
                    class="feature"
                    fill="none"
                    stroke-width="2"
                    stroke="#333"
                    d={path(feature)}
                  />
                {/each}
              </g>
            {/if}
          </g>
        </svg>
      </div>
    </div>
    <div class="range">
      <div class="range-title">
        Year of Selected Projection to Map:
        <span class="range-output">
          {currentYear}{currentYear >= projectionStartYear
            ? " (Projected)"
            : ""}
        </span>
      </div>
      <input
        class="slider"
        name="input"
        type="range"
        min={yearExtent[0]}
        max={yearExtent[1]}
        step="1"
        bind:value={currentYear}
      />
      <MapTable
        {data}
        showTitle={false}
        colorScale={color}
        {currentYear}
        {baseYearOrder}
        on:locationHover={(e) => handleLocationHover(e.detail)}
        on:locationLeave={handleLocationLeave}
        {hovered}
        {hoveredColor}
        {valueFormat}
      />
    </div>
  {:else}
    <div class="notification">
      Choose a combination of selections and click "Show" to see a map of the
      model's projections.
    </div>
  {/if}
</div>
