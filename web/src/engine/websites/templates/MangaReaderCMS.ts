// https://themesia.com/mangareader-wordpress-theme/
// NOTE: Newer versions of this theme are nearly identical (stolen) to the MangaStream theme

export const queryManga = 'h2.widget-title';
export const queryMangas = 'ul.manga-list li a';
export const patternMangas = '/changeMangaList?type=text';
export const queryChapters = 'ul.chapters li h5';
export const queryPages = 'div#all img.img-responsive';

export function ChapterInfoExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a:last-of-type').pathname,
        title: element.innerText.replace(/[:⠇]?\s*$/, '').trim(),
    };
}