<script>
    export let layerClasses
    export let layerData
    export let replaceLayer

    let openCategory = layerData.layer.category
</script>

<div class="container grid">
    <div class="block sequence">
        <p>Types of layers:</p>
        {#each Object.keys(layerClasses) as category}
            <button
                on:click={() => { openCategory = category }}
                disabled={openCategory === category}
            >{category}</button>
        {/each}
    </div>
    <div class="block sequence">
        <p>Subtypes:</p>
        {#each Object.keys(layerClasses[openCategory]) as item}
            <button
                on:click={() => { replaceLayer(openCategory, item, layerData.layer) }}
                disabled={layerData.layer.category === openCategory && layerData.layer.item === item}
            >{item}</button>
        {/each}
    </div>
</div>
