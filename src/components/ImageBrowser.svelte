<script>
    export let layerData
    export let addImageToLayer

    const definitions = layerData.layer.conf.DEFINITIONS
    let openCategory = Object.keys(definitions)[0]
    if (layerData.images.length > 0) openCategory = layerData.images[layerData.images.length - 1].category
</script>

<div class="container grid">
    <div class="block sequence">
        <p>Categories of available images:</p>
        {#each Object.keys(definitions) as category}
            <button
                on:click={() => { openCategory = category }}
                disabled={openCategory === category}
            >{category}</button>
        {/each}
    </div>
    <div class="block sequence">
        <p>Add an image:</p>
        {#each Object.keys(definitions[openCategory]) as item}
            <button on:click={() => { addImageToLayer(layerData.layer, openCategory, item) }}>
                <img src={`./images/${openCategory}/${item}.gif`} alt={item} />
                {item}
            </button>
        {/each}
    </div>
</div>
