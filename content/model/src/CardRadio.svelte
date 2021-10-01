<script>
    import { createEventDispatcher } from "svelte";

    import InfoBox from "./InfoBox.svelte";
    const dispatch = createEventDispatcher();

    export let calculation = undefined;
    export let options = undefined;
    export let groupLabel = undefined;

    function tabKeydown(e) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            const currentIndex = +e.target.getAttribute("data-index");
            const moveIndex = e.key === "ArrowLeft" ? -1 : 1;
            let newIndex = currentIndex + moveIndex;

            if (newIndex >= options.length) {
                //If newIndex is too far right, circle to front
                newIndex = 0;
            } else if (newIndex < 0) {
                //If newIndex is too far left, circle to end
                newIndex = options.length - 1;
            }
            document.getElementById(options[newIndex].name).focus();
            dispatch("calculationClicked", options[newIndex].name);
        }
    }
</script>

<div
    class="columns"
    role="radiogroup"
    aria-label={groupLabel}
    style="margin-bottom: 2rem;"
>
    {#each options as { name, title, subtitle, info }, index}
        <div
            class="card column"
            class:has-background-primary={name === calculation}
            class:has-text-white={name === calculation}
            id={name}
            role="radio"
            data-index={index}
            aria-checked={name === calculation}
            tabindex={name === calculation ? 0 : -1}
            aria-labelledby={`${name}-card-radio-title ${name}-card-radio-subtitle`}
            on:click={() => dispatch("calculationClicked", name)}
            on:keydown={tabKeydown}
        >
            <div class="card-content">
                <p class="is-size-3" id={name + "-card-radio-title"}>{title}</p>
                <p class="is-size-4" id={name + "-card-radio-subtitle"}>
                    {subtitle}
                </p>
            </div>
            <div class="is-pulled-right">
                <InfoBox {title} {info} invert={name === calculation} />
            </div>
        </div>
    {/each}
</div>

<style>
    .card {
        transition: box-shadow 0.3s;
    }

    .card:hover {
        box-shadow: 0 0 11px rgba(70, 93, 128, 0.7);
        z-index: 100;
    }

    .card:focus {
        outline-width: 1px;
        outline-style: dashed;
        outline-color: #465d80;
    }
</style>
