export function PagesScript(host: string = 'https://image.meowing.org/uploads/') {
    return `[ ...document.querySelectorAll('img.myImage') ].map(img => '${host}' + img.getAttribute('uid'))`;
}
export const queryMangaTitle = 'meta[property="og:title"]';
export const queryMangaPath = '/series';
export const queryManga = 'div#searched_series_page button a.grid';
export const queryChapters = 'div#chapters a';