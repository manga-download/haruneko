import { readable } from 'svelte/store';

export type DocCategory = {
    name: string;
    description: HTMLElement;
    sections: DocSection[];
}
export type DocSection = {
    name: string,
    content: HTMLElement
}

export const documentation = readable<DocCategory[]>([], (set) => {
    const url = 'https://hakuneko.download/docs/haruneko/';
    // TODO Documentation should be cached using a service worker
    (async () => {
        const cacheKey = `cache:documentation`;
        const cacheTimestamp = localStorage.getItem(`${cacheKey}:timestamp`);
        if (cacheTimestamp) {
            const timestamp = parseInt(cacheTimestamp);
            const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
            const currentTime = Date.now();
            if (currentTime - timestamp > oneWeek) {
                localStorage.removeItem(cacheKey);
                localStorage.removeItem(`${cacheKey}:timestamp`);
            }
        }
        let content = localStorage.getItem(cacheKey);
        if (!content?.length) {
            const response = await fetch(url);
            const text = await response.text();
            localStorage.setItem(cacheKey, text);
            localStorage.setItem(`${cacheKey}:timestamp`, Date.now().toString());
            content = text;
        }
        const parser = new DOMParser();
        const html = parser.parseFromString(content, 'text/html');
        const main = html.querySelector('section');
        const categories: DocCategory[] = [];
        if (main) {
            const images = main.querySelectorAll('img');
            images.forEach((image) => {
                const src = image.getAttribute('src');
                if (src && !src.startsWith('http')) {
                    const urlObj = new URL(url);
                    const baseUrl = urlObj.protocol + '//' + urlObj.host;
                    image.setAttribute('src', baseUrl + src);
                }
            });
            //TODO replace DOM parsing with markdown analysis (would require a markdown parser)
            const h2Elements = main.querySelectorAll('h2');
            h2Elements.forEach((h2) => {
                const sections: DocSection[] = [];
                const categoryDescription = slideElement(h2, ['H2', 'H3']);
                const categorySlide = slideElement(h2, ['H2']);
                categorySlide.querySelectorAll('h3').forEach((h3) => {
                    const sectionSlide = slideElement(h3, ['H3']);
                    sections.push({ name: h3.textContent || '', content: sectionSlide });
                });
                categories.push({ name: h2.textContent || '', description: categoryDescription, sections: sections });
            });
        }
        set(categories);
    })();
});

/**
 * Creates a slide section by extracting HTML elements from the given content element until a specified split element is encountered.
 * @param content - The content element from which to extract the slide section.
 * @param split - The element name at which to stop extracting and split the slide section.
 * @returns The created slide section element.
 */
function slideElement(content: HTMLElement, split: string[]) : HTMLElement {
    const slide = document.createElement("div");
    let nextSibling = content.nextSibling;
    while (nextSibling && !split.includes(nextSibling.nodeName)) {
        slide.appendChild(nextSibling.cloneNode(true));
        nextSibling = nextSibling.nextSibling;
    }
    return slide;
}