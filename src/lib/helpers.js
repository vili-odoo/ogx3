export const randomize = (value, seed) => {
    return (Math.pow(value + seed / 3, 5) * 123456789) % 1
}

export const pickKey = obj => {
    const keys = Object.keys(obj)
    return keys[Math.floor(Math.random() * keys.length)]
}

export const getCtx = (canvasId, attrs) => {
    return document.getElementById(canvasId).getContext('2d', {
        alpha: false,
        ...attrs,
    })
}

export const getDimensions = ctx => {
    return { w: ctx.canvas.width, h: ctx.canvas.height }
}
