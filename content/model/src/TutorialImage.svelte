<script>
  export let imageFileName;
</script>

<div>
  <slot />
  <img
    class="image"
    alt="Chart tutorial."
    src="public/images/tutorial/{imageFileName}" />
  <hr />
</div>
