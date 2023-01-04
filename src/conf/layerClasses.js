import { randomize } from '../lib/helpers.js'
import OGLayer from '../lib/OGLayer.js'

class OGLayerFullframe extends OGLayer {
    get category() {
        return 'full-frame'
    }
}

class OGLayerFullframeStatic extends OGLayerFullframe {
    get item() {
        return 'static'
    }

    draw(ctx, t) {
        const w = this.conf.WIDTH
        const h = this.conf.HEIGHT
        for (let imageId = 0; imageId < this.images.length; imageId++) {
            this.drawImage(ctx, t, imageId, w / 2, h / 2, w, h, 0)
        }
    }
}

class OGLayerFullframeZoom extends OGLayerFullframe {
    get item() {
        return 'zoom'
    }

    draw(ctx, t) {
        const w = this.conf.WIDTH
        const h = this.conf.HEIGHT
        for (let imageId = 0; imageId < this.images.length; imageId++) {
            this.drawImage(ctx, t, imageId, w / 2, h / 2, w * 1.5, h * 1.5, 0)
        }
    }
}

class OGLayerFullframeBlink extends OGLayerFullframe {
    get item() {
        return 'blink'
    }

    draw(ctx, t) {
        const w = this.conf.WIDTH
        const h = this.conf.HEIGHT
        const imageId = Math.floor(t * this.images.length)
        this.drawImage(ctx, t, imageId, w / 2, h / 2, w, h, 0)
    }
}

class OGLayerMini extends OGLayer {
    get category() {
        return 'mini'
    }

    drawMini(ctx, t, x, y) {
        for (let imageId = 0; imageId < this.images.length; imageId++) {
            const w = this.conf.WIDTH
            const h = this.conf.HEIGHT
            this.drawImage(ctx, t, imageId, x * w / 2 + w / 4, y * h / 2 + h / 4, w / 2, h / 2, 0)
        }
    }
}

class OGLayerMiniCenter extends OGLayerMini {
    get item() {
        return 'center'
    }

    draw(ctx, t) {
        this.drawMini(ctx, t, 0.5, 0.5)
    }
}

class OGLayerMiniBottom extends OGLayerMini {
    get item() {
        return 'bottom'
    }

    draw(ctx, t) {
        this.drawMini(ctx, t, 0.5, 1)
    }
}

class OGLayerMiniTopleft extends OGLayerMini {
    get item() {
        return 'top-left'
    }

    draw(ctx, t) {
        this.drawMini(ctx, t, 0, 0)
    }
}

class OGLayerMiniTopright extends OGLayerMini {
    get item() {
        return 'top-right'
    }

    draw(ctx, t) {
        this.drawMini(ctx, t, 1, 0)
    }
}

class OGLayerMiniBottomright extends OGLayerMini {
    get item() {
        return 'bottom-right'
    }

    draw(ctx, t) {
        this.drawMini(ctx, t, 1, 1)
    }
}

class OGLayerMiniBottomleft extends OGLayerMini {
    get item() {
        return 'bottom-left'
    }

    draw(ctx, t) {
        this.drawMini(ctx, t, 0, 1)
    }
}

class OGLayerStrip extends OGLayer {
    get category() {
        return 'strip'
    }

    getLengths(count) {
        const w = this.conf.WIDTH
        const h = this.conf.HEIGHT
        const squareSide = Math.min(w / count, h)
        const width = squareSide * w / h
        const height = squareSide
        const x = (w - squareSide * count) / 2 + squareSide / 2
        const y = h / 2
        return { x, y, width, height }
    }
}

class OGLayerStripStatic extends OGLayerStrip {
    get item() {
        return 'static'
    }

    draw(ctx, t) {
        const { x, y, width, height } = this.getLengths(this.images.length)
        for (let imageId = 0; imageId < this.images.length; imageId++) {
            this.drawImage(ctx, t, imageId, x + imageId * height, y, width, height, 0)
        }
    }
}

class OGLayerStripWindow extends OGLayerStrip {
    get item() {
        return 'window'
    }

    draw(ctx, t) {
        const period = 1 / 3
        const relT = (t % period) / period
        const count = this.images.length
        const windowCount = Math.min((
            count < 4 ? 1 : (count < 6 ? 2 : 3)
        ), count)
        const firstImageId = Math.floor(count * relT)
        const lastImageId = firstImageId + windowCount
        const { x, y, width, height } = this.getLengths(count)
        for (let imageId = 0; imageId < count; imageId++) {
            if (
                (imageId >= firstImageId && imageId < lastImageId)
                || (lastImageId > count && imageId < lastImageId % count)
            ) {
                this.drawImage(ctx, t, imageId, x + imageId * height, y, width, height, 0)
            }
        }
    }
}

class OGLayerStripSlide extends OGLayerStrip {
    get item() {
        return 'slide'
    }

    draw(ctx, t) {
        const w = this.conf.WIDTH
        const { x, y, width, height } = this.getLengths(this.images.length)
        for (let i = 0; i < 3; i++) {
            for (let imageId = 0; imageId < this.images.length; imageId++) {
                const adjustedX = x + height * (imageId - 0.5) + w * (i - t)
                this.drawImage(ctx, t, imageId, adjustedX, y, width, height, 0)
            }
        }
    }
}

class OGLayerCounter extends OGLayer {
    get category() {
        return 'counter'
    }

    getRepetitions(count) {
        return Math.max(2, 6 - count)
    }

    getNewT(t, multiplier) {
        return (t * multiplier) % 1
    }
}

class OGLayerCounterIncrease extends OGLayerCounter {
    get item() {
        return 'increase'
    }

    draw(ctx, t) {
        const width = this.conf.WIDTH / 4
        const height = this.conf.HEIGHT / 4
        const repetitions = this.getRepetitions(this.images.length)
        for (let counterId = 0; counterId < 3; counterId++) {
            const x = counterId * width + width / 2
            const newT = this.getNewT(t, Math.pow(4, counterId))
            for (let i = 0; i < repetitions; i++) {
                const offset = (i - newT) * height * this.images.length
                for (let imageId = 0; imageId < this.images.length; imageId++) {
                    const y = height * imageId + offset + height / 2
                    this.drawImage(ctx, t, imageId, x, y, width, height, 0)
                }
            }
        }
    }
}

class OGLayerCounterSlotmachine extends OGLayerCounter {
    get item() {
        return 'slot-machine'
    }

    draw(ctx, t) {
        const width = this.conf.WIDTH / 4
        const height = this.conf.HEIGHT / 4
        const repetitions = 1 + this.getRepetitions(this.images.length)
        for (let counterId = 0; counterId < 3; counterId++) {
            const peakT = 0.15
            const peakSpeed = 2 * [ 5, 7, 4 ][counterId] - 1
            const speed = (
                t < peakT
                ? 1 + (peakSpeed - 1) * t / peakT
                : peakSpeed - (peakSpeed - 1) * (t - peakT) / (1 - peakT)
            )
            const adjustedT = (
                t < peakT
                ? t * (1 + (speed - 1) / 2)
                : peakT * (1 + (peakSpeed - 1) / 2) + (t - peakT) * (speed + (peakSpeed - speed) / 2)
            )
            const newT = this.getNewT(adjustedT, Math.max(1, 3 - Math.floor(this.images.length / 2)))
            const x = counterId * width + width / 2
            for (let i = 0; i < repetitions; i++) {
                const blocksCount = i - repetitions + (this.images.length < 3 ? 4 : 2)
                for (let imageId = 0; imageId < this.images.length; imageId++) {
                    const y = height * ((imageId + 1.5) + this.images.length * (blocksCount - newT)) + height / 2
                    this.drawImage(ctx, t, imageId, x, y, width, height, 0)
                }
            }
        }
    }
}

class OGLayerParticle extends OGLayer {
    get category() {
        return 'particle'
    }

    calculateCoords(initialX, initialY, initialH, initialV, t, gravity) {
        const x = initialX + t * initialH
        const v = initialV - t * gravity
        let y = initialY
        if (v >= 0) y -= t * (v + (initialV - v) / 2)
        else if (initialV >= 0) y -= initialV * initialV / gravity / 2 + (t - initialV / gravity) * v / 2
        else y -= t * (initialV - (initialV - v) / 2)
        return { x, y }
    }
}

class OGLayerParticleExplosion extends OGLayerParticle {
    get item() {
        return 'explosion'
    }

    draw(ctx, t) {
        const scale = 0.25
        const width = this.conf.WIDTH * scale
        const height = this.conf.HEIGHT * scale
        const startT = 0.7
        const particlesPerImage = Math.ceil(400 / this.images.length)
        for (let i = 0; i < particlesPerImage; i++) {
            for (let imageId = 0; imageId < this.images.length; imageId++) {
                ctx.save()
                let x = this.conf.WIDTH / 2
                let y = this.conf.HEIGHT * 3 / 4
                let rotation = 0
                if (t >= startT) {
                    const particleValue = (i + imageId / this.images.length) / particlesPerImage
                    const angle = (2 * Math.PI) * (0.5 * randomize(particleValue, 0) + (randomize(particleValue, 0.1) < 0.7 ? 0 : 0.5))
                    const v = 1.0 + 4.0 * randomize(particleValue, 0.2)
                    const horV = Math.cos(angle) * v
                    const verV = Math.sin(angle) * v
                    const relT = (t - startT) / (1 - startT)
                    const coords = this.calculateCoords(x / this.conf.WIDTH, y / this.conf.HEIGHT, horV, verV, relT, 1.8)
                    x = coords.x * this.conf.WIDTH
                    y = coords.y * this.conf.HEIGHT
                    rotation += (2 * Math.PI) * relT * 1.2 * (randomize(particleValue, 0.3) - 0.5)
                }
                this.drawImage(ctx, t, imageId, x, y, width, height, rotation)
                ctx.restore()
            }
        }
    }
}

class OGLayerParticleConfetti extends OGLayerParticle {
    get item() {
        return 'confetti'
    }

    draw(ctx, t) {
        const scale = 0.25
        const width = this.conf.WIDTH * scale
        const height = this.conf.HEIGHT * scale
        const particlesPerImage = Math.ceil(400 / this.images.length)
        for (let i = 0; i < particlesPerImage; i++) {
            for (let imageId = 0; imageId < this.images.length; imageId++) {
                ctx.save()
                const particleValue = (i + imageId / this.images.length) / particlesPerImage
                let x = this.conf.WIDTH * (0.4 + 0.2 * randomize(particleValue, 0))
                let y = this.conf.HEIGHT * (1 + 5 * randomize(particleValue, 0.1))
                let rotation = 0
                const horV = 7 * (randomize(particleValue, 0.2) - 0.5)
                const verV = 25 + 10 * randomize(particleValue, 0.3)
                const coords = this.calculateCoords(x / this.conf.WIDTH, y / this.conf.HEIGHT, horV, verV, t, 80)
                x = coords.x * this.conf.WIDTH
                y = coords.y * this.conf.HEIGHT
                rotation += (2 * Math.PI) * t * 3 * (randomize(particleValue, 0.4) - 0.5)
                this.drawImage(ctx, t, imageId, x, y, width, height, rotation)
                ctx.restore()
            }
        }
    }
}

const classesToExport = [
    OGLayerFullframeStatic,
    OGLayerFullframeZoom,
    OGLayerFullframeBlink,

    OGLayerMiniCenter,
    OGLayerMiniBottom,
    OGLayerMiniTopleft,
    OGLayerMiniTopright,
    OGLayerMiniBottomright,
    OGLayerMiniBottomleft,

    OGLayerStripStatic,
    OGLayerStripWindow,
    OGLayerStripSlide,

    OGLayerCounterIncrease,
    OGLayerCounterSlotmachine,

    OGLayerParticleExplosion,
    OGLayerParticleConfetti,
]

const obj = {}
for (const cls of classesToExport) {
    const l = new cls({})
    if (!(l.category in obj)) obj[l.category] = {}
    obj[l.category][l.item] = cls
}
export default obj
