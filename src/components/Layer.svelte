<script>
    import LayerBrowser from './LayerBrowser.svelte'
    import EffectBrowser from './EffectBrowser.svelte'
    import ImageList from './ImageList.svelte'
    import ImageBrowser from './ImageBrowser.svelte'

    export let layersCount
    export let effects
    export let layerClasses
    export let layerData
    export let replaceLayer
    export let moveLayer
    export let removeLayer
    export let addImageToLayer
    export let removeImageFromLayer
    export let addEffect
    export let removeEffect

    let expanded = true
</script>

<div class="layer container">
    <div class="header container">
        <h2>Layer {layerData.id + 1}</h2>
        <div><button
            on:click={() => { moveLayer(layerData.layer, true) }}
            disabled={layerData.id === layersCount - 1}
        >▲</button></div>
        <div><button
            on:click={() => { moveLayer(layerData.layer, false) }}
            disabled={layerData.id === 0}
        >▼</button></div>
        <div><button on:click={() => { removeLayer(layerData.layer) }}>✕</button></div>
        <div><button on:click={() => { expanded = !expanded }}>
            {#if expanded}
                Collapse
            {:else}
                Expand
            {/if}
        </button></div>
        {#if !expanded}
            <p><strong>{layerData.layer.category} {layerData.layer.item}</strong></p>
            <p>{layerData.images.length} image(s)</p>
        {/if}
    </div>

    <div class="controls container" class:hidden={!expanded}>
        <LayerBrowser {layerClasses} {layerData} {replaceLayer} />
        <EffectBrowser {effects} {layerData} {addEffect} {removeEffect} />
        <ImageList {layerData} {removeImageFromLayer} />
        <ImageBrowser {layerData} {addImageToLayer} />
    </div>
</div>

<style>
    .layer, .controls {
        flex-direction: column;
    }

    .header {
        align-items: center;
    }
</style>
