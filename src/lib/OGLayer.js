import { BehaviorSubject } from 'rxjs'

export default class {
    #effects
    #images
    #observable

    constructor() {
        this.#effects = []
        this.#images = []
        this.#observable = new BehaviorSubject(this.#getValue())
    }

    get category() {
        return null
    }

    get item() {
        return null
    }

    get effects() {
        return [ ...this.#effects ]
    }

    get images() {
        return [ ...this.#images ]
    }

    get observable() {
        return this.#observable.asObservable()
    }

    #getValue() {
        return {
            effects: this.effects,
            images: this.images,
        }
    }

    getElems(t) {
        return this.#images.map(image => image.getElem(t))
    }

    #update() {
        this.#observable.next(this.#getValue())
    }

    addEffect(effect) {
        this.#effects.push(effect)
        this.#update()
    }

    removeEffect(effect) {
        this.#effects = this.#effects.filter(e => e !== effect)
        this.#update()
    }

    addImage(image) {
        this.#images.push(image)
        this.#update()
    }

    removeImage(imageId) {
        this.#images.splice(imageId, 1)
        this.#update()
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
            for (const effect of this.#effects) effect(ctx, t)
            this.draw(ctx, t)
            ctx.restore()
        }
    }
}
