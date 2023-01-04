const conf = {
    WIDTH: 512,
    HEIGHT: 256,
    FPS: 25,
    FRAMECOUNT: 100,
    DEFINITIONS: {
        'nature': {
            'galaxy': [],
        },
        'solid-colors': {
            'black': [],
            'gray-dark': [],
            'gray': [],
            'gray-light': [],
            'white': [],
            'purple-dark': [],
            'purple': [],
            'purple-light': [],
            'red-dark': [],
            'red': [],
            'red-light': [],
            'orange-dark': [],
            'orange': [],
            'orange-light': [],
            'yellow-dark': [],
            'yellow': [],
            'yellow-light': [],
            'green-dark': [],
            'green': [],
            'green-light': [],
            'teal-dark': [],
            'teal': [],
            'teal-light': [],
            'blue-dark': [],
            'blue': [],
            'blue-light': [],
            'violet-dark': [],
            'violet': [],
            'violet-light': [],
        },
        'text': {
            'mastr': [],
            'v15': [],
            'v16': [],
            'v17': [],
            'bug': [],
            'issue': [],
        },
    },
}

for (const category in conf.DEFINITIONS) {
    for (const item in conf.DEFINITIONS[category]) {
        conf.DEFINITIONS[category][item].push('-')
    }
}

export default conf
