<script>
    export let layer
    export let effects

    $: oLayer = layer.observable
    $: fx = $oLayer.effects

    const toggleEffect = effectId => {
        const effect = effects[effectId]
        if (fx.includes(effect)) layer.removeEffect(effect)
        else layer.addEffect(effect)
    }
</script>

<div class="block short sequence">
    <p>Effects on this layer:</p>
    {#each Object.keys(effects) as effectId}
        <button on:click={() => { toggleEffect(effectId) }}>
            {fx.includes(effects[effectId]) ? '✓ ' + effectId : effectId}
        </button>
    {/each}
</div>
