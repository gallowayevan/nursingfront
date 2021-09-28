<script>
    import { createEventDispatcher } from "svelte";

    import InfoBox from "./InfoBox.svelte";
    const dispatch = createEventDispatcher();

    export let calculation = undefined;
    export let options = undefined;

    $: active = calculation == name;
</script>

<div class="columns" style="margin-bottom: 2rem;">
    {#each options as { name, title, subtitle, info }, index}
        <div
            class="card column"
            class:has-background-primary={active}
            class:has-text-white={active}
            on:click={() => dispatch("clicked", name)}
        >
            <div class="card-content">
                <p class="is-size-3">{title}</p>
                <p class="is-size-4">
                    {subtitle}
                </p>
            </div>
            <div class="is-pulled-right">
                <InfoBox {title} {info} invert={active} />
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
</style>
