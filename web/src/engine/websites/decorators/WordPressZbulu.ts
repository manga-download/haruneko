export const queryManga = 'div.comic-info div.info h1.name';
const mangaTitleFilter = /(\s+manga|\s+webtoon|\s+others)+\s*$/gi;
const queryMangas = 'div.comics-grid div.entry div.content h3.name a';
const queryChapters = 'div#chapterList div.chapters-wrapper div.r1 h2.chap a';
export const queryPages = 'div.chapter-content-inner img';

export function MangaLabelExtractor(element: HTMLElement) {
    return element.textContent.replace(this.mangaTitleFilter, '').trim();
}

