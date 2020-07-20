<script>
  import TutorialImage from "./TutorialImage.svelte";
  export let showModal;

  const images = [
    "Selectcharttype 500px.png",
    "Modify chart 500px.png",
    "Linechart guide 500px.png",
    "clearviz 500px.png",
    "MapGuide 500px.png",
    "Table PNG plain.png"
  ];
</script>

<style>
  .is-family-code {
    font-weight: bolder;
    background-color: #ececec;
  }
</style>

<div class="modal" class:is-active={showModal}>
  <div class="modal-background" on:click />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">User Guide</p>
      <button
        class="delete"
        aria-label="close"
        data-bulma-modal="close"
        on:click />
    </header>
    <section class="modal-card-body content">
      <h1 class="title">Viewing Nurse Workforce Projections</h1>
      <TutorialImage imageFileName={images[0]}>
        <p>
          <span class="has-text-weight-semibold">
            Select whether you would like to view the data as a line chart, map
            or table.
          </span>
        </p>
      </TutorialImage>
      <TutorialImage imageFileName={images[1]}>
        <p>
          <span class="has-text-weight-semibold">
            Use the radio buttons to choose the parameters for the projection
            you would like to view.
          </span>
          Select the
          <span class="is-family-code">i</span>
          icon to learn more about each option. Then, select
          <span class="is-family-code">Show</span>
          to display the line chart, map or table.
        </p>
      </TutorialImage>
      <TutorialImage imageFileName={images[2]}>

        <h2>Using the line chart function</h2>
        <p>
          <span class="has-text-weight-semibold">
            If you are using the line chart option,
          </span>
          you can display multiple lines at once to compare. Just change your
          options and select
          <span class="is-family-code">Show</span>
          again. To remove a line, hit the
          <span class="is-family-code">X</span>
          button in the top left of its corresponding box. Once you have
          displayed the projections* you are interested in, you can download the
          image (as a PNG) or the data (as a CSV file).
        </p>
        <p>
          <span class="has-text-weight-semibold">Please note:</span>
          the model won’t allow you to display the projections for specific
          education categories combined with specific settings at the same time.
          For instance, the projection for RN, with BS for education, and
          hospital for setting is not available. This is because the numbers are
          small.
        </p>
        <p>
          *The projection line does include some historical data, but
          projections are delineated by gray.
        </p>
      </TutorialImage>
      <TutorialImage imageFileName={images[3]}>
        <p>
          <span class="has-text-weight-semibold">
            To remove all lines and reset the visualization, select the
            <span class="is-family-code">Clear</span>
            button.
          </span>
        </p>
      </TutorialImage>
      <TutorialImage imageFileName={images[4]}>
        <h2>Using the map function</h2>
        <p>
          <span class="has-text-weight-semibold">
            You can also view projections as a map.
          </span>
          Use the slider below the map to change the year of data. The maps are
          color-coded to indicate the location of each area.
        </p>
      </TutorialImage>
      <TutorialImage imageFileName={images[5]}>
        <h2>Using the table option</h2>
        <p>
          <span class="has-text-weight-semibold">
            You can also view projections in a table.
          </span>
          The colors represent the change relative to the baseline (the first
          year, in this case, 2008).
          <span style="color:red;">Red</span>
          indicates a decrease from the baseline.
          <span style="color:blue;">Blue</span>
          indicates an increase from the baseline. The table can be downloaded
          as a CSV file.
        </p>
      </TutorialImage>

    </section>
  </div>
</div>
