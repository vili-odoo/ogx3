<script>
    export let composition
    export let layer
    export let layerClasses

    let openCategory = layer.category
</script>

<div class="container grid">
    <div class="block short sequence">
        <p>Types of layers:</p>
        {#each Object.keys(layerClasses) as category}
            <button
                on:click={() => { openCategory = category }}
                disabled={openCategory === category}
            >{category}</button>
        {/each}
    </div>
    <div class="block short sequence">
        <p>Subtypes:</p>
        {#each Object.keys(layerClasses[openCategory]) as item}
            <button
                on:click={() => { composition.addLayer(new layerClasses[openCategory][item](), layer) }}
                disabled={layer.category === openCategory && layer.item === item}
            >{item}</button>
        {/each}
    </div>
</div>
