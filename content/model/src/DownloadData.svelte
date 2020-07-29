<script>
  import { groups, ascending, extent, range } from "d3-array";
  import { csvFormatRows } from "d3-dsv";
  import selectOptions from "./data/selectOptions.js";

  export let data;
  export let chartType;
  export let projectionStartYear;

  const projectionWarning = `NOTE: Values after ${projectionStartYear -
    1} are projected based on model parameters. Values from ${projectionStartYear -
    1} and earlier are based on licensure data.\n`;

  const locationNamesMap = new Map(
    selectOptions.get("location").options.map(d => [d.value, d.label])
  );

  function makeYearByGeography() {
    const grouped = groups(data, d => d.location).map(function(d) {
      // const sorted = d[1].sort((a, b) => ascending(a.year, b.year));
      return [locationNamesMap.get(d[0]), ...d[1].map(d => d.mean)];
    });

    const yearExtent = extent(data, d => d.year);
    const yearRange = range(yearExtent[0], yearExtent[1] + 1);
    const header =
      data.params
        .map(
          e =>
            `${e.name.charAt(0).toUpperCase() + e.name.slice(1)}: ${e.display}`
        )
        .join("  |  ") + "\n";

    return (
      projectionWarning +
      header +
      csvFormatRows(
        [
          [
            data.params.filter(d => d.name == "locationType")[0].display,
            ...yearRange
          ]
        ].concat(grouped)
      )
    );
  }

  function makeYearByProjection() {
    let download = [];
    const maxYearExtent = extent(data.flatMap(d => extent(d, d => d.year)));

    const columns = [
      ...data[0].params.map(d => d.name),
      ...range(maxYearExtent[0], maxYearExtent[1] + 1)
    ];

    const rows = data
      .map(function(d) {
        const params = d.params.map(e => [e.name, e.display]);
        const values = d.map(e => [e.year, e.mean]);
        return new Map([...params, ...values]);
      })
      .map(function(d) {
        return columns.map(e => d.get(e) || "");
      });

    return projectionWarning + csvFormatRows([columns, ...rows]);
  }

  function handleDownloadData() {
    let download = [];
    if (chartType == "map" || chartType == "table") {
      download = makeYearByGeography();
    } else {
      download = makeYearByProjection();
    }

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(
        new Blob([download], { type: "text/csv;charset=utf-8;" }),
        "nurseprojection.csv"
      );
    } else {
      var uri = "data:attachment/csv;charset=utf-8," + encodeURI(download);
      var downloadLink = document.createElement("a");
      downloadLink.href = uri;
      downloadLink.download = "nurseprojection.csv";

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
