<script>
  import { createEventDispatcher } from "svelte";
  import { fontColor } from "./utilities.js";

  const dispatch = createEventDispatcher();

  export let options = [];

  function handleDeleteClicked(e) {
    dispatch("programClicked", e.target.getAttribute("data-value"));
  }
</script>

<div class="tags">
  {#each options as option}
    <span
      class="tag"
      style="background-color:{option.fill};color:{fontColor(option.fill)}">
      {option.label}
      <button
        data-value={option.value}
        class="delete is-small"
        on:click={handleDeleteClicked} />
    </span>
  {/each}
</div>
