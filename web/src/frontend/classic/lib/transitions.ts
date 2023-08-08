export function coinflip(node, {
    delay = 0,
    duration = 1500
}) {
    return {
        delay,
        duration,
        css: (t, u) => `
            transform: rotateY(${1 - u * 180}deg);
            opacity: ${1 - u};
        `
    };
}