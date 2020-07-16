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
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource(layerID + "exact", {
      type: "geojson",
      data: layer,
      cluster: true,
      clusterMaxZoom: 14
    });

    map.addLayer(
      {
        id: layerID + "clusters",
        type: "circle",
        source: layerID + "exact",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": fill,
          "circle-opacity": opacity,
          "circle-radius": ["sqrt", ["*", ["get", "point_count"], 32]]
        }
      },
      "waterway-label"
    );

    map.addLayer(
      {
        id: layerID + "cluster-count",
        type: "symbol",
        source: layerID + "exact",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-offset": [
            "case",
            [">", ["get", "point_count"], 50],
            ["literal", [0, 1]],
            ["literal", [0, 0]]
          ]
        }
      },
      "waterway-label"
    );

    map.addLayer(
      {
        id: layerID + "unclustered-point",
        type: "circle",
        source: layerID + "exact",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": fill,
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": fill,
          "circle-opacity": opacity
        }
      },
      "waterway-label"
    );
  }

  onMount(async () => {
    const resp = await fetch(`build/exact/${layerID}.json`);
    layer = await resp.json();
  });

  onDestroy(() => {
    map.removeLayer(layerID + "cluster-count");
    map.removeLayer(layerID + "clusters");
    map.removeLayer(layerID + "unclustered-point");
    map.removeSource(layerID + "exact");
  });
</script>
