<script>
  import { onMount, setContext } from "svelte";
  import { mapbox, key } from "./mapbox.js";

  setContext(key, {
    getMap: () => map
  });

  export let settings;

  let container;
  let map;

  onMount(() => {
    const mapSettings = Object.assign(
      {
        container,
        style: "mapbox://styles/mapbox/streets-v10"
      },
      settings
    );
    map = new mapbox.Map(mapSettings);

    map.addControl(new mapbox.NavigationControl({ showCompass: false }));

    class ResetZoomControl {
      onAdd(map) {
        this.map = map;
        this.container = document.createElement("div");
        this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        this.button = document.createElement("button");
        this.button.textContent = "Reset Zoom";
        this.button.style.width = "45px";
        this.button.style.height = "45px";
        this.container.appendChild(this.button);
        this.button.addEventListener("click", function() {
          map.flyTo({ center: mapSettings.center, zoom: mapSettings.zoom });
        });

        return this.container;
      }
      onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
      }
    }

    map.addControl(new ResetZoomControl());

    // map.on("zoom", () => console.log(map.getZoom()));

    return () => {
      map.remove();
    };
  });
</script>

<div bind:this={container} style="height:400px;">
  {#if map}
    <slot />
  {/if}
</div>
