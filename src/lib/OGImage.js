export default class {
    #category
    #item
    #definition
    #extension
    #elems
    #state
    #promise

    constructor(category, item, definition, extension) {
        this.#category = category
        this.#item = item
        this.#definition = definition
        this.#extension = extension
        this.#elems = {}
        this.#state = 'pending'
        this.#promise = Promise.resolve()
    }

    get category() {
        return this.#category
    }

    get item() {
        return this.#item
    }

    get state() {
        return this.#state
    }

    get promise() {
        return this.#promise
    }

    #getT(part) {
        if (part === '-') return 1
        return parseFloat('0.' + part)
    }

    getElem(t) {
        if (this.#state !== 'ready') return null

        const finalPart = this.#definition[this.#definition.length - 1]
        const relT = t % this.#getT(finalPart)
        for (const part of this.#definition) {
            if (relT < this.#getT(part)) return this.#elems[part]
        }
    }

    load() {
        if (this.#state !== 'pending' && this.#state !== 'errored') return this.#promise

        this.#state = 'loading'
        this.#promise = this.#promise.then(() => {
            return Promise.allSettled(
                this.#definition.map(part => (
                    new Promise((resolve, reject) => {
                        const elem = new Image()
                        this.#elems[part] = elem
                        elem.onload = resolve
                        elem.onerror = reject
                        elem.src = `./images/${this.#category}/${this.#item}/${part}${this.#extension}`
                    })
                ))
            ).then(() => {
                this.#state = 'ready'
            }).catch(() => {
                this.#elems = {}
                this.#state = 'errored'
                return Promise.reject()
            })
        })
        return this.#promise
    }
}
