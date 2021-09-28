<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let groupLabel = "Button Radio Group";
    export let options = undefined;
    export let chartType = undefined;

    function tabClicked(e) {
        if (chartType != e.target.id) {
            dispatch("changeChartType", e.target.id);
        }
    }

    function tabKeydown(e) {
        if (e.keyCode === 37 || e.keyCode === 39) {
            const currentIndex = +e.target.getAttribute("data-index");
            const moveIndex = e.keyCode === 37 ? -1 : 1;
            let newIndex = currentIndex + moveIndex;

            if (newIndex >= options.length) {
                //If newIndex is too far right, circle to front
                newIndex = 0;
            } else if (newIndex < 0) {
                //If newIndex is too far left, circle to end
                newIndex = options.length - 1;
            }
            document.getElementById(options[newIndex].value).focus();
            dispatch("changeChartType", options[newIndex].value);
        }
    }
</script>

<div class="buttons has-addons" role="radiogroup" aria-label={groupLabel}>
    {#each options as { value, label }, index}
        <button
            id={value}
            role="radio"
            data-index={index}
            aria-checked={chartType == value}
            tabindex={chartType === value ? 0 : -1}
            class={chartType === value
                ? "button is-selected is-primary"
                : "button"}
            on:click={tabClicked}
            on:keydown={tabKeydown}>{label}</button
        >
    {/each}
</div>
