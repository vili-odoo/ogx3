export default class {
    #conf
    #category
    #item
    #extension
    #elems
    #loadPromise

    constructor(conf, category, item, extension) {
        this.#conf = conf
        this.#category = category
        this.#item = item
        this.#extension = extension
        this.#elems = {}
        this.#loadPromise = null
    }

    get #definition() {
        return this.#conf.DEFINITIONS[this.#category][this.#item]
    }

    get category() {
        return this.#category
    }

    get item() {
        return this.#item
    }

    get loadPromise() {
        return this.#loadPromise
    }

    getElem(t) {
        for (const part of this.#definition) {
            if (part === '-' || t <= parseFloat('0.' + part)) return this.#elems[part]
        }
    }

    load() {
        this.#loadPromise = Promise.all(this.#definition.map(part => (
            new Promise((resolve, reject) => {
                const elem = new Image()
                this.#elems[part] = elem
                elem.onload = resolve
                elem.onerror = reject
                elem.src = `./images/${this.#category}/${this.#item}/${part}${this.#extension}`
            })
        )))
        return this.#loadPromise
    }
}
