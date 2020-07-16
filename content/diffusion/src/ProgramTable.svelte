<script>
  import { createEventDispatcher } from "svelte";
  import { fontColor } from "./utilities.js";

  const dispatch = createEventDispatcher();

  const display = new Map([
    ["InstitutionName", "Institution"],
    ["educationtype", "Program Type"],
    ["n", "#"],
    ["setting1", "# Hospital (%)"],
    ["setting2", "# Ambulatory (%)"],
    ["setting7", "# Home Health / Hospice (%)"],
    ["nonmetro", "# Rural (%)"],
    ["distance", "Mean Distance in Miles"],
    ["retention", "Percent Retention in NC"]
  ]);

  const order = [
    ["InstitutionName", "string"],
    ["educationtype", "string"],
    ["n", "integer"],
    ["setting1", "integer"],
    ["setting2", "integer"],
    ["setting7", "integer"],
    ["nonmetro", "integer"],
    ["distance", "decimal"],
    ["retention", "percent"]
  ];

  const showPercentVariables = ["setting1", "setting2", "setting7", "nonmetro"];

  export let rows = [];
  export let colors = new Map();

  const percentFormatter = v =>
    v.toLocaleString(undefined, {
      style: "percent",
      minimumSignificantDigits: 2,
      maximumSignificantDigits: 2
    });

  function cellFormatter(row, [variable, type]) {
    let fValue = row[variable];

    if (fValue < 0) {
      fValue = "N/A";
    } else if (type == "percent") {
      fValue = percentFormatter(+fValue);
    } else if (showPercentVariables.includes(variable)) {
      fValue = `${fValue} (${percentFormatter(row[variable] / row["n"])})`;
    }

    return fValue;
  }

  function cellStyle([variable, type], row, index) {
    let cStyle = type != "string" ? `text-align:right;` : ``;

    if (index == 0) {
      const c = colors.get(row["educationprogramcode"]);
      cStyle += `background-color: ${c}; color: ${fontColor(c)};`;
    }
    if (variable.includes("setting")) {
      cStyle += `background-color: #f1f1f1;`;
    }
    return cStyle;
  }

  function handleDeleteClicked(e) {
    dispatch("programClicked", e.target.getAttribute("data-value"));
  }
</script>

<div class="table-container">
  <table class="table is-narrow">
    <thead>
      <tr>
        <th>
          <slot />
        </th>
        {#each order as column}
          <th style={cellStyle(column)}>{display.get(column[0])}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          <th>
            <button
              data-value={row['educationprogramcode']}
              class="delete"
              on:click={handleDeleteClicked} />
          </th>
          {#each order as column, index}
            <th style={cellStyle(column, row, index)}>
              {cellFormatter(row, column)}
            </th>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <span class="tag is-info">
    Percentages will not sum to 100% as there are additional work settings not
    shown. Data for these other settings are available in the downloadable file.
  </span>
</div>
