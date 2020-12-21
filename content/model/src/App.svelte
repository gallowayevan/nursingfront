<script>
  import LineChart from "./LineChart.svelte";
  import LineChartDifference from "./LineChartDifference.svelte";
  import SimpleMap from "./SimpleMap.svelte";
  import SettingTable from "./SettingTable.svelte";
  import ModelForm from "./ModelForm.svelte";
  import DownloadData from "./DownloadData.svelte";
  import DownloadImage from "./DownloadImage.svelte";
  import IntroBlock from "./IntroBlock.svelte";
  import TutorialModal from "./TutorialModal.svelte";
  import CardButton from "./CardButton.svelte";
  import { onMount } from "svelte";
  import { dataFetch, makeQueryURL } from "./utilities.js";

  const ROOT = "root"; //Allows for rollup to switch data root.

  //Create basic data structure for storing data
  let data = new Map(
    ["supply", "demand", "ratio", "difference"].map(d => [
      d,
      new Map(["line", "map", "table"].map(e => [e, []]))
    ])
  );
  let geoJSON;
  let chartType = "line";
  let showModal = false;
  let projectionStartYear = 2019;
  let calculation = "difference";

  //Whether or not data is loading
  let isLoading = false;

  $: console.log(data);

  onMount(() => {
    const tutorialHistory = localStorage.getItem("nurse-model-tutorial");
    if (tutorialHistory != "seen") {
      showModal = true;
      localStorage.setItem("nurse-model-tutorial", "seen");
    }

    dataFetch(`/model/public/maps/ncLayers.json`).then(json => {
      geoJSON = json;
    });
  });

  async function getData(type, calc, allParams) {
    dataFetch(makeQueryURL(allParams))
      .then(function(newData) {
        if (type == "line") {
          const currentData = data.get(calc).get(type);
          data.get(calc).set(type, [...currentData, newData]);
        } else {
          data.get(calc).set(type, [newData]);
        }
        //Trigger change
        data = data;
      })
      .then(() => {
        isLoading = false;
      });
  }

  function handleShowProjection({ detail }) {
    isLoading = true;
    getData(chartType, calculation, [
      { name: "calculation", value: calculation },
      ...detail
    ]);
    // console.log(detail);
  }

  function handleDeleteProjection(e) {
    const currentProjections = data.get(calculation).get(chartType);
    data
      .get(calculation)
      .set(chartType, currentProjections.filter(d => d.id != +e.detail));
    data = data;
  }

  function handleClearData() {
    data.get(calculation).set(chartType, []);
    data = data;
  }

  function tabClicked(e) {
    if (chartType != e.target.id) {
      chartType = e.target.id;
    }
  }
  function handleCalculationClick({ detail }) {
    calculation = detail;
  }

  function handleLaunchTutorial() {
    showModal = true;
  }
</script>

<section class="section" class:is-clipped={showModal}>
  <TutorialModal {showModal} on:click={() => (showModal = false)} />
  <div class="container" id="main-container">
    <!-- <SimpleSelect
    {...options.get('calculation')}
    disabled={educationType != '0'}
    on:change={handleCalculationChange}>
    <InfoBox name={'Calculation'} info={formInfo.get('calculation')} />
  </SimpleSelect>-->

    <div class="columns" style="margin-bottom: 2rem;">
      <CardButton
        name="difference"
        {calculation}
        on:clicked={handleCalculationClick}>
        <span slot="title">Supply - Demand</span>
        <span slot="subtitle">Will there be a shortage or surplus?</span>
      </CardButton>
      <CardButton
        name="ratio"
        {calculation}
        on:clicked={handleCalculationClick}>
        >
        <span slot="title">Supply / Demand</span>
        <span slot="subtitle">What is the ratio of supply vs demand?</span>
      </CardButton>
      <CardButton
        name="supply"
        {calculation}
        on:clicked={handleCalculationClick}>
        >
        <span slot="title">Supply</span>
        <span slot="subtitle">
          How many nurses are projected in the future?
        </span>
      </CardButton>
      <CardButton
        name="demand"
        {calculation}
        on:clicked={handleCalculationClick}>
        >
        <span slot="title">Demand</span>
        <span slot="subtitle">What will be the demand for services?</span>
      </CardButton>
    </div>

    <div class="columns">
      <div class="column is-4">
        <ModelForm
          on:showProjection={handleShowProjection}
          on:clearProjections={handleClearData}
          on:launchTutorial={handleLaunchTutorial}
          {isLoading}
          {calculation}
          {chartType} />
      </div>
      <div class="column is-8 box">
        <div class="tabs ">
          <!-- svelte-ignore a11y-missing-attribute -->
          <ul>
            <li class={chartType == 'line' ? 'is-active' : ''}>
              <a id="line" on:click={tabClicked}>Compare Projections</a>
            </li>
            <li class={chartType == 'map' ? 'is-active' : ''}>
              <a id="map" on:click={tabClicked}>Compare Places</a>
            </li>
            <li class={chartType == 'table' ? 'is-active' : ''}>
              <a id="table" on:click={tabClicked}>Compare Settings</a>
            </li>
          </ul>
        </div>
        {#if data.get(calculation).get(chartType).length > 0}
          <div class="columns is-marginless">
            <div class="column is-hidden-mobile is-paddingless" />
            <div class="column is-narrow is-paddingless">
              {#if chartType == 'line' || chartType == 'map'}
                <DownloadImage {chartType} />
              {/if}
              <DownloadData
                data={data.get(calculation).get(chartType)}
                {chartType}
                {projectionStartYear} />
            </div>
          </div>
          {#if chartType == 'line'}
            {#if calculation == 'difference'}
              <LineChartDifference
                data={data.get(calculation).get(chartType)}
                on:deleteProjection={handleDeleteProjection}
                {projectionStartYear} />
            {:else}
              <LineChart
                data={data.get(calculation).get(chartType)}
                on:deleteProjection={handleDeleteProjection}
                {projectionStartYear}
                {calculation} />
            {/if}
          {:else if chartType == 'map'}
            <SimpleMap
              data={data.get(calculation).get(chartType)[0]}
              {geoJSON}
              {projectionStartYear} />
          {:else if chartType == 'table'}
            <SettingTable
              data={data.get(calculation).get(chartType)[0]}
              {projectionStartYear} />
          {:else}
            <div class="notification">An error has occurred.</div>
          {/if}
        {:else}
          <IntroBlock on:launchTutorial={handleLaunchTutorial} {chartType} />
        {/if}
      </div>
    </div>
  </div>
</section>
