<script>
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  export let duration;
  export let position;
  export let value;

  const options = {
    duration,
    easing: cubicInOut
  };

  const lineStore = tweened(undefined, options);

  $: lineStore.set(position);
</script>

<g class="tick" transform="translate({$lineStore})">
  <line y2="6" />
  <text y="9" dy=".9em">{value}</text>
</g>
