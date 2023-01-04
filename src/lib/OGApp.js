import { pickKey, getCtx } from './helpers.js'
import OGImage from './OGImage.js'

export default class {
    #conf
    #images
    #layers
    #previewFrameId

    constructor(conf) {
        this.#conf = conf
        this.#images = {}
        this.#layers = []
        this.#previewFrameId = 0

        for (const category in this.#conf.DEFINITIONS) {
            this.#images[category] = {}
            for (const item in this.#conf.DEFINITIONS[category]) {
                this.#images[category][item] = null
            }
        }
    }

    get #frameDelay() {
        return Math.ceil(1000 / this.#conf.FPS)
    }

    get layers() {
        return [ ...this.#layers ]
    }

    getImage(category, item) {
        return this.#images[category][item]
    }

    #paintFrame(ctx, frameId) {
        ctx.clearRect(0, 0, this.#conf.WIDTH, this.#conf.HEIGHT)
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, this.#conf.WIDTH, this.#conf.HEIGHT)
        for (const layer of this.#layers) {
            layer.paint(ctx, frameId / this.#conf.FRAMECOUNT)
        }
    }

    #preview() {
        this.#paintFrame(getCtx('preview'), this.#previewFrameId)
        this.#previewFrameId++
        if (this.#previewFrameId === this.#conf.FRAMECOUNT) {
            this.#previewFrameId = 0
        }
    }

    init() {
        const thumbnailPromises = []
        for (const category in this.#conf.DEFINITIONS) {
            for (const item in this.#conf.DEFINITIONS[category]) {
                const promise = new Promise((resolve, reject) => {
                    const thumb = new Image()
                    thumb.onload = resolve
                    thumb.onerror = reject
                    thumb.src = `./images/${category}/${item}.gif`
                }).catch(() => {})
                thumbnailPromises.push(promise)
            }
        }
        return Promise.all(thumbnailPromises).then(() => {
            setInterval(() => window.requestAnimationFrame(this.#preview.bind(this)), this.#frameDelay)
        })
    }

    loadImage(category, item, extension) {
        let image = this.getImage(category, item)
        if (image !== null) return image.loadPromise
        image = new OGImage(this.#conf, category, item, extension)
        this.#images[category][item] = image
        return image.load().catch(() => {
            this.#images[category][item] = null
            return Promise.reject()
        })
    }

    addLayer(layerClass, layerToReplace) {
        const layer = new layerClass({ ... this.#conf })
        if (layerToReplace === null) {
            this.#layers.push(layer)
            const c = pickKey(this.#conf.DEFINITIONS)
            const i = pickKey(this.#conf.DEFINITIONS[c])
            return this.loadImage(c, i, '.png').then(() => {
                layer.addImage(this.getImage(c, i))
            }).catch(() => {})
        }
        this.#layers[this.#layers.indexOf(layerToReplace)] = layer
        for (const effect of layerToReplace.effects) layer.addEffect(effect)
        for (const image of layerToReplace.images) layer.addImage(image)
        return Promise.resolve()
    }

    removeLayer(layer) {
        this.#layers = this.#layers.filter(l => l !== layer)
    }

    moveLayer(layer, up) {
        const layerId = this.#layers.indexOf(layer)
        const otherLayerId = layerId + (up ? 1 : -1)
        this.#layers[layerId] = this.#layers[otherLayerId]
        this.#layers[otherLayerId] = layer
    }

    generateGif() {
        const gif = new GIF({ width: this.#conf.WIDTH, height: this.#conf.HEIGHT })
        const ctx = getCtx('generate')
        for (let i = 0; i < this.#conf.FRAMECOUNT; i++) {
            this.#paintFrame(ctx, i)
            gif.addFrame(ctx, { copy: true, delay: this.#frameDelay })
        }
        gif.on('finished', blob => window.open(URL.createObjectURL(blob)))
        gif.render()
    }
}
