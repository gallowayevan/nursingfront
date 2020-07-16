<script>
  import { permute } from "d3-array";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let params;

  function handleDeleteProjection(e) {
    dispatch("deleteProjection", e.target.id);
  }
</script>

<div class="columns is-multiline is-mobile">
  {#each params as param}
    <div
      class="column is-half-mobile is-one-quarter-desktop is-one-third-tablet"
      in:fade>
      <div class="message is-size-7 is-marginless">
        <div class="message-header" style="background-color: {param.color};">
          <button
            class="delete is-pulled-right"
            id={param.id}
            aria-label="delete"
            on:click={handleDeleteProjection} />
        </div>
        <div class="message-body">
          <ul>
            {#each permute(
              param.params.reduce((acc, curr) => {
                acc[curr.name] = curr.display;
                return acc;
              }, {}),
              [
                'type',
                'location',
                'scenario',
                'setting',
                'education',
                'fteOrHeadcount',
                'rateOrTotal'
              ]
            ) as item}
              <li>{item}</li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  {/each}
</div>
