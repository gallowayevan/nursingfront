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
        if (e.keyCode === 13 && chartType !== e.target.id) {
            dispatch("changeChartType", e.target.id);
        }
    }
</script>

<div class="buttons has-addons" role="radiogroup" aria-label={groupLabel}>
    {#each options as { value, label }}
        <button
            id={value}
            role="radio"
            aria-checked={chartType == value}
            class={chartType == value
                ? "button is-selected is-primary"
                : "button"}
            on:click={tabClicked}
            on:keydown={tabKeydown}>{label}</button
        >
    {/each}
</div>
