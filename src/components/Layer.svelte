<script>
    import LayerBrowser from './LayerBrowser.svelte'
    import EffectBrowser from './EffectBrowser.svelte'
    import ImageList from './ImageList.svelte'
    import ImageBrowser from './ImageBrowser.svelte'

    export let composition
    export let pos
    export let layer
    export let images
    export let effects
    export let layerClasses

    let expanded = true
    const oComposition = composition.observable
    $: oLayer = layer.observable
</script>

<div class="layer container">
    <div class="header container">
        <h2>Layer {pos + 1}</h2>
        <div><button
            on:click={() => { composition.moveLayer(layer, true) }}
            disabled={pos === $oComposition.length - 1}
        >▲</button></div>
        <div><button
            on:click={() => { composition.moveLayer(layer, false) }}
            disabled={pos === 0}
        >▼</button></div>
        <div><button on:click={() => { composition.removeLayer(layer) }}>✕</button></div>
        <div><button on:click={() => { expanded = !expanded }}>
            {#if expanded}
                Collapse
            {:else}
                Expand
            {/if}
        </button></div>
        {#if !expanded}
            <p><strong>{layer.category} {layer.item}</strong></p>
            <p>{$oLayer.images.length} image(s)</p>
        {/if}
    </div>

    <div class="controls container" class:hidden={!expanded}>
        <LayerBrowser {composition} {layer} {layerClasses} />
        <EffectBrowser {layer} {effects} />
        <ImageList {layer} />
        <ImageBrowser {layer} {images} />
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
