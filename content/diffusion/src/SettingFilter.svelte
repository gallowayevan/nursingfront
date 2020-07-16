<script>
  export let showHospitalSetting;
</script>

<div
  class="field box"
  style=" position: absolute; top: 5px; left: 5px; opacity: 0.9;width:220px;">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox" bind:checked={showHospitalSetting} />
      Show only nurses working in a hospital.
    </label>
  </div>
</div>
