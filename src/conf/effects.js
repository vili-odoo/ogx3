import { randomize, getDimensions } from '../lib/helpers.js'

const applyFilter = (ctx, f) => {
    if (ctx.filter === 'none') ctx.filter = f
    else ctx.filter = ctx.filter + ' ' + f
}

export default {
    'blurred': (ctx, t) => {
        const { w, h } = getDimensions(ctx)
        applyFilter(ctx, `blur(${Math.ceil(w / 32)}px)`)
    },
    'inverted': (ctx, t) => {
        applyFilter(ctx, `invert(1)`)
    },
    'saturated': (ctx, t) => {
        applyFilter(ctx, `saturate(4)`)
    },
    'shaking': (ctx, t) => {
        const { w, h } = getDimensions(ctx)
        const length = Math.max(w, h) / 30
        const xOffset = Math.round(length * (randomize(t, 0) - 0.5))
        const yOffset = Math.round(length * (randomize(t, 0.1) - 0.5))
        ctx.translate(xOffset, yOffset)
        ctx.translate(w / 2, h / 2)
        ctx.scale(1 + length / w, 1 + length / h)
        ctx.translate(-w / 2, -h / 2)
    },
    'rotating': (ctx, t) => {
        const { w, h } = getDimensions(ctx)
        const period = 1 / 15
        const angle = (Math.abs(t % period - period / 2) - period / 4) * (2 * Math.PI)
        ctx.translate(w / 2, h / 2)
        ctx.scale(1.5, 1.5)
        ctx.rotate(angle)
        ctx.translate(-w / 2, -h / 2)
    },
    'spinning': (ctx, t) => {
        const { w, h } = getDimensions(ctx)
        const angle = t * (2 * Math.PI)
        ctx.translate(w / 2, h / 2)
        ctx.rotate(angle)
        ctx.translate(-w / 2, -h / 2)
    },
    'zooming': (ctx, t) => {
        const { w, h } = getDimensions(ctx)
        const period = 1 / 4
        const relT = (t % period) / period
        const affectedRelT = 0.1
        let factor = 1
        if (relT < affectedRelT) {
            factor += (affectedRelT / 2 - Math.abs(relT - affectedRelT / 2)) * 3.5
        }
        ctx.translate(w / 2, h / 2)
        ctx.scale(factor, factor)
        ctx.translate(-w / 2, -h / 2)
    },
}
