<script>
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { interpolateString } from "d3-interpolate";
  import { fade } from "svelte/transition";

  export let color;
  export let linePath;
  export let areaPath;
  export let areaOpacity = 0.7;
  export let duration;
  export let dashArray = "";
  export let strokeWidth = 2;

  const options = {
    duration: duration,
    easing: cubicInOut,
    interpolate: interpolateString,
  };

  const lineStore = tweened(undefined, options);
  const areaStore = tweened(undefined, options);

  $: lineStore.set(linePath);
  $: areaStore.set(areaPath);
</script>

<g>
  <path
    class="lines"
    fill="none"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-dasharray={dashArray}
    d={$lineStore}
  />

  <path class="areas" fill={color} opacity={areaOpacity} d={$areaStore} />
</g>
