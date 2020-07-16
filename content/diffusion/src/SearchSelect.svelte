<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let placeholder = "Search . . .";
  export let options = [];

  let filteredOptions = options;
  let isActive = false;
  let currentItems = [];

  function searched(e) {
    if (e.target.textLength > 1) {
      filteredOptions = options.filter(d =>
        d.label.toUpperCase().includes(e.target.value.toUpperCase())
      );
    } else {
      filteredOptions = options;
    }
  }

  function windowClicked(e) {
    const dropDownClasses = [
      "dropdown",
      "dropdown-trigger",
      "dropdown-input",
      "dropdown-menu",
      "dropdown-content",
      "dropdown-item"
    ];
    const classList = Array.from(e.target.classList);
    if (classList.includes("dropdown-item")) {
      dispatch("programClicked", e.target.getAttribute("data-value"));
    } else if (!classList.some(d => dropDownClasses.includes(d))) {
      isActive = false;
    }
  }
</script>

<svelte:window on:click={windowClicked} />
<div class="field">
  <label class="label">
    <slot>Select an option</slot>
  </label>
  <div class="control">

    <div class="dropdown" class:is-active={isActive}>
      <div class="dropdown-trigger">
        <input
          class="input is-primary dropdown-input"
          type="text"
          on:focus={() => (isActive = true)}
          on:input={searched}
          {placeholder}
          aria-haspopup="true"
          aria-controls="dropdown-menu" />
      </div>
      <div class="dropdown-menu" id="dropdown-menu" role="menu">

        <div
          class="dropdown-content"
          style="max-height: 200px; overflow-y: scroll;">

          {#each filteredOptions as option}
            <!-- svelte-ignore a11y-missing-attribute -->
            <a data-value={option.value} class="dropdown-item">
              {option.label}
            </a>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
