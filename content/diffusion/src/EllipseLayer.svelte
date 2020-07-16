<script>
  import { onMount, onDestroy, getContext } from "svelte";
  import { mapbox, key } from "./mapbox.js";

  const { getMap } = getContext(key);
  const map = getMap();

  const opacity = 0.5;

  export let layerID;
  export let fill = "#333";

  let layer;

  $: if (layer) {
    map.addSource(layerID + "ellipse", {
      type: "geojson",
      data: layer
    });
    map.addLayer(
      {
        id: layerID + "ellipse",
        type: "fill",
        source: layerID + "ellipse",
        layout: {},
        paint: {
          "fill-color": fill,
          "fill-opacity": 0.5
        }
      },
      "waterway-label"
    );
  }

  onMount(async () => {
    const resp = await fetch(`build/ellipses_14/${layerID}.json`);
    layer = await resp.json();
  });

  onDestroy(() => {
    map.removeLayer(layerID + "ellipse");
    map.removeSource(layerID + "ellipse");
  });
</script>
