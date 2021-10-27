<script>
  export let display = true;
  export let name;
  export let label;
  export let options;
  export let value = "";
  export let disabled = false;

  $: id = name.toLowerCase() + "-select";
</script>

{#if display}
  <div class="field">
    <label for={id} class="label" style="display:inline-flex;">{label}</label>
    <slot />
    <div class="control">
      <div class="select ">
        <select {id} on:change {name} {disabled}>
          {#each options as option}
            <option value={option.value} selected={option.value == value}>
              {option.label}
            </option>
          {/each}
        </select>
      </div>
    </div>
  </div>
{/if}
