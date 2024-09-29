//KeyoApp template : websites Similar to MagusManga, StarBoundScan, LuaScans. One page Manga list & hosting images on cdn.igniscans.com
export const pagesScript = `
	new Promise ( resolve => resolve( [...document.querySelectorAll('.myImage')].map(image => 'https://cdn.igniscans.com/uploads/'+ image.getAttribute('uid'))));
`;
export const queryMangaTitle = 'meta[property="og:title"]';
export const queryMangaPath = '/series';
export const queryManga = 'div#searched_series_page button a.grid';
export const queryChapters = 'div#chapters a';