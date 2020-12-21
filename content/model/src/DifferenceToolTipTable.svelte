<script>
  import { numberFormat } from "./utilities.js";

  export let rows;
</script>

<style>
  td {
    text-align: right;
  }
</style>

<div class="table-container">
  <table class="table is-narrow">
    <thead>
      <tr>
        <th>Supply</th>
        <th>Demand</th>
        <th>Difference</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as { supplyMean, demandMean, value, color, rateOrTotal }}
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
        </tr>
      {/each}

    </tbody>
  </table>
</div>
