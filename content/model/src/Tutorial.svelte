<script>
    import TutorialImage from "./TutorialImage.svelte";
</script>

<div class="columns is-centered">
    <article
        class="content column
    is-two-thirds-tablet
    is-two-thirds-desktop
    is-two-thirds-widescreen
    is-half-fullhd"
    >
        <h2 id="how-to-use" class="title">
            How to Use the NC Nursecast Visualization
        </h2>
        <ol>
            <li class="notification">
                <p>
                    By clicking on these boxes in the visualization, you can
                    compare supply and demand directly and see shortages or
                    surpluses as a percentage or numerical difference. Or you
                    can view supply or demand separately.
                </p>
                <img
                    class="image"
                    alt="Select one of the boxes to compare supply and demand or show them separately."
                    src="public/images/tutorial/tutorial_00.png"
                />
            </li>
            <li class="notification">
                <p>
                    You can view the projections as either a line chart,
                    comparing multiple projections over time across settings,
                    geographies, and other parameters. Or you can view the
                    projections in a map, comparing across a set of geographies
                    (like AHEC regions.)
                </p>
                <img
                    class="image"
                    alt="Select line for line chart or map for a map of North Carolina broken into a selected geography type."
                    src="public/images/tutorial/tutorial_01.png"
                />
            </li>
            <li class="notification">
                <p>
                    Use the radio buttons or dropdowns to select parameters for
                    the projection you want to view. Select a <svg
                        class="icon-svg has-fill-primary"
                        width="20"
                        height="20"
                        role="img"
                    >
                        <title>Example of information icon button.</title>
                        <use xlink:href="#fa-info-circle" />
                    </svg>
                    to learn more about each option. Select
                    <span class="has-text-weight-semibold">Show</span> to display
                    the line chart or map for your selections. Note that some combinations
                    of selections are not possible.
                </p>
                <img
                    class="image"
                    alt="Example options form for choosing specific projections."
                    src="public/images/tutorial/tutorial_02.png"
                />
            </li>
        </ol>
    </article>
</div>
