<script>
  import { createEventDispatcher } from "svelte";
  import InfoBox from "./InfoBox.svelte";

  const dispatch = createEventDispatcher();

  export let calculation;
  export let name;
  export let title;
  export let info;

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
    <p class="is-size-3">{title}</p>
    <p class="is-size-4">
      <slot name="subtitle">Subtitle</slot>
    </p>
  </div>
  <div class="is-pulled-right">
    <InfoBox {title} {info} invert={active} />
  </div>
</div>
