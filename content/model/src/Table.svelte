<script>
  import { group, extent, ascending, least, max, min, permute } from "d3-array";
  import { scaleLog } from "d3-scale";
  import { interpolateBlues, interpolateReds } from "d3-scale-chromatic";
  import selectOptions from "./data/selectOptions.js";
  import { fontColor, throttle } from "./utilities.js";
  import "array-flat-polyfill";
  import { onMount, onDestroy } from "svelte";
  import TableLegend from "./TableLegend.svelte";

  const locationNamesMap = new Map(
    selectOptions.get("location").options.map(d => [d.value, d.label])
  );
  const numberPerPage = 10;

  export let data;
  export let projectionStartYear;
  let leftCoord = 0;

  $: frozenWidth =
    params["locationType"] == "Medicaid Region" ? "13.5em" : "8em";

  let currentPage = 0;
  //Reset counter when data changes
  $: if (data) {
    currentPage = 0;
  }

  //Why do Chrome and Edge appear to add a space after the locationType?
  $: params =
    data.length > 0
      ? data.params.reduce((acc, curr) => {
          acc[curr.name] = curr.display.trim();
          return acc;
        }, {})
      : {};

  $: paramsMap = data.params
    ? new Map(data.params.map(d => [d.name, d]))
    : undefined;

  $: baseYear = min(data, e => e.year);

  $: grouped = Array.from(group(data, d => d.location))
    .map(function(d) {
      const base = least(d[1], e => e.year);
      const valueArray = d[1].map(function(e) {
        const change = e.mean / base.mean || 0;
        return Object.assign({ change: change }, e);
      });
      return [
        locationNamesMap.get(d[0]) || d[0],
        valueArray.sort((a, b) => ascending(a.year, b.year))
      ];
    })
    .sort((a, b) => ascending(a[0], b[0]));

  $: flatChangeValues = grouped.flatMap(d => d[1]).map(d => d.change);
  $: maxChange = Math.max(
    max(flatChangeValues, d => 1 / d),
    max(flatChangeValues, d => d / 1)
  );

  $: colorScale = scaleLog()
    .domain([1 / maxChange, 1, maxChange])
    .range([-1, 0, 1])
    .interpolate((a, b) =>
      a < 0 ? t => interpolateReds(1 - t) : t => interpolateBlues(t)
    );

  $: numOfPages = Math.ceil(grouped.length / numberPerPage);
  $: paged = group(grouped, (d, i) => Math.floor(i / numberPerPage));
  $: currentRows = paged.get(currentPage);

  function jumpToPage(e) {
    currentPage = +e.target.innerText - 1;
  }

  function calculatePosition() {
    const { left: containerLeft } = document
      .getElementById("main-container")
      .getBoundingClientRect();
    const { left: tableLeft } = document
      .getElementById("top-level-table-div")
      .getBoundingClientRect();

    leftCoord = tableLeft - containerLeft;
  }

  onMount(() => {
    calculatePosition();
    window.onresize = throttle(calculatePosition, 100);
  });

  onDestroy(() => {
    window.onresize = null;
  });
</script>

<style>
  #wrapper {
    overflow-x: scroll;
    /* margin-left: 10em; */
    overflow-y: visible;
    padding: 0;
  }

  .frozen {
    white-space: nowrap;
    position: absolute;
    /* width: 10em; */
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .projection {
    border-top: 3px;
    border-top-color: #6c7480;
    border-top-style: solid;
  }

  .projection-header {
    border-bottom-style: none;
    font-size: 0.6em;
  }

  .number-cell {
    text-align: right;
  }
</style>

{#if data.length > 0}
  <div id="top-level-table-div">
    <h1 class="title is-4">
      {params['type']}s by {params['locationType'].trim()}, North Carolina
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

    <TableLegend {baseYear} />

    <div
      class="table-container"
      id="wrapper"
      style="margin-left:{frozenWidth};">
      <table class="table is-narrow">
        <thead>
          <tr>
            <th
              class=" frozen projection-header"
              style="width:{frozenWidth};" />
            {#each grouped[0][1] as year}
              <th class="projection-header" style="padding:0;">
                {year.year == projectionStartYear ? 'Projected' : ''}
              </th>
            {/each}
          </tr>
          <tr>
            <th
              class="frozen"
              style="left:{leftCoord}px;padding-bottom:5px;width:{frozenWidth};">
              {paramsMap.get('locationType').display}
            </th>
            {#each grouped[0][1] as year}
              <th class:projection={year.year >= projectionStartYear}>
                {year.year}
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each currentRows as row, index}
            <tr>
              <!-- This padding adjustment (along with the one in the thead) are to correct for some mysterious
            misalignment of the borders for the first two elements in the first column. -->
              <td
                class="frozen"
                style="width:{frozenWidth};left:{leftCoord}px;{index == 0 ? `padding-bottom:5px;` : ''}">
                {row[0]}
              </td>
              {#each row[1] as cell, index}
                <td
                  class="number-cell"
                  style="background-color:{index == 0 ? '#ffffff' : colorScale(cell.change)};
                  color:{fontColor(colorScale(cell.change))};">
                  {cell.display}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {#if numOfPages > 1}
      <nav class="pagination" role="navigation" aria-label="pagination">
        <ul class="pagination-list">
          {#each Array.from({ length: numOfPages }, (_, i) => i + 1) as pageNum}
            <li>
              <button
                class="pagination-link {currentPage + 1 == pageNum ? 'is-current' : ''}"
                on:click={jumpToPage}
                aria-label="Goto page {pageNum}">
                {pageNum}
              </button>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
  </div>
{:else}
  <div class="notification">
    Choose a combination of selections and click "Show" to see a table of the
    model's projections.
  </div>
{/if}
