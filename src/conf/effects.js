import { randomize } from '../lib/helpers.js'

const applyFilter = (ctx, f) => {
    if (ctx.filter === 'none') ctx.filter = f
    else ctx.filter = ctx.filter + ' ' + f
}

export default {
    'blurred': (ctx, t, conf) => {
        applyFilter(ctx, `blur(${Math.ceil(conf.WIDTH / 32)}px)`)
    },
    'inverted': (ctx, t, conf) => {
        applyFilter(ctx, `invert(1)`)
    },
    'saturated': (ctx, t, conf) => {
        applyFilter(ctx, `saturate(8)`)
    },
    'shaking': (ctx, t, conf) => {
        const length = Math.max(conf.WIDTH, conf.HEIGHT) / 30
        const xOffset = Math.round(length * (randomize(t, 0) - 0.5))
        const yOffset = Math.round(length * (randomize(t, 0.1) - 0.5))
        ctx.translate(xOffset, yOffset)
        ctx.translate(conf.WIDTH / 2, conf.HEIGHT / 2)
        ctx.scale(1 + length / conf.WIDTH, 1 + length / conf.HEIGHT)
        ctx.translate(-conf.WIDTH / 2, -conf.HEIGHT / 2)
    },
    'rotating': (ctx, t, conf) => {
        const period = 1 / 15
        const angle = (Math.abs(t % period - period / 2) - period / 4) * (2 * Math.PI)
        ctx.translate(conf.WIDTH / 2, conf.HEIGHT / 2)
        ctx.scale(1.5, 1.5)
        ctx.rotate(angle)
        ctx.translate(-conf.WIDTH / 2, -conf.HEIGHT / 2)
    },
    'spinning': (ctx, t, conf) => {
        const angle = t * (2 * Math.PI)
        ctx.translate(conf.WIDTH / 2, conf.HEIGHT / 2)
        ctx.rotate(angle)
        ctx.translate(-conf.WIDTH / 2, -conf.HEIGHT / 2)
    },
    'zooming': (ctx, t, conf) => {
        const period = 1 / 4
        const relT = (t % period) / period
        const affectedRelT = 0.1
        let factor = 1
        if (relT < affectedRelT) {
            factor += (affectedRelT / 2 - Math.abs(relT - affectedRelT / 2)) * 3.5
        }
        ctx.translate(conf.WIDTH / 2, conf.HEIGHT / 2)
        ctx.scale(factor, factor)
        ctx.translate(-conf.WIDTH / 2, -conf.HEIGHT / 2)
    },
}
