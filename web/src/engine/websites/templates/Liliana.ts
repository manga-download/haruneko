// Seems to be based on MangaReader or MangaStream

import * as Common from '../decorators/Common';

export const mangaPath ='/all-manga/{page}/';
export const queryMangaTitleFromURI = 'div.anisc-detail .manga-name';
export const queryMangas = 'div.item div.manga-detail .manga-name a';
export const queryChapters = [
    'ul#myUL li.chapter a',
    'ul.reading-list li.reading-item a.item-link',
].join(', ');

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using a pre-defined JS script.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param path - A JS script snippet to get the relative URL for fetching the HTML fragment containing the images
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 * @param extract - A JS arrow function to extract the URL from an image element
 * @param delay - An initial delay [ms] before the pre-defined script is executed
 */
export function PagesSinglePageJS(path = `'/ajax/image/list/chap/' + CHAPTER_ID`, query = 'a.readImg img', extract = (img: HTMLImageElement) => img.src, delay = 500) {
    return Common.PagesSinglePageJS(`
        new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(${path});
                const { html } = (await response.json());
                const images = [ ...new DOMParser().parseFromString(html, 'text/html').querySelectorAll('${query}') ]
                    .sort((self, other) => (self.closest('[data-index]')?.dataset.index ?? 0) - (other.closest('[data-index]')?.dataset.index ?? 0))
                    .map(${extract});
                resolve(images);
            } catch(error) {
                reject(error);
            }
        });
    `, delay);
}