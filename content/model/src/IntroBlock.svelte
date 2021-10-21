<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let chartType;
  export let calculation;

  function handleLaunchTutorial() {
    dispatch("launchTutorial");
  }
</script>

<div class="content has-background-light">
  {#if chartType == "line"}
    <h2>You can create a line chart.</h2>
    <p>
      <span class="has-text-weight-semibold">
        If you are using the line chart option,
      </span>
      you can display multiple lines at once to compare. Just change your options
      and select
      <span class="has-text-weight-semibold">Show</span>
      again. To remove a line, hit the
      <span class="has-text-weight-semibold">X</span>
      button in the top left of its corresponding box. Once you have displayed the
      projections* in which you are interested, you can download the image (as a
      .png) or the data (as a .csv file).
    </p>
    {#if calculation === "difference"}
      <img
        class="image"
        alt="How to use the line chart the shows the numerical difference in supply and demand."
        src="public/images/tutorial/supply-demand-instruction.png"
      />
    {:else if calculation === "percentage"}
      <img
        class="image"
        alt="How to use the line chart the shows the percentage difference in supply and demand."
        src="public/images/tutorial/percentage_supply_demand_instruction.png"
      />
    {:else if calculation === "supply"}
      <img
        class="image"
        alt="How to use the line chart the shows supply projections and uncertainty for those projections."
        src="public/images/tutorial/supply_instruction.png"
      />
    {:else if calculation === "demand"}
      <img
        class="image"
        alt="How to use the line chart the shows the demand projections."
        src="public/images/tutorial/demand_instruction.png"
      />
    {/if}
    <hr />
    <p>
      <span class="has-text-weight-semibold">Please note:</span>
      the model won’t allow you to display the projections for specific education
      categories combined with specific settings at the same time. For instance,
      the projection for RN, with BS for education, and hospital for setting is not
      available. This is because the numbers are small.
    </p>
  {:else if chartType == "map"}
    <h2>You can create a map.</h2>
    <p>
      <span class="has-text-weight-semibold">
        You can also view projections as a map.
      </span>
      Use the slider below the map to change the year of data. The row chart displays
      the projected values for the selected year. The colors in the map also indicate
      the projected value. You can see the exact projected values in the table at
      the bottom. Hovering over any chart/map/table elements highlights the same
      geography in the other elements.
    </p>
    <img
      class="image"
      alt="How to use the map."
      src="public/images/tutorial/05_map.png"
    />
  {:else if chartType == "table"}
    <h2>You can create a table.</h2>
    <p>
      <span class="has-text-weight-semibold">
        You can also view projections in a table.
      </span>
      The colors represent the change relative to the baseline (the first year, in
      this case, 2008).
      <span style="color:red;">Red</span>
      indicates a decrease from the baseline.
      <span style="color:blue;">Blue</span>
      indicates an increase from the baseline. The table can be downloaded as a CSV
      file.
    </p>
    <img
      class="image"
      alt="How to use the table."
      src="public/images/tutorial/06_table.png"
    />
  {:else}
    <h2 class="subtitle is-size-5 has-text-grey-dark">
      Select a chart type and projection options, or launch our tutorial to
      learn more!
      <button
        class="button is-primary is-outlined is-center is-rounded"
        id="btn"
        on:click={handleLaunchTutorial}
      >
        Launch User Guide
      </button>
    </h2>
  {/if}
</div>

<style>
  div {
    height: 100%;
    padding: 1rem;
    border-radius: 6px;
  }
</style>
