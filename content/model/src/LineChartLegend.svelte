<script>
  import { permute } from "d3-array";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import options from "./data/options.js";

  const dispatch = createEventDispatcher();

  export let legendData;

  function handleDeleteProjection(e) {
    dispatch("deleteProjection", e.target.id);
  }
</script>

<div class="columns is-multiline is-mobile">
  {#each legendData as legendItem}
    <div
      class="column is-half-mobile is-one-quarter-desktop is-one-third-tablet"
      in:fade>
      <div class="message is-size-7 is-marginless">
        <div
          class="message-header"
          style="background-color: {legendItem.color};">
          <button
            class="delete is-pulled-right"
            id={legendItem.id}
            aria-label="delete"
            on:click={handleDeleteProjection} />
        </div>
        <div class="message-body">
          <ul>
            <!-- The permute and reduce part is to create an object of parameters that
            permute can use to order the elements for printing in the legend.
            The filter/map bit is to pull out whatever scenario paramaters are available, i.e., demandScenario and/or supplyScenario. 
            The array tells permute the order of the elements -->
            {#each permute(
              legendItem.params.reduce((acc, curr) => {
                acc[curr[0]] = options
                  .get(curr[0])
                  .options.find(d => d.value == curr[1]).label;
                return acc;
              }, {}),
              [
                'type',
                'education',
                'rateOrTotal',
                'fteOrHeadcount',
                'calculation',
                'location',
                'setting',
                ...legendItem.params
                  .filter(d => d[0].includes('Scenario'))
                  .map(d => d[0])
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
