<script>
  import {
    group,
    groups,
    extent,
    ascending,
    least,
    max,
    min,
    permute,
    mean
  } from "d3-array";
  import options from "./data/options.js";
  import { fontColor, throttle, numberFormat } from "./utilities.js";
  import "array-flat-polyfill";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const locationNamesMap = new Map(
    options.get("location").options.map(d => [d.value, d.label])
  );
  const numberPerPage = 10;

  export let data;
  export let projectionStartYear;
  export let showTitle = true;
  export let currentYear;
  export let baseYearOrder;
  export let hovered;
  export let hoveredColor;
  export let colorScale = d => "#fff";

  let leftCoord = 0;

  $: frozenWidth =
    params["locationType"] == "Medicaid Region" ? "13.5em" : "8em";

  let currentPage = 0;
  //Reset counter when data changes
  $: if (data) {
    currentPage = 0;
  }

  //Why do Chrome and Edge appear to add a space after the locationType?
  $: params = data.params
    ? data.params.reduce((acc, curr) => {
        acc[curr[0]] = options
          .get(curr[0])
          .options.find(d => d.value == curr[1]).label;
        return acc;
      }, {})
    : {};

  $: paramsMap = data.params
    ? new Map(data.params.map(d => [d.name, d]))
    : undefined;

  $: currentNumberFormat = numberFormat(
    +data.params.find(d => d[0] == "rateOrTotal")[1]
  );

  //Create Map for ordering based on baseYearOrder
  $: groupedMap = group(data.values, d => d.location);

  $: grouped = baseYearOrder
    .map(d => groupedMap.get(d))
    .map(function(d) {
      return [
        locationNamesMap.get(d[0].location),
        d.sort((a, b) => ascending(a.year, b.year))
      ];
    });

  $: calculateBackgroundColor = (index, cell) => {
    return cell.year != currentYear
      ? "#ffffff"
      : hovered == cell.location
      ? hoveredColor
      : colorScale(cell.location);
  };

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

  function handleLocationHover(id) {
    dispatch("locationHover", id);
  }
  function handleLocationLeave(id) {
    dispatch("locationLeave");
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

{#if data.values}
  <div id="top-level-table-div">
    {#if showTitle}
      <h1 class="title is-4">
        {params['type']}s by {params['locationType'].trim()}, North Carolina
      </h1>
      <h2 class="subtitle is-6">
        {permute(params, [
          ...data.params.filter(d => d[0].includes('Scenario')).map(d => d[0]),
          'setting',
          'education',
          'fteOrHeadcount',
          'rateOrTotal',
          'calculation'
        ]).join(', ')}
      </h2>
    {/if}

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
              {params['locationType']}
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
                  style="background-color:{calculateBackgroundColor(index, cell)};
                  color:{fontColor(calculateBackgroundColor(index, cell))};"
                  on:mouseenter={() => handleLocationHover(cell.location)}
                  on:mouseleave={handleLocationLeave}>
                  {currentNumberFormat(cell.value)}
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
