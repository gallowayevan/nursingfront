<script>
  import { fade } from "svelte/transition";
  export let title = "Title";
  export let info = "Information";
  export let invert = false;
  let active = false;

  function windowClicked(e) {
    const classList = Array.from(e.target.classList);
    if (!classList.includes("close-on-window-click") & active) {
      active = false;
    }
  }

  function onKeyDown(e) {
    if (e.keyCode === 13) active = true;
    if (e.keyCode === 27) active = false;
  }
</script>

<svelte:window
  on:click|stopPropagation={windowClicked}
  on:keydown|stopPropagation={onKeyDown}
/>
<div class="info-icon-wrapper ">
  <svg
    tabindex="0"
    class="icon-svg has-fill-primary"
    on:click|stopPropagation={() => (active = true)}
    on:keydown|stopPropagation={onKeyDown}
  >
    <use xlink:href="#fa-info-circle" class:has-fill-white={invert} />
  </svg>
  {#if active}
    <article
      class="message is-small is-primary close-on-window-click"
      transition:fade
    >
      <div class="message-header close-on-window-click">
        <p>{title}</p>
        <button
          class="delete"
          aria-label="delete"
          on:click|preventDefault|stopPropagation={() => (active = false)}
        />
      </div>
      <div class="message-body close-on-window-click">{info}</div>
    </article>
  {/if}
</div>

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

  .has-fill-white {
    fill: #ffffff;
  }

  .message {
    box-shadow: 0 0 11px rgba(51, 51, 51, 0.7);
    z-index: 100;
  }
</style>
