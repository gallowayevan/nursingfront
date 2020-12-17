<script>
  import {
    group,
    extent,
    ascending,
    least,
    max,
    min,
    permute,
    mean
  } from "d3-array";
  import { scaleSymlog } from "d3-scale";
  import { interpolateBlues, interpolateReds } from "d3-scale-chromatic";
  import options from "./data/options.js";
  import { fontColor, throttle, numberFormat } from "./utilities.js";
  import "array-flat-polyfill";
  import { onMount, onDestroy } from "svelte";
  import TableLegend from "./TableLegend.svelte";

  const settingNamesMap = new Map(
    options.get("setting").options.map(d => [d.value, d.label])
  );
  settingNamesMap.set(9, "Other");

  const numberPerPage = 10;

  export let data;
  export let projectionStartYear;
  export let showTitle = true;
  let leftCoord = 0;

  const frozenWidth = "14em";

  let currentPage = 0;
  //Reset counter when data changes
  $: if (data) {
    currentPage = 0;
  }

  $: params = data.params
    ? data.params.reduce((acc, curr) => {
        acc[curr[0]] = options
          .get(curr[0])
          .options.find(d => d.value == curr[1]).label;
        return acc;
      }, {})
    : {};

  $: calculation = data.params.find(d => d[0] == "calculation")[1];

  $: currentNumberFormat = numberFormat(
    +data.params.find(d => d[0] == "rateOrTotal")[1]
  );

  //change to also take into account calculation

  $: baseYear = 2018; //min(data.values, e => e.year);

  $: grouped = Array.from(group(data.values, d => d.setting))
    .map(function(d) {
      const baseValue = d[1].find(e => e.year == baseYear).value;
      const calculationDifferenceRatio =
        (calculation == "difference") | (calculation == "ratio");
      const valueArray = d[1].map(function(e) {
        const change = calculationDifferenceRatio
          ? e.value
          : e.value / baseValue;
        return Object.assign({ change: change }, e);
      });
      return [
        settingNamesMap.get(d[0]) || d[0],
        valueArray.sort((a, b) => ascending(a.year, b.year))
      ];
    })
    .sort((a, b) => ascending(a[0], b[0]));

  $: flatChangeValues = grouped.flatMap(d => d[1]).map(d => d.change);
  $: maxChange =
    (calculation == "difference") | (calculation == "ratio")
      ? max(flatChangeValues, d => Math.abs(d))
      : Math.max(
          max(flatChangeValues, d => (d == 0 ? 0 : 1 / d)),
          max(flatChangeValues, d => d / 1)
        );

  // $: maxChange = max(flatChangeValues, d => Math.abs(d));
  // $: meanChange = mean(flatChangeValues);
  $: domain =
    calculation == "difference"
      ? [-maxChange, 0, maxChange]
      : [1 / maxChange, 1, maxChange];
  $: colorScale = scaleSymlog()
    .domain(domain)
    .range([-1, 0, 1])
    .interpolate((a, b) =>
      a < 0 ? t => interpolateReds(1 - t) : t => interpolateBlues(t)
    );

  // $: colorScale = scaleLinear().domain(-maxChange);

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

{#if data.values}
  <div id="top-level-table-div">
    {#if showTitle}
      <h1 class="title is-4">{params['type']}s by Setting, North Carolina</h1>
      <h2 class="subtitle is-6">
        {permute(params, [
          ...data.params.filter(d => d[0].includes('Scenario')).map(d => d[0]),
          'location',
          'education',
          'fteOrHeadcount',
          'rateOrTotal',
          'calculation'
        ]).join(', ')}
      </h2>
    {/if}
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
              Setting
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
                title={row[0]}
                style="width:{frozenWidth};left:{leftCoord}px;{index == 0 ? `padding-bottom:5px;` : ''}">
                {row[0]}
              </td>
              {#each row[1] as cell, index}
                <td
                  class="number-cell"
                  style="background-color:{colorScale(cell.change)}; color:{fontColor(colorScale(cell.change))};">
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
