export function ChapterExtractor(element: HTMLAnchorElement) {
    const id = element.pathname + element.search;
    const title = element.childNodes[0].nodeValue.trim();
    return { id, title };
}

export function PageLinkExtractor(element: HTMLImageElement) {
    return element.dataset.src || element.dataset.original || element.dataset.echo || element.getAttribute('src');
}

export const mangaPath ='/booklist?page={page}';
export const queryMangaTitleFromURI = 'section.banner_detail div.info h1';
export const queryMangas = 'ul.mh-list li div.mh-item-detali h2.title a';
export const queryChapters = [
    'div#chapterlistload ul#detail-list-select li a',
    'div#chapterlistload ul#detail-list-select-1 li a'
].join(',');
export const queryPages = 'div.comiclist div.comicpage img';
