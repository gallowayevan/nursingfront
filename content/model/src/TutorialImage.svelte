<script>
  export let imageFileName;
</script>

<div class="column is-full">
  <slot />
  <img
    class="image"
    alt="Chart tutorial."
    src="public/images/tutorial/{imageFileName}"
  />
  <hr />
</div>
