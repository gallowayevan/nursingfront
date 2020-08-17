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
  import { dataFetch, makeQueryURL } from "./utilities.js";

  const ROOT = "root"; //Allows for rollup to switch data root.

  let data = [];
  let geoJSON;
  let chartType = "line";
  let showModal = false;
  let projectionStartYear = 2019;

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

  async function getData(type, allParams) {
    dataFetch(makeQueryURL(allParams)).then(function(newData) {
      if (type == "line") {
        data = [...data, newData];
      } else {
        data = newData;
      }
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
          on:clearProjections={handleClearData}
          on:launchTutorial={handleLaunchTutorial}
          {chartType} />
      </div>
      <div class="column is-8 box">
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
      </div>
    </div>
  </div>
</section>
