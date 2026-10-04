(() => {
    const elements = [...document.querySelectorAll('[data-post-body]')];
    return elements.reduce((accumulator, element) => {
        const doc = new DOMParser().parseFromString(JSON.parse(`"${element.dataset.postBody}"`), 'text/html');
        const imageData = doc.querySelector('script')?.textContent?.match(/\[(?:\s*"https?:\/\/[^"]+"\s*,?)+\]/)?.at(0);
        const images = imageData ? JSON.parse(imageData) : [...doc.querySelectorAll('img')].map(img => img.src);
        accumulator.push(...images.map(image => image.replace(/\/s\d+[^/]*\//, '/s0/')));
        return accumulator;
    }, []);
})();