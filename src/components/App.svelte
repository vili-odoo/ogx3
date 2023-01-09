<script>
    import { onMount } from 'svelte'
    import conf from '../conf/conf.js'
    import definitions from '../conf/definitions.js'
    import effects from '../conf/effects.js'
    import layerClasses from '../conf/layerClasses.js'
    import { pickKey, getCtx } from '../lib/helpers.js'
    import OGImage from '../lib/OGImage.js'
    import OGComposition from '../lib/OGComposition.js'
    import Layer from './Layer.svelte'

    const frameDelay = Math.ceil(1000 / conf.fps)

    let state = 'loading'
    const images = {}
    let frameId = 0
    let composition = null
    let oComposition = null

    const generateGif = () => {
        if (state !== 'ready') return

        state = 'generating'
        Promise.allSettled(Object.values(images).map(imgs => Promise.allSettled(
            Object.values(imgs).map(image => image.promise)
        ))).then(() => {
            const gifCtx = getCtx('generation', { willReadFrequently: true })
            const gifComposition = new OGComposition(
                gifCtx,
                conf.framecount,
            )
            for (const layerData of composition.layersData) gifComposition.addLayer(layerData.layer, null)

            const gif = new GIF({ width: conf.width, height: conf.height })
            for (let i = 0; i < conf.framecount; i++) {
                gifComposition.render(i)
                gif.addFrame(gifCtx, { copy: true, delay: frameDelay })
            }
            gif.on('finished', blob => {
                window.open(URL.createObjectURL(blob))
                state = 'ready'
            })
            gif.render()
        })
    }

    const render = () => {
        composition.render(frameId)
        window.requestAnimationFrame(render)
    }

    onMount(() => {
        composition = new OGComposition(getCtx('preview'), conf.framecount)
        oComposition = composition.observable
        const promises = []
        for (const category in definitions) {
            images[category] = {}
            for (const item in definitions[category]) {
                const promise = new Promise((resolve, reject) => {
                    const thumbnail = new Image()
                    thumbnail.onload = resolve
                    thumbnail.onerror = reject
                    thumbnail.src = `./images/${category}/${item}.gif`
                }).catch(() => {})
                promises.push(promise)
                images[category][item] = new OGImage(category, item, definitions[category][item], '.png')
            }
        }
        Promise.allSettled(promises).finally(() => {
            setInterval(() => {
                frameId++
                if (frameId === conf.framecount) frameId = 0
            }, frameDelay)
            render()
            state = 'ready'
        })
    })
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
            <div><canvas id="preview" width={conf.width} height={conf.height}></canvas></div>
            <div><canvas id="generation" class="hidden" width={conf.width} height={conf.height}></canvas></div>
            {#if state === 'ready'}
                <div><button on:click={generateGif}>Generate GIF</button></div>
            {/if}
            <div>
                {#if state === 'loading'}
                    <p>Loading...</p>
                {:else if state === 'generating'}
                    <h2>Generating GIF...</h2>
                    <p>Your browser might ask you to allow pop-ups</p>
                {:else if state === 'ready'}
                    <p>{$oComposition.length} layer(s)</p>
                {/if}
            </div>
        </div>
    </div>

    {#if state === 'ready'}
        <div class="content container">
            {#each $oComposition as layerData, pos (layerData.id)}
                <div class="block">
                    <Layer
                        {composition}
                        {pos}
                        layer={layerData.layer}
                        {images}
                        {effects}
                        {layerClasses}
                    />
                </div>
            {/each}
            <div class="block">
                <button on:click={() => { composition.addLayer(new layerClasses['full-frame']['static'](), null) }}>Add a layer</button>
            </div>
        </div>
    {/if}
</main>

<style>
    main {
        display: flex;
        height: 100vh;
        width: 100vw;
    }

    .sidebar, .content {
        overflow-y: auto;
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
