<script>
  import { createEventDispatcher } from "svelte";

  export let yearExtent;
  export let currentYear;

  const dispatch = createEventDispatcher();

  function updateCurrentYear() {
    dispatch("updateCurrentYear", this.value);
  }
</script>

<div>
  <div style="font: 700 0.9rem sans-serif;">Year to Map</div>
  <input
    name="input"
    type="range"
    min={yearExtent[0]}
    max={yearExtent[1]}
    step="1"
    bind:value={currentYear}
    on:input={updateCurrentYear} />
  <output
    name="output"
    style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;">
    {currentYear}
  </output>
  <div style="font-size: 0.85rem; font-style: italic;">
    Year of Selected Projection to Map
  </div>
</div>
