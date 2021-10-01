<script>
  import { tick } from "svelte";
  import { fade } from "svelte/transition";
  export let title = "Title";
  export let info = "Information";
  export let invert = false;
  let active = false;

  //santize titles for use as html ids:
  //https://stackoverflow.com/questions/9635625/javascript-regex-to-remove-illegal-characters-from-dom-id/9635698
  const id = `${title
    .toLowerCase()
    .replace(/^[^a-z]+|[^\w:.-]+/gi, "-")}-info-box`;

  function windowClicked(e) {
    const classList = Array.from(e.target.classList);
    if (!classList.includes("close-on-window-click") & active) {
      active = false;
    }
  }

  function onKeyDownClose(e) {
    if (e.key === "Escape") active = false;
  }

  async function onKeyDown(e) {
    if (e.key === "Enter") {
      active = true;
      await tick();
      document.getElementById(id).focus();
    }
    if (e.key === "Escape") active = false;
  }

  async function handleIconClick() {
    active = true;
    await tick();
    document.getElementById(id).focus(); //Does not seem to do anything?
  }
</script>

<svelte:window on:click|stopPropagation={windowClicked} />
<div class="info-icon-wrapper ">
  <svg
    tabindex="0"
    class="icon-svg has-fill-primary"
    on:click|stopPropagation={handleIconClick}
    on:keydown|stopPropagation={onKeyDown}
  >
    <use xlink:href="#fa-info-circle" class:has-fill-white={invert} />
  </svg>
  {#if active}
    <article
      {id}
      on:keydown={onKeyDownClose}
      class="message is-small is-primary close-on-window-click"
      tabindex="0"
      transition:fade
    >
      <div class="message-header close-on-window-click">
        <p>{title}</p>
        <button
          class="delete"
          aria-label="close"
          on:click|stopPropagation|preventDefault={() => (active = false)}
          on:keydown|stopPropagation={(e) => {
            if (e.key === "Enter") active = false;
          }}
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

  article:focus {
    outline-width: 2px;
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
