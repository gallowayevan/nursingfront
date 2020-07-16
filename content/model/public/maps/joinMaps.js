const fs = require('fs');

const layers = [{ name: "medicaid", file: "medicaid.json" },
{ name: "ahec", file: "ahec.json" },
{ name: "metroNonmetro", file: "metroNonmetro.json" },
{ name: "state", file: "outline.json" },
{ name: "county", file: "county.json" }].map(
    function (d) {
        const geo = fs.readFileSync(d.file, "utf8");
        return `{"name": "${d.name}", "geo": ${geo}}`;
    }
).join();

fs.writeFileSync("ncLayers.json", `[${layers}]`)