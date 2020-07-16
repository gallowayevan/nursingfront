<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let chartType;

  function handleLaunchTutorial() {
    dispatch("launchTutorial");
  }
</script>

<style>
  div {
    height: 100%;
    padding: 1rem;
    border-radius: 6px;
  }
</style>

<div class="content has-background-light">

  {#if chartType == 'line'}
    <h2>You can create a line chart.</h2>
    <p>
      <span class="has-text-weight-semibold">
        If you are using the line chart option,
      </span>
      you can display multiple lines at once to compare. Just change your
      options and select
      <span class="is-family-code">Show</span>
      again. To remove a line, hit the
      <span class="is-family-code">X</span>
      button in the top left of its corresponding box. Once you have displayed
      the projections* you are interested in, you can download the image (as a
      PNG) or the data (as a CSV file).
    </p>
    <img
      class="image"
      alt="How to use the line chart."
      src="public/images/tutorial/03_line_chart.png" />
    <hr />
    <p>
      <span class="has-text-weight-semibold">Please note:</span>
      the model won’t allow you to display the projections for specific
      education categories combined with specific settings at the same time. For
      instance, the projection for RN, with BS for education, and hospital for
      setting is not available. This is because the numbers are small.
    </p>
    <p>
      *The projection line does include some historical data, but projections
      are delineated by gray.
    </p>
  {:else if chartType == 'map'}
    <h2>You can create a map.</h2>
    <p>
      <span class="has-text-weight-semibold">
        You can also view projections as a map.
      </span>
      Use the slider below the map to change the year of data. The maps are
      color-coded to indicate the location of each area.
    </p>
    <img
      class="image"
      alt="How to use the map."
      src="public/images/tutorial/05_map.png" />
  {:else if chartType == 'table'}
    <h2>You can create a table.</h2>
    <p>
      <span class="has-text-weight-semibold">
        You can also view projections in a table.
      </span>
      The colors represent the change relative to the baseline (the first year,
      in this case, 2008).
      <span style="color:red;">Red</span>
      indicates a decrease from the baseline.
      <span style="color:blue;">Blue</span>
      indicates an increase from the baseline. The table can be downloaded as a
      CSV file.
    </p>
    <img
      class="image"
      alt="How to use the table."
      src="public/images/tutorial/06_table.png" />
  {:else}
    <h2 class="subtitle is-size-5 has-text-grey-dark">
      Select a chart type and projection options, or launch our tutorial to
      learn more!
      <button
        class="button is-primary is-outlined is-center is-rounded"
        id="btn"
        on:click={handleLaunchTutorial}>
        Launch User Guide
      </button>
    </h2>
  {/if}
</div>
