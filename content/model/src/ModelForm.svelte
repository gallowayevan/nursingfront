<script>
  import SimpleSelect from "./SimpleSelect.svelte";
  import InfoBox from "./InfoBox.svelte";
  import selectOptions from "./data/selectOptions.js";
  import formInfo from "./data/formInfo.js";
  import { group } from "d3-array";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let chartType;

  let nurseType = "2";
  let currentLocationType = 0;
  let educationType = "0";
  let settingType = "0";

  $: locationTypeOptions = {
    name: "locationType",
    label: "Location Type",
    options: selectOptions
      .get("locationType")
      .options.filter(
        e => !(chartType == "map" && (+e.value == 0 || +e.value == 1))
      )
  };

  const locationOptions = new Map(
    Array.from(
      group(
        selectOptions.get("location").options.map(d => ({
          key: d.value > 0 && d.value < 200 ? 1 : Math.floor(+d.value / 100),
          value: d.value,
          label: d.label
        })),
        d => d.key
      )
    ).map(d => [
      d[0],
      {
        name: selectOptions.get("location").name,
        label: selectOptions.get("location").label,
        options: d[1].map(e => ({ label: e.label, value: e.value }))
      }
    ])
  );

  $: currentLocationOptions = locationOptions.get(currentLocationType);

  function handleShowProjection(event) {
    let params = [];

    for (let el of event.target) {
      if (el.name && (el.type == "select-one" || el.checked == true)) {
        //Add education for LPN since this radio does not appear in UI.
        // if (el.name == "type" && el.value == "1") {
        //   params.push({
        //     name: "education",
        //     value: 0,
        //     display: "All Education"
        //   });
        // }

        params.push({
          name: el.name,
          value: el.value,
          display:
            el.type == "select-one"
              ? el.selectedOptions[0].innerText
              : el.parentElement.innerText.trim()
        });
      }
    }
    dispatch("showProjection", params);
  }

  function handleClearData() {
    dispatch("clearData");
  }

  function handleLocationTypeChange(e) {
    // handleClearData();
    currentLocationType = +e.target.value;
  }

  function handleSettingChange(e) {
    settingType = e.target.value;
  }

  function handleLaunchTutorial() {
    dispatch("launchTutorial");
  }
</script>

<form on:submit|preventDefault={handleShowProjection}>
  <div class="field">
    <div class="control">
      <label class="radio">
        <input
          bind:group={nurseType}
          type="radio"
          name="type"
          value="2"
          checked />
        RN
      </label>
      <label class="radio">
        <input bind:group={nurseType} type="radio" name="type" value="1" />
        LPN
      </label>
      <InfoBox name={'Type of Nurse'} info={formInfo.get('type')} />
    </div>
  </div>

  <div class="field">
    <div class="control">
      {#if nurseType == '1' || (nurseType == '2') & (settingType != '0')}
        <label class="radio" disabled>
          <input type="radio" name="education" value="0" checked disabled />
          All Education
        </label>
      {:else}
        <label class="radio">
          <input
            bind:group={educationType}
            type="radio"
            name="education"
            value="0"
            checked />
          All Education
        </label>
        <label class="radio">
          <input
            bind:group={educationType}
            type="radio"
            name="education"
            value="4" />
          BS & MS
        </label>
        <label class="radio">
          <input
            bind:group={educationType}
            type="radio"
            name="education"
            value="5" />
          ADN & Diploma
        </label>
      {/if}
      <InfoBox
        name={'Basic Education Degree for Licensure'}
        info={formInfo.get('education')} />
    </div>
  </div>

  <div class="field">
    <div class="control">
      {#if chartType == 'map'}
        <label class="radio" disabled>
          <input type="radio" name="rateOrTotal" value="0" checked disabled />
          Rate per 10K population
        </label>
      {:else}
        <label class="radio">
          <input type="radio" name="rateOrTotal" value="0" checked />
          Rate per 10k population
        </label>
        <label class="radio">
          <input type="radio" name="rateOrTotal" value="1" />
          Total
        </label>
      {/if}
      <InfoBox
        name={'Rate per 10,000 Population or Total'}
        info={formInfo.get('rateOrTotal')} />
    </div>
  </div>
  <div class="field">
    <div class="control">
      <label class="radio">
        <input type="radio" name="fteOrHeadcount" value="0" checked />
        Headcount
      </label>
      <label class="radio">
        <input type="radio" name="fteOrHeadcount" value="1" />
        FTE
      </label>
      <InfoBox
        name={'Full Time Equivalents (FTE) or Headcount'}
        info={formInfo.get('fteOrHeadcount')} />
    </div>
  </div>
  <SimpleSelect
    on:change={handleLocationTypeChange}
    value={currentLocationType}
    {...locationTypeOptions}>
    <InfoBox name={'Location Type'} info={formInfo.get('locationType')} />
  </SimpleSelect>
  <SimpleSelect display={chartType == 'line'} {...currentLocationOptions}>
    <InfoBox name={'Location'} info={formInfo.get('location')} />
  </SimpleSelect>
  <SimpleSelect
    {...selectOptions.get('setting')}
    disabled={educationType != '0'}
    on:change={handleSettingChange}>
    <InfoBox name={'Setting'} info={formInfo.get('setting')} />
  </SimpleSelect>
  <SimpleSelect {...selectOptions.get('scenario')}>
    <InfoBox name={'Scenario'} info={formInfo.get('scenario')} />
  </SimpleSelect>

  <div class="field is-grouped">
    <div class="control">
      <button class="button is-primary" type="submit">Show</button>
    </div>
    <div class="control">
      <button class="button" type="button" on:click={handleClearData}>
        Clear
      </button>
    </div>
  </div>
  <hr />
  <button
    class="button is-primary is-outlined is-center is-rounded"
    id="btn"
    on:click={handleLaunchTutorial}>
    Launch User Guide
  </button>
</form>
