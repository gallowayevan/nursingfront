<script>
  export let baseYear;
</script>

<style>
  .legend-title {
    font-size: 14px;
  }

  .legend-text {
    font-size: 12px;
  }

  text {
    fill: hsl(0, 0%, 29%);
  }

  div {
    width: 300px;
  }
</style>

<div>
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 320 45.3"
    style="enable-background:new 0 0 320 45.3;"
    xml:space="preserve">

    <g transform="translate(0,20)">

      <image
        style="overflow:visible;enable-background:new ;"
        width="256"
        height="1"
        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAABCAYAAAAxWXB3AAADkklEQVQ4jQXBDVCPdwDAcbfdbk+p
        FKolZIzlOl1aTCxvDWNxrHkba6wtr+lqZE3X6v4XIfKycBFasnQpJalUkvT+4r9a76UXvb+/v/x/
        z/Pd5zPl0BRdTnygx6kPp+H9kT6qjw04LxkQpD2d4KkzCNGZyX09QyKmGfFI34gYA2Pip39C4gwT
        UgxnkWZkyitjU7JMZpNrOoeCOXMpNjND/ek8yhbMp2LRAqrNP6POYiENlp/TtNScli8W07bcgg7b
        JXTZWdKz1opee2v6N9owsHk5gw4rGNq+kmHHrxjZtZrRvWsZ27+esZ++ZvznTUz8upmJw98ycWwr
        kye2M+n+HZO/7UTjuRuN1140Z/aj8XFC43sQjcoZ4e+CCDiMuHAUEeiKCHJDXPVAXD+JuHEaccsL
        EeKNCPVB3PNDhKkQ4WcREQGIyIuIqEuI6CuImGuIJ8GI+JuIhBBE4h1E0l1EShgiNRyR/hCREYmc
        GYX8+jHym1jknDjkvATk/ETkwiTk4hTkklRkdTpyaQZyWSZyeRZKRTZKZS5KdT5KTSFKbTFKfQnK
        OzVKQylKYxlKUzlKcwVKSxVKazVKWy1Kex1KRz1KZwNKZyN0NUH3e+hpgd5W6GuD/nYY6ISBLhjs
        hqEeGO6FkT5GJ2FoXKF/VKZnRNA5pKF9YJKW/gmae8dp6B6nvmuMmo5RqtpGKG8dpuz9MOrmIUoa
        BylsGCC/vp+cuj6yanrJrO7hZVU3qRVdJJd3kljWQXxpO7HqNqLftvKouIWIovf8XdDM3bwmbuc2
        cjO7gb+y3nEls55LGfWcT6/jbFotqhc1/JlcjffzKryeVXLqaSUecRW4xZZzPOY/jkSX4RJVinPk
        vxx4qMbpwVv2hZewJ6yYXfeKcAwtYsedQraFFOBwK58tN/L4JjiXDddzsL+azbqgN6y5nIVd4GtW
        XcjENuAVX57LYJn/S2xU6Vj7pWHlm4qlzwuWeKdgcSaZxV5JmJ9+ziLPRBaefMYCjwTmuz9lnls8
        Zq5xzD3+hNlHYzE9EsOsQ48xcYnG+JcojJwfYXgwkpkH/mGGUwTTf3yAwb5w9H8IQ3/Pfabtvove
        zlB0v7+NrmMIOjtuobP9JlO3BTN163W0Ha6hveUK2psvo70pEK2NF9HacB4t+3NorfdHa50KaY0f
        0mpfJDsfpFXeSCv/QLL9HWmFJ9Lyk0jLPJBs3JGs3ZCWuiJZHeN/8xLJWVweskkAAAAASUVORK5C
        YII="
        transform="matrix(1.25 0 0 13 0 -1.9714)" />
      <g transform="translate(160.5,0)">
        <text class="legend-text" transform="matrix(1 0 0 1 -30.8356 21.1285)">
          No Change
        </text>
      </g>
      <text class="legend-title" transform="matrix(1 0 0 1 0 -7.9714)">
        Change Compared to {baseYear}
      </text>
    </g>
    <text class="legend-text" transform="matrix(1 0 0 1 265.9746 40.8997)">
      Increase
    </text>
    <text class="legend-text" transform="matrix(1 0 0 1 8 41.3568)">
      Decrease
    </text>
  </svg>
</div>
