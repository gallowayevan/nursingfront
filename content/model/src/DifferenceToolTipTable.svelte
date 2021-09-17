<script>
  import { numberFormat } from "./utilities.js";

  export let rows;
  $: console.log(rows);
</script>

<div class="table-container">
  <table class="table is-narrow">
    <thead>
      <tr>
        <th style="text-align:right;">Supply</th>
        <th style="text-align:right;">Demand</th>
        <th style="text-align:right;">Difference</th>
        <th style="text-align:right;">%</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as { supplyMean, demandMean, value, color, rateOrTotal, percentage }}
        <tr>
          <td style="color:{color}; text-align:right;">
            {numberFormat(rateOrTotal)(supplyMean)}
          </td>
          <td style="color:{color}; text-align:right;">
            {numberFormat(rateOrTotal)(demandMean)}
          </td>
          <td style="color:{color}; text-align:right;">
            {numberFormat(rateOrTotal)(value)}
          </td>
          <td style="color:{color}; text-align:right;">
            {percentage.toLocaleString(undefined, {
              style: "percent",
            })}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  td {
    text-align: right;
  }
</style>
