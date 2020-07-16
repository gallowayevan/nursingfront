<script>
  import { csvFormat } from "d3-dsv";
  import note from "./note.js";

  export let data = [];
  export let settingDisplay;

  function handleDownloadData() {
    const dataWithAmendedHeaders = data.map(function(d) {
      const newObj = {};
      Object.keys(d).forEach(function(e) {
        const settingCode = +e.slice(7);
        if (settingDisplay.has(settingCode)) {
          newObj[settingDisplay.get(settingCode)] = d[e];
        } else {
          newObj[e] = d[e];
        }
      });
      return newObj;
    });
    const download =
      note.replace(/\./gi, ". \n").replace(/\,/gi, "") +
      "\n" +
      csvFormat(dataWithAmendedHeaders);

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(
        new Blob([download], { type: "text/csv;charset=utf-8;" }),
        "nurse_diffusion.csv"
      );
    } else {
      var uri = "data:attachment/csv;charset=utf-8," + encodeURI(download);
      var downloadLink = document.createElement("a");
      downloadLink.href = uri;
      downloadLink.download = "nurse_diffusion.csv";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }
</script>

<button title="Download Data" class="button" on:click={handleDownloadData}>
  <svg class="button-icon-svg has-fill-primary">
    <use xlink:href="#fa-file-csv" />
  </svg>
</button>
