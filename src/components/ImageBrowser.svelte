<script>
    export let layer
    export let images

    $: oLayer = layer.observable

    let openCategory = Object.keys(images)[0]
    if ($oLayer && $oLayer.images.length > 0) openCategory = $oLayer.images[$oLayer.images.length - 1].category

    const addImage = item => {
        const image = images[openCategory][item]
        image.load().then(() => {
            layer.addImage(image)
        }).catch(() => {})
    }
</script>

<div class="container grid">
    <div class="block short sequence">
        <p>Categories of available images:</p>
        {#each Object.keys(images) as category}
            <button
                on:click={() => { openCategory = category }}
                disabled={openCategory === category}
            >{category}</button>
        {/each}
    </div>
    <div class="block short sequence">
        <p>Add an image:</p>
        {#each Object.keys(images[openCategory]) as item}
            <button on:click={() => { addImage(item) }}>
                <img src={`./images/${openCategory}/${item}.gif`} alt={item} />
                {item}
            </button>
        {/each}
    </div>
</div>
