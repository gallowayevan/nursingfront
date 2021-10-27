<script>
  import { onMount, onDestroy, getContext } from "svelte";
  import { mapbox, key } from "./mapbox.js";

  const { getMap } = getContext(key);
  const map = getMap();

  export let layerID;
  export let fill = "#333";
  export let showHospitalSetting;
  let layer;
  let layerLoaded = false;

  $: if (showHospitalSetting & layerLoaded) {
    map.setFilter(layerID, ["==", ["get", "setting_14"], 1]);
  } else if (layerLoaded) {
    map.setFilter(layerID, null);
  }

  onMount(async () => {
    try {
      const resp = await fetch(`build/layers_14/${layerID}.json`);
      layer = await resp.json();

      map.addSource(layerID, {
        type: "geojson",
        data: layer,
      });
      map.addLayer(
        {
          id: layerID,
          type: "circle",
          source: layerID,
          paint: {
            "circle-radius": {
              base: 1.75,
              stops: [
                [12, 5],
                [22, 180],
              ],
            },
            "circle-opacity": 0.7,
            "circle-color": fill,
          },
        },
        "waterway-label"
      );

      layerLoaded = true;
    } catch (error) {
      console.error(error.message);
    }
  });

  onDestroy(() => {
    try {
      map.removeLayer(layerID);
      map.removeSource(layerID);
    } catch (error) {
      console.error(error.message);
    }
  });
</script>
