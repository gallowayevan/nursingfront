<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let calculation;
  export let name;

  $: active = calculation == name;
</script>

<style>
  .card {
    transition: box-shadow 0.3s;
  }

  .card:hover {
    box-shadow: 0 0 11px rgba(70, 93, 128, 0.7);
    z-index: 100;
  }
</style>

<div
  class="card column is-one-quarter"
  class:has-background-primary={active}
  class:has-text-white={active}
  on:click={() => dispatch('clicked', name)}>
  <div class="card-content">
    <p class="is-size-3">
      <slot name="title">Title</slot>
    </p>
    <p class="is-size-4">
      <slot name="subtitle">Subtitle</slot>
    </p>
  </div>
</div>
