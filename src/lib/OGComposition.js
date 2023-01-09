import { BehaviorSubject } from 'rxjs'

export default class {
    #sourceCtx
    #ctx
    #frameCount
    #layersData
    #observable

    constructor(ctx, frameCount) {
        const threshold = 256
        const w = ctx.canvas.width
        const h = ctx.canvas.height
        if (w < threshold || h < threshold) {
            let sourceWidth = w
            let sourceHeight = h
            if (w < h) {
                sourceWidth = threshold
                sourceHeight = Math.round(threshold * h / w)
            } else {
                sourceWidth = Math.round(threshold * w / h)
                sourceHeight = threshold
            }
            this.#sourceCtx = (new OffscreenCanvas(sourceWidth, sourceHeight)).getContext('2d')
        } else {
            this.#sourceCtx = null
        }

        this.#ctx = ctx
        this.#frameCount = frameCount
        this.#layersData = []
        this.#observable = new BehaviorSubject(this.#getValue())
    }

    get layersData() {
        return [ ...this.#layersData ]
    }

    get observable() {
        return this.#observable.asObservable()
    }

    #getValue() {
        return this.layersData
    }

    #update() {
        this.#observable.next(this.#getValue())
    }

    render(frameId) {
        const ctx = (this.#sourceCtx !== null ? this.#sourceCtx : this.#ctx)

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        for (const layerData of this.#layersData) {
            layerData.layer.paint(ctx, frameId / this.#frameCount)
        }

        if (this.#sourceCtx !== null) {
            this.#ctx.drawImage(this.#sourceCtx.canvas, 0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height)
        }
    }

    addLayer(layer, layerToReplace) {
        if (layerToReplace === null) {
            let id = 1 + Math.max(-1, ...this.#layersData.map(layerData => layerData.id))
            this.#layersData.push({ id, layer })
        } else {
            const pos = this.#layersData.map(layerData => layerData.layer).indexOf(layerToReplace)
            this.#layersData[pos].layer = layer
            for (const effect of layerToReplace.effects) layer.addEffect(effect)
            for (const image of layerToReplace.images) layer.addImage(image)
        }
        this.#update()
    }

    removeLayer(layer) {
        this.#layersData = this.#layersData.filter(layerData => layerData.layer !== layer)
        this.#update()
    }

    moveLayer(layer, up) {
        const pos = this.#layersData.map(layerData => layerData.layer).indexOf(layer)
        const otherPos = pos + (up ? 1 : -1)
        const layerData = this.#layersData[pos]
        this.#layersData[pos] = this.#layersData[otherPos]
        this.#layersData[otherPos] = layerData
        this.#update()
    }
}
