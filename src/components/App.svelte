<script>
    import { layersData } from '../stores.js'
    import conf from '../conf/conf.js'
    import effects from '../conf/effects.js'
    import layerClasses from '../conf/layerClasses.js'
    import { pickKey } from '../lib/helpers.js'
    import OGApp from '../lib/OGApp.js'
    import Layer from './Layer.svelte'

    const app = new OGApp(conf)

    const update = () => {
        layersData.update(layerData => app.layers.map(
            (l, i) => {
                const fx = Object.fromEntries(Object.entries(effects).map(e => [
                    e[0], l.effects.includes(e[1]),
                ]))
                return { layer: l, id: i, images: l.images, effects: fx }
            }
        ))
    }

    const addLayer = () => {
        const category = pickKey(layerClasses)
        const item = pickKey(layerClasses[category])
        app.addLayer(layerClasses[category][item], null).then(update)
    }

    const replaceLayer = (category, item, layerToReplace) => {
        app.addLayer(layerClasses[category][item], layerToReplace).then(update)
    }

    const moveLayer = (layer, up) => {
        app.moveLayer(layer, up)
        update()
    }

    const removeLayer = layer => {
        app.removeLayer(layer)
        update()
    }

    const addImageToLayer = (layer, category, item) => {
        app.loadImage(category, item, '.png').then(() => {
            layer.addImage(app.getImage(category, item))
            update()
        }).catch(() => {})
    }

    const removeImageFromLayer = (layer, imageId) => {
        layer.removeImage(imageId)
        update()
    }

    const addEffect = (layer, effect) => {
        layer.addEffect(effect)
        update()
    }

    const removeEffect = (layer, effect) => {
        layer.removeEffect(effect)
        update()
    }

    const docPromise = new Promise((resolve, reject) => {
        if (document.readyState === 'loading') document.addEventListener('load', resolve)
        else resolve()
    })

    const appPromise = Promise.all([ docPromise, app.init() ]).then(addLayer)
</script>

<main>
    <div class="sidebar container">
        <div class="title">
            <div><h2>The</h2></div>
            <div><img class="ogx3" src="./ogx3.svg" alt="OGx3" /></div>
            <div><h1>Odoo GIF</h1></div>
            <div><p>open-source generator</p></div>
        </div>
        <div class="gifs container">
            <div><canvas id="preview" width={conf.WIDTH} height={conf.HEIGHT}></canvas></div>
            {#await appPromise then _}
                <canvas id="generate" class="hidden" width={conf.WIDTH} height={conf.HEIGHT}></canvas>
                <div>
                    <p>{$layersData.length} layer(s)</p>
                </div>
                <div>
                    <button on:click={app.generateGif.bind(app)}>Generate GIF</button>
                </div>
            {/await}
        </div>
    </div>

    {#await appPromise then _}
        <div class="content container">
            {#each $layersData as layerData (layerData.layer)}
                <div class="block">
                    <Layer
                        layersCount={$layersData.length}
                        {effects}
                        {layerClasses}
                        {layerData}
                        {replaceLayer}
                        {moveLayer}
                        {removeLayer}
                        {addImageToLayer}
                        {removeImageFromLayer}
                        {addEffect}
                        {removeEffect}
                    />
                </div>
            {/each}
            <div class="block">
                <button on:click={addLayer}>Add a layer</button>
            </div>
        </div>
    {/await}
</main>

<style>
    main {
        display: flex;
        height: 100vh;
        width: 100vw;
    }

    .sidebar, .content {
        overflow: auto;
        padding: 16px;
    }

    .sidebar {
        background-color: #8a0f69;
        flex-direction: column;
    }

    .sidebar button:not(:active):not(:disabled) {
        color: #8a0f69;
    }

    .title {
        text-align: center;
    }

    .ogx3 {
        max-width: 128px;
    }

    .gifs {
        align-items: center;
        flex-direction: column;
    }

    .content {
        flex: 1 0 0;
        flex-direction: column-reverse;
    }
</style>
