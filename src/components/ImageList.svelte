<script>
    export let layerData
    export let removeImageFromLayer
</script>

<div class="block sequence">
    <p>Images in this layer:</p>
    {#each layerData.images as image, imageId}
        <button on:click={() => { removeImageFromLayer(layerData.layer, imageId) }}>
            <img src={`./images/${image.category}/${image.item}.gif`} alt={`${image.category} ${image.item}`} />
            <p>✕</p>
        </button>
    {/each}
</div>
