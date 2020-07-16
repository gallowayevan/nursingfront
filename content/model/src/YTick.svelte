<script>
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { fly } from "svelte/transition";
  export let duration;
  export let y;
  export let value;
  export let chartWidth;

  const options = {
    duration,
    easing: cubicInOut
  };

  const lineStore = tweened(undefined, options);

  $: lineStore.set([0, y(value)]);

  //   function transitionAxis(node) {
  //       return {
  //           duration,
  //           css: t => {
  //               const eased = cubicInOut(t);

  //               return
  //           }
  //       }
  //   }
</script>

<g class="tick" opacity="1" transform="translate({$lineStore})">
  <line x2={chartWidth} />
  <text x="-5" dy="0.32em">{value.toLocaleString()}</text>
</g>
