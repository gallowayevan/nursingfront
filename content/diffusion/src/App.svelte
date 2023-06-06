<script>
  import { onMount } from "svelte";
  import SlippyMap from "./SlippyMap.svelte";
  import ProgramSelect from "./ProgramSelect.svelte";
  import ProgramTags from "./ProgramTags.svelte";
  import ProgramLayer from "./ProgramLayer.svelte";
  import EllipseLayer from "./EllipseLayer.svelte";
  import InstitutionLayer from "./InstitutionLayer.svelte";
  import ProgramTable from "./ProgramTable.svelte";
  import SettingFilter from "./SettingFilter.svelte";
  import note from "./note.js";
  import DownloadData from "./DownloadData.svelte";
  import {
    schemeTableau10 as colorScheme,
    interpolateRainbow
  } from "d3-scale-chromatic";

  export let programs = [];

  let selectedPrograms = [];
  let colorMap = new Map();
  let showHospitalSetting = false;

  $: selectedProgramsOptions = selectedPrograms.map(d =>
    makeProgramOption(programMap.get(d))
  );

  const settingDisplay = new Map([
    [0, "All Nurses"],
    [8, "Academic Setting"],
    [2, "Ambulatory Care Setting"],
    [12, "Community Health"],
    [9, "Correctional Facility"],
    [7, "Home Health/Hospice"],
    [1, "Hospital"],
    [5, "Insurance Claims/Benefits"],
    [6, "Nursing Home/Extended Care/Ass't Living Facility"],
    [4, "Occupational Health"],
    [13, "Policy Planning Regulatory Licensing Agency"],
    [3, "Public Health"],
    [10, "School Health Service"],
    [11, "Other"],
    [14, "Missing"]
  ]);

  const educationTypesDisplay = new Map([
    ["RN-ADN", "RN-ADN"],
    ["RN-BSN", "RN-BSN"],
    ["RN-DIN", "RN-Diploma"],
    ["LPN", "LPN"]
  ]);

  const programMap = new Map(programs.map(d => [d.educationprogramcode, d]));

  const mapSettings = {
    zoom: 6,
    center: [-79.5, 35.3],
    minZoom: 6,
    maxZoom: 9,
    scrollZoom: false
  };

  function handleProgramClicked(e) {
    if (selectedPrograms.includes(e.detail)) {
      selectedPrograms = selectedPrograms.filter(d => d != e.detail);
      colorMap.delete(e.detail);
    } else {
      const newColor = getColor();
      colorMap.set(e.detail, newColor);
      selectedPrograms = [...selectedPrograms, e.detail];
    }
  }

  function handleClearProgramSelections() {
    selectedPrograms = [];
  }

  function makeProgramOption(element) {
    return {
      value: element.educationprogramcode,
      label: element.InstitutionName + " - " + element.educationtype,
      fill: colorMap.has(element.educationprogramcode)
        ? colorMap.get(element.educationprogramcode)
        : "none",
      type: element.educationtype
    };
  }

  function getColor() {
    const currentUsedColors = Array.from(colorMap.values());
    let currentColor = colorScheme.find(d => !currentUsedColors.includes(d));
    if (currentColor == undefined) {
      currentColor = interpolateRainbow(Math.random());
    }

    return currentColor;
  }
</script>

<div class="container">
  <div class="columns">
    <div class="column is-one-third">
      <ProgramSelect
        options={programs.map(makeProgramOption)}
        on:programClicked={handleProgramClicked}
        on:clearProgramSelections={handleClearProgramSelections}
        {educationTypesDisplay} />
    </div>
    <div class="column is-two-thirds">
      <ProgramTags
        options={selectedProgramsOptions}
        on:programClicked={handleProgramClicked} />
    </div>
  </div>
  <h1 class="title is-size-5">
    Approximate Location of Nurses Retained In-State Two Years After Graduation
    (2015 - 2018)
  </h1>
  <h2 class="subtitle is-size-6">
    Ellipses contain approximately 2/3 of each program's graduates.
  </h2>
</div>

<div class="container" style="height:400px;margin-top:1em">
  <SlippyMap settings={mapSettings}>
    {#each selectedPrograms as layerID (layerID)}
      <InstitutionLayer
        data={programMap.get(layerID)}
        color={colorMap.get(layerID)}
        {settingDisplay} />
    {/each}
    {#each selectedPrograms as layerID (layerID)}
      <ProgramLayer
        {layerID}
        fill={colorMap.get(layerID)}
        {showHospitalSetting} />
    {/each}
    {#if !showHospitalSetting}
      {#each selectedPrograms as layerID (layerID)}
        <EllipseLayer {layerID} fill={colorMap.get(layerID)} />
      {/each}
    {/if}
  </SlippyMap>
  <SettingFilter bind:showHospitalSetting />

</div>
<div class="section">
  <div class="container">
    <ProgramTable
      rows={selectedPrograms.map(d => programMap.get(d))}
      colors={colorMap}
      on:programClicked={handleProgramClicked}>
      <DownloadData
        {settingDisplay}
        data={selectedPrograms.map(d => programMap.get(d))} />
    </ProgramTable>
  </div>

</div>
<div class="container">
  <article class="message is-size-7">
    <div class="message-body">Note: {note}<br><br>To cite, please include the following: The Program on Health Workforce Research and Policy at the Cecil G Sheps Center. “NC Nursecast: A Supply and Demand Model for Nurses in North Carolina.” November 1, 2021. https://ncnursecast.unc.edu/diffusion</div>
  </article>
</div>
