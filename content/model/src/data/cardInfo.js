import options from './options.js'
import formInfo from './formInfo.js'

const subtitles = new Map([
    ["difference", "Will there be a shortage or surplus?"],
    ["percentage", "What is the relative shortage or surplus?"],
    ["supply", "How many nurses are projected in the future?"],
    ["demand", "What will be the demand for services?"]
])

export default options.get("calculation").options.map(function ({ value, label }) {
    const name = value;
    const title = label;
    const info = formInfo.get(value)
    const subtitle = subtitles.get(value);

    return { name, title, subtitle, info }

})

