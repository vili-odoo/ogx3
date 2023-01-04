export default class {
    #conf
    #effects
    #images

    constructor(conf) {
        this.#conf = conf
        this.#effects = []
        this.#images = []
    }

    get category() {
        return null
    }

    get item() {
        return null
    }

    get conf() {
        return this.#conf
    }

    get effects() {
        return [ ...this.#effects ]
    }

    get images() {
        return [ ...this.#images ]
    }

    getElems(t) {
        return this.#images.map(image => image.getElem(t))
    }

    addEffect(effect) {
        this.#effects.push(effect)
    }

    removeEffect(effect) {
        this.#effects = this.#effects.filter(e => e !== effect)
    }

    addImage(image) {
        this.#images.push(image)
    }

    removeImage(imageId) {
        this.#images.splice(imageId, 1)
    }

    draw(ctx, t) {
    }

    drawImage(ctx, t, imageId, x, y, width, height, rotation) {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rotation)
        ctx.drawImage(this.#images[imageId].getElem(t), -width / 2, -height / 2, width, height)
        ctx.restore()
    }

    paint(ctx, t) {
        if (this.#images.length > 0) {
            ctx.save()
            for (const effect of this.#effects) effect(ctx, t, this.conf)
            this.draw(ctx, t)
            ctx.restore()
        }
    }
}
