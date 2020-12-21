<script>
  export let dashArray = "";
  export let strokeWidth;
  export let transform;
</script>

<style>
  text {
    /* has-text-grey-dark */
    fill: hsl(0, 0%, 29%);
  }
</style>

<g {transform}>
  <g>
    <text class="is-size-5">Supply</text>
    <line
      x1="-75"
      stroke-width={strokeWidth}
      x2="-5"
      y1="-7"
      y2="-7"
      stroke="black" />
  </g>
  <g transform="translate(150)">
    <text class="is-size-5">Demand</text>
    <line
      x1="-75"
      stroke-dasharray={dashArray}
      stroke-width={strokeWidth}
      x2="-5"
      y1="-7"
      y2="-7"
      stroke="black" />
  </g>
</g>
