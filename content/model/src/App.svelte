<script>
  import LineChart from "./LineChart.svelte";
  import SimpleMap from "./SimpleMap.svelte";
  import Table from "./Table.svelte";
  import ModelForm from "./ModelForm.svelte";
  import DownloadData from "./DownloadData.svelte";
  import DownloadImage from "./DownloadImage.svelte";
  import IntroBlock from "./IntroBlock.svelte";
  import TutorialModal from "./TutorialModal.svelte";
  import { onMount } from "svelte";

  const ROOT = "root"; //Allows for rollup to switch data root.

  let data = [];
  let geoJSON;
  let chartType = "line";
  let dataID = 0;
  let showModal = false;
  let projectionStartYear = 2019;
  let fetchError = false;

  $: console.log(data);

  onMount(() => {
    const tutorialHistory = localStorage.getItem("nurse-model-tutorial");
    if (tutorialHistory != "seen") {
      showModal = true;
      localStorage.setItem("nurse-model-tutorial", "seen");
    }

    fetchError = false;
    fetch(`/model/public/maps/ncLayers.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(json => {
        //Make sure county is the last layer
        geoJSON = json;
      })
      .catch(error => {
        fetchError = true;
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  });

  async function getData(type, allParams) {
    //Separate calculation from other parameters, since calculation is not a column in data
    const table = allParams.find(d => d.name == "calculation").value;
    const scenarios = new Map(
      allParams
        .filter(d => d.name.indexOf("Scenario") >= 0)
        .map(d => [d.name, d.value])
    );

    if (scenarios.size == 2) {
    }
    console.log(scenarios);
    const params = allParams.filter(d => d.name != "calculation");

    const queryURL = `${ROOT}${table}?${params
      .map(d => `${d.name}=${+d.value}`)
      .join("&")}`;

    fetchError = false;
    await fetch(queryURL)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(json => {
        if (json.length == 0) {
          throw new Error("No data.");
        } else {
          const newFormatter = numberFormat(
            +params.find(d => d.name == "rateOrTotal").value
          );

          let newData = json.map(d =>
            Object.assign({ display: newFormatter(d.mean) }, d)
          );
          newData.params = allParams;

          if (type == "line") {
            newData.id = dataID++;
            data = [...data, newData];
          } else {
            data = newData;
          }
        }
      })
      .catch(error => {
        fetchError = true;
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }

  function handleShowProjection(e) {
    getData(chartType, e.detail);
  }

  function handleDeleteProjection(e) {
    data = data.filter(d => d.id != +e.detail);
  }

  function handleClearData() {
    data = [];
  }

  function tabClicked(e) {
    if (chartType != e.target.id) {
      chartType = e.target.id;
      data = [];
    }
  }

  function numberFormat(total = 1) {
    // const total = +data.params.find(d => d.name == "rateOrTotal").value;
    return v =>
      total
        ? Math.round(v).toLocaleString()
        : v.toLocaleString(undefined, {
            minimumSignificantDigits: 3,
            maximumSignificantDigits: 3
          });
  }

  function handleLaunchTutorial() {
    showModal = true;
  }
</script>

<section class="section" class:is-clipped={showModal}>
  <TutorialModal {showModal} on:click={() => (showModal = false)} />
  <div class="container" id="main-container">

    <div class="columns">
      <div class="column is-4">
        <div class="tabs is-toggle">
          <!-- svelte-ignore a11y-missing-attribute -->
          <ul>
            <li class={chartType == 'line' ? 'is-active' : ''}>
              <a id="line" on:click={tabClicked}>Line Chart</a>
            </li>
            <li class={chartType == 'map' ? 'is-active' : ''}>
              <a id="map" on:click={tabClicked}>Map</a>
            </li>
            <li class={chartType == 'table' ? 'is-active' : ''}>
              <a id="table" on:click={tabClicked}>Table</a>
            </li>
          </ul>
        </div>
        <ModelForm
          on:showProjection={handleShowProjection}
          on:clearData={handleClearData}
          on:launchTutorial={handleLaunchTutorial}
          {chartType} />
      </div>
      <div class="column is-8 box">
        {#if fetchError}
          <div class="notification is-danger">
            An error has occurred. Please try selecting different projection
            parameters or reload the page.
          </div>
        {:else}
          {#if data.length > 0}
            <div class="columns is-marginless">
              <div class="column is-hidden-mobile is-paddingless" />
              <div class="column is-narrow is-paddingless">
                {#if chartType == 'line' || chartType == 'map'}
                  <DownloadImage {chartType} />
                {/if}
                <DownloadData {data} {chartType} {projectionStartYear} />
              </div>
            </div>
          {/if}
          {#if data.length > 0}
            {#if chartType == 'line'}
              <LineChart
                {data}
                on:deleteProjection={handleDeleteProjection}
                {projectionStartYear} />
            {:else if chartType == 'map'}
              <SimpleMap {data} {geoJSON} {projectionStartYear} />
            {:else if chartType == 'table'}
              <Table {data} {projectionStartYear} />
            {:else}
              <div class="notification">An error has occurred.</div>
            {/if}
          {:else}
            <IntroBlock on:launchTutorial={handleLaunchTutorial} {chartType} />
          {/if}
        {/if}
      </div>
    </div>
  </div>
</section>
