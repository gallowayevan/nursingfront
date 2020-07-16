<script>
  import { geoAlbers, geoPath } from "d3-geo";

  export let locations;
  export let geoJSON;

  const width = 300;
  const height = 200;
  let path;

  $: if (geoJSON) {
    const projection = geoAlbers()
      .rotate([0, 62, 0])
      .fitSize([width, height], geoJSON[0].geo);

    path = geoPath(projection);
  }

  $: console.log(locations.get("800"));
</script>

<div class="reference-map">
  <svg viewBox="0 0 {width} {height}">
    <g id="map-container">
      {#if geoJSON && path}
        {#each geoJSON as layer}
          <g class={layer.name}>
            {#each layer.geo.features as feature}
              <path
                class="feature"
                fill={locations.has(feature.properties.id) ? locations.get(feature.properties.id) : 'none'}
                stroke-width={layer.name == 'county' ? 1 : locations.has(feature.properties.id) ? 2 : 0}
                stroke="#333"
                style="opacity:0.7"
                d={path(feature)} />
            {/each}
          </g>
        {/each}
      {/if}
    </g>
  </svg>
</div>
