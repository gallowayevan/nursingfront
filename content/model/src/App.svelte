<script>
  import LineChart from "./LineChart.svelte";
  import LineChartDifference from "./LineChartDifference.svelte";
  import SimpleMap from "./SimpleMap.svelte";
  import ModelForm from "./ModelForm.svelte";
  import DownloadData from "./DownloadData.svelte";
  import DownloadImage from "./DownloadImage.svelte";
  import IntroBlock from "./IntroBlock.svelte";
  import ButtonRadio from "./ButtonRadio.svelte";
  import TutorialModal from "./TutorialModal.svelte";
  import formInfo from "./data/formInfo.js";
  import { onMount } from "svelte";
  import { dataFetch, makeQueryURL } from "./utilities.js";
  import CardRadio from "./CardRadio.svelte";
  import cardInfo from "./data/cardInfo.js";

  const ROOT = "root"; //Allows for rollup to switch data root.

  //Create basic data structure for storing data
  let data = new Map(
    ["supply", "demand", "percentage", "difference"].map((d) => [
      d,
      new Map(["line", "map"].map((e) => [e, []])),
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

    dataFetch(`/model/public/maps/ncLayers.json`).then((json) => {
      geoJSON = json;
    });
  });

  async function getData(type, calc, allParams) {
    dataFetch(makeQueryURL(allParams))
      .then(function (newData) {
        if (type == "line") {
          const currentData = data.get(calc).get(type);
          data.get(calc).set(type, [...currentData, ...newData]);
        } else {
          data.get(calc).set(type, newData);
        }

        //Trigger change
        data = data;
      })
      .then(() => {
        // setTimeout(() => (isLoading = false), 3000);
        isLoading = false;
      });
  }

  function handleShowProjection({ detail }) {
    isLoading = true;
    getData(chartType, calculation, [
      { name: "calculation", value: calculation },
      ...detail,
    ]);
    // console.log(detail);
  }

  function handleDeleteProjection(e) {
    const currentProjections = data.get(calculation).get(chartType);
    data.get(calculation).set(
      chartType,
      currentProjections.filter((d) => d.id != +e.detail)
    );
    data = data;
  }

  function handleClearData() {
    data.get(calculation).set(chartType, []);
    data = data;
  }

  function handleCalculationClick({ detail }) {
    calculation = detail;
  }

  function handleLaunchTutorial() {
    showModal = true;
  }

  function changeChartType({ detail }) {
    chartType = detail;
  }
</script>

<section class="section" class:is-clipped={showModal}>
  <TutorialModal {showModal} on:click={() => (showModal = false)} />
  <div class="container" id="main-container">
    <CardRadio
      on:calculationClicked={handleCalculationClick}
      {calculation}
      groupLabel="Radio for Selecting a Calculation Type"
      options={cardInfo}
    />

    <div class="columns">
      <div class="column is-4">
        <ButtonRadio
          on:changeChartType={changeChartType}
          groupLabel={"Line chart or Map"}
          {chartType}
          options={[
            { value: "line", label: "Line Chart" },
            { value: "map", label: "Map" },
          ]}
        />
        <hr />
        <ModelForm
          on:showProjection={handleShowProjection}
          on:clearProjections={handleClearData}
          on:launchTutorial={handleLaunchTutorial}
          {isLoading}
          {calculation}
          {chartType}
        />
      </div>
      <div class="column is-8 box">
        {#if data.get(calculation).get(chartType).length > 0}
          <div class="columns is-marginless">
            <div class="column is-hidden-mobile is-paddingless" />
            <div class="column is-narrow is-paddingless">
              <DownloadImage {chartType} />

              <DownloadData
                data={data.get(calculation).get(chartType)}
                {chartType}
                {projectionStartYear}
              />
            </div>
          </div>
          {#if chartType == "line"}
            {#if calculation == "difference"}
              <LineChartDifference
                data={data.get(calculation).get(chartType)}
                on:deleteProjection={handleDeleteProjection}
                {projectionStartYear}
              />
            {:else}
              <LineChart
                data={data.get(calculation).get(chartType)}
                on:deleteProjection={handleDeleteProjection}
                {projectionStartYear}
                {calculation}
              />
            {/if}
          {:else if chartType == "map"}
            <SimpleMap
              data={data.get(calculation).get(chartType)[0]}
              {geoJSON}
              {projectionStartYear}
            />
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
