<script>
  import { permute, rollup, group } from "d3-array";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import options from "./data/options.js";
  import { flat } from "./utilities.js";

  const dispatch = createEventDispatcher();

  export let legendData;

  $: columnOrder = [
    "type",
    "education",
    "rateOrTotal",
    "fteOrHeadcount",
    "location",
    "setting",
    ...legendData[0].params
      .filter((d) => d[0].includes("Scenario"))
      .map((d) => d[0]),
  ];

  $: rows = legendData.map((d) =>
    Object.assign({ paramsMap: new Map(d.params) }, d)
  );

  //Determine which parameters differ between projections
  //Allows highlighting of parameters that differ.
  //1. Get flat list of parameters to group
  //2. Use a Set to deduplicates values, so if size of Set is > 1
  //then there are different values for that parameter
  $: parametersDifferent = rollup(
    legendData.map((d) => d.params).flat(),
    (v) => new Set(v.map((e) => e[1])).size > 1,
    (d) => d[0]
  );

  function handleDeleteProjection(e) {
    dispatch("deleteProjection", e.target.getAttribute("data-id"));
  }
</script>

<div class="table-container">
  <table class="table is-narrow" id="line-chart-table">
    <thead>
      <tr>
        <th />
        {#each columnOrder as column}
          <th>{options.get(column).label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          <td style="background-color: {row.color}; vertical-align: middle;">
            <button
              class="delete"
              data-id={row.id}
              aria-label="delete"
              on:click={handleDeleteProjection}
            />
          </td>
          {#each columnOrder as column}
            <td
              class:has-text-weight-bold={parametersDifferent.get(column)}
              class:has-text-black-bis={parametersDifferent.get(column)}
            >
              {options.get(column).optionsMap.get(row.paramsMap.get(column))}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
