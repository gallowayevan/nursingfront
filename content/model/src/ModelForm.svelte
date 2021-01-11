<script>
  import SimpleSelect from "./SimpleSelect.svelte";
  import InfoBox from "./InfoBox.svelte";
  import options from "./data/options.js";
  import formInfo from "./data/formInfo.js";
  import { group } from "d3-array";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let chartType;
  export let calculation;
  export let isLoading;

  //Set default form values
  let nurseType = "2";
  let currentLocationType = 0;
  let educationType = "0";
  let settingType = "0";

  //Track if form is changed
  let formHasChanged = true;

  //Filter out 'state' as an option when chart type is map
  //since state map is not informative (i.e., all one color)
  $: locationTypeOptions = {
    name: "locationType",
    label: "Location Type",
    options: options
      .get("locationType")
      .options.filter(e => !(chartType == "map" && +e.value == 0))
  };

  //Create map with location type as the key and an
  //array of locations (actually location objects) as the value
  //e.g., ahec -> [Wake AHEC, Area L, ...].
  const locationOptions = new Map(
    Array.from(
      group(
        options.get("location").options.map(d => ({
          //Get first digit of location to use as location type key, e.g., 800 -> 8
          key: +d.value.toString().slice(0, 1),
          value: d.value,
          label: d.label
        })),
        d => d.key
      )
    ).map(d => [
      d[0],
      {
        name: options.get("location").name,
        label: options.get("location").label,
        options: d[1].map(e => ({ label: e.label, value: e.value }))
      }
    ])
  );

  //Get current locations based on the location type selection
  $: currentLocationOptions = locationOptions.get(currentLocationType);

  function handleShowProjection(event) {
    let params = [];

    //Loop through form elements and get values for data query
    //Only get values from elements that have a name and are either select elements
    //or checked (as for radio elements).
    for (let el of event.target) {
      if (el.name && (el.type == "select-one" || el.checked == true)) {
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
    //Reset formHasChanged
    formHasChanged = false;

    dispatch("showProjection", params);
  }

  function handleClearData() {
    dispatch("clearProjections");
  }

  function handleLocationTypeChange(e) {
    currentLocationType = +e.target.value;
  }

  function handleSettingChange(e) {
    settingType = e.target.value;
  }

  function handleCalculationChange(e) {
    calculation = e.target.value;
  }

  function handleLaunchTutorial() {
    dispatch("launchTutorial");
  }
</script>

<!-- This form ends up being somewhat complex because there are a number
of patterns to what sort of data can actually be selected. -->
<form
  on:submit|preventDefault={handleShowProjection}
  on:change={() => (formHasChanged = true)}>
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
      <InfoBox title={'Type of Nurse'} info={formInfo.get('type')} />
    </div>
  </div>

  <div class="field">
    <div class="control">
      <!-- If nurse type is LPN or if nurse type is RN and Setting is Hospital, 
    then disallow any education selection except All Education. -->
      {#if nurseType == '1' || (nurseType == '2') & (settingType != '0') || calculation != 'supply' || chartType == 'table'}
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
        title={'Basic Education Degree for Licensure'}
        info={formInfo.get('education')} />
    </div>
  </div>

  <div class="field">
    <div class="control">
      {#if chartType == 'map' || calculation == 'ratio'}
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
        title={'Rate per 10,000 Population or Total'}
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
        title={'Full Time Equivalents (FTE) or Headcount'}
        info={formInfo.get('fteOrHeadcount')} />
    </div>
  </div>
  <!-- <SimpleSelect
    {...options.get('calculation')}
    disabled={educationType != '0'}
    on:change={handleCalculationChange}>
    <InfoBox name={'Calculation'} info={formInfo.get('calculation')} />
  </SimpleSelect> -->
  <SimpleSelect
    on:change={handleLocationTypeChange}
    value={currentLocationType}
    {...locationTypeOptions}>
    <InfoBox title={'Location Type'} info={formInfo.get('locationType')} />
  </SimpleSelect>
  <SimpleSelect
    display={chartType == 'line' || chartType == 'table'}
    {...currentLocationOptions}>
    <InfoBox title={'Location'} info={formInfo.get('location')} />
  </SimpleSelect>
  {#if chartType != 'table'}
    <!-- Filter out nurse education setting for LPNs. This setting was
    deemed potentially confusing.-->
    <SimpleSelect
      options={options
        .get('setting')
        .options.filter(d => nurseType == 2 || d.value != 6)}
      name={options.get('setting').name}
      label={options.get('setting').label}
      disabled={educationType != '0'}
      on:change={handleSettingChange}>
      <InfoBox title={'Setting'} info={formInfo.get('setting')} />
    </SimpleSelect>
  {/if}
  {#if calculation == 'demand' || calculation == 'difference' || calculation == 'ratio'}
    <SimpleSelect {...options.get('demandScenario')}>
      <InfoBox title={'Demand Scenario'} info={formInfo.get('scenario')} />
    </SimpleSelect>
  {/if}
  {#if calculation == 'supply' || calculation == 'difference' || calculation == 'ratio'}
    <SimpleSelect {...options.get('supplyScenario')}>
      <InfoBox title={'Supply Scenario'} info={formInfo.get('scenario')} />
    </SimpleSelect>
  {/if}

  <div class="field is-grouped">
    <div class="control">

      <button class="button" class:is-warning={formHasChanged} type="submit">
        Show
      </button>

    </div>
    <div class="control">
      <button class="button" type="button" on:click={handleClearData}>
        Clear
      </button>
    </div>
    {#if isLoading}
      <progress class="progress is-small is-primary" max="100" />
    {/if}
  </div>

  <hr />
  <button
    class="button is-primary is-outlined is-center is-rounded"
    id="btn"
    on:click={handleLaunchTutorial}>
    Launch User Guide
  </button>
</form>
