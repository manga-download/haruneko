//KeyoApp template : websites Similar to MagusManga, StarBoundScan, LuaScans. One page Manga list & hosting images on cdn.igniscans.com
export const pagesScript = `
	new Promise ( resolve => {
		const realUrl = document.documentElement.innerHTML.match(/realUrl\\s*=\\s*\`([^\`]+?)\\$/)[1];
		resolve( [...document.querySelectorAll('.myImage')].map(image => realUrl+ image.getAttribute('uid')+ '?c=1'));
	});
`;
export const queryMangaTitle = 'meta[property="og:title"]';
export const queryMangaPath = '/series';
export const queryManga = 'div#searched_series_page button a.grid';
export const queryChapters = 'div#chapters a';