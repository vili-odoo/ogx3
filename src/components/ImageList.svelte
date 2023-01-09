<script>
    export let layer

    $: oLayer = layer.observable
</script>

<div class="block short sequence">
    <p>Images in this layer:</p>
    {#each $oLayer.images as image, imageId}
        <button on:click={() => { layer.removeImage(imageId) }}>
            <img src={`./images/${image.category}/${image.item}.gif`} alt={`${image.category} ${image.item}`} />
            <p>✕</p>
        </button>
    {/each}
</div>
