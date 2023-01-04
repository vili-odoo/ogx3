<script>
    export let effects
    export let layerData
    export let addEffect
    export let removeEffect

    const toggleEffect = effectId => {
        const effect = effects[effectId]
        if (layerData.effects[effectId]) removeEffect(layerData.layer, effect)
        else addEffect(layerData.layer, effect)
    }
</script>

<div class="block sequence">
    <p>Effects on this layer:</p>
    {#each Object.keys(effects) as effectId}
        <button on:click={() => { toggleEffect(effectId) }}>
            {layerData.effects[effectId] ? '✓ ' + effectId : effectId}
        </button>
    {/each}
</div>
