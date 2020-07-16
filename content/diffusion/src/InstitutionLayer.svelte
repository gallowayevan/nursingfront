<script>
  import { onMount, onDestroy, getContext } from "svelte";
  import { mapbox, key } from "./mapbox.js";

  const { getMap } = getContext(key);
  const map = getMap();

  export let data;
  export let color;
  export let settingDisplay;

  const settingCounts = Object.keys(data)
    .filter(d => d.startsWith("setting"))
    .map(d => [settingDisplay.get(+d.slice(7)), data[d]]);

  const popup = new mapbox.Popup().setHTML(
    `<h1 class="is-size-6">${data.InstitutionName}</h1><ul>${settingCounts
      .map(d => `<li class="is-size-7">${d[0]}: ${d[1]}</li>`)
      .join("")}</ul>`
  );

  const marker = new mapbox.Marker({ color })
    .setLngLat([data.program_x, data.program_y])
    .setPopup(popup)
    .addTo(map);

  onDestroy(() => {
    marker.remove();
  });
</script>
