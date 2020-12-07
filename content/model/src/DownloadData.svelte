<script>
  import { groups, ascending, extent, range } from "d3-array";
  import { csvFormatRows } from "d3-dsv";
  import options from "./data/options.js";
  import "array-flat-polyfill";

  export let data;
  export let chartType;
  export let projectionStartYear;

  const optionNameToValueLabel = new Map(
    Array.from(options).map(d => [
      d[0],
      new Map(d[1].options.map(e => [e.value, e.label]))
    ])
  );

  const projectionWarning = `NOTE: Values after ${projectionStartYear -
    1} are projected based on model parameters. Values from ${projectionStartYear -
    1} and earlier are based on licensure data.\n`;

  function makeYearByGroup(callingChart) {
    const groupingVariable = callingChart == "map" ? "location" : "setting";
    const valuesToLabels = new Map(
      options.get(groupingVariable).options.map(d => [d.value, d.label])
    );
    const grouped = groups(
      data.flatMap(e => e.values),
      d => d[groupingVariable]
    )
      .map(function(d) {
        return [valuesToLabels.get(d[0]), ...d[1].map(d => d.value)];
      })
      .filter(d => d[0] != undefined);

    const yearExtent = extent(data[0].values, d => d.year);
    const yearRange = range(yearExtent[0], yearExtent[1] + 1);
    const header =
      data[0].params
        .map(
          e =>
            `${options.get(e[0]).label}: ${optionNameToValueLabel
              .get(e[0])
              .get(e[1])}`
        )
        .join("  |  ") + "\n";

    const firstColumnTitle = options.get(groupingVariable).label;

    return (
      projectionWarning +
      header +
      csvFormatRows([[firstColumnTitle, ...yearRange]].concat(grouped))
    );
  }

  function makeYearByProjection() {
    let download = [];
    const maxYearExtent = extent(
      data.flatMap(d => extent(d.values, e => e.year))
    );

    const columns = [
      ...data[0].params.map(d => options.get(d[0]).label),
      ...range(maxYearExtent[0], maxYearExtent[1] + 1)
    ];

    const rows = data
      .map(function(d) {
        const values = d.values.map(e => [e.year, e.value]);
        const params = d.params.map(e => [
          options.get(e[0]).label,
          optionNameToValueLabel.get(e[0]).get(e[1])
        ]);

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
      download = makeYearByGroup(chartType);
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
