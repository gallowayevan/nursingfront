<script>
  import { fade } from "svelte/transition";
  export let name = "Name";
  export let info = "Information";
  let active = false;
</script>

<style>
  .info-icon-wrapper {
    display: inline-flex;
  }

  article {
    left: 0px;
    width: 300px;
    position: absolute;
    z-index: 100;
  }

  .icon-svg {
    width: 16px;
    height: 16px;
  }
</style>

<div class="info-icon-wrapper ">
  <svg class="icon-svg has-fill-primary" on:click={() => (active = true)}>
    <use xlink:href="#fa-info-circle" />
  </svg>
  {#if active}
    <article class="message is-small is-primary" transition:fade>
      <div class="message-header">
        <p>{name}</p>
        <button
          class="delete"
          aria-label="delete"
          on:click|preventDefault={() => (active = false)} />
      </div>
      <div class="message-body">{info}</div>
    </article>
  {/if}
</div>
