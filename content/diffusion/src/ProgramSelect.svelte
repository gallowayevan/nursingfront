<script>
  import { createEventDispatcher } from "svelte";
  import { group } from "d3-array";
  import { fontColor } from "./utilities.js";

  const dispatch = createEventDispatcher();

  export let options = [];
  export let educationTypesDisplay;

  const optionsMap = group(options, d => d.type);

  let currentType = "RN-ADN";

  function handleSelectProgram() {
    dispatch(
      "programClicked",
      document.getElementById("institution-select").value
    );
  }
</script>

<form on:submit|preventDefault={handleSelectProgram}>
  <div class="field">
    <label class="label">Select a nurse education program type</label>
    <div class="control">
      <div class="select">
        <select bind:value={currentType}>
          {#each Array.from(educationTypesDisplay) as type}
            <option value={type[0]}>{type[1]}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
  <div class="field">
    <label class="label">and then select an institution.</label>
    <div class="control">
      <div class="select">
        <select id="institution-select">
          {#each Array.from(optionsMap.get(currentType)) as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
  <div class="field is-grouped">
    <div class="control">
      <button class="button is-primary" type="submit">Add</button>
    </div>
    <div class="control">
      <button
        class="button is-light"
        on:click|preventDefault={() => dispatch('clearProgramSelections')}>
        Clear All
      </button>
    </div>
  </div>
</form>
