export const pagesScript = `
	new Promise ( resolve => {
		resolve( [...document.querySelectorAll('.myImage')].map(image => {
			 return 'https://image.meowing.org/uploads/'+ image.getAttribute('uid');
	    }));
	});
`;
export const queryMangaTitle = 'meta[property="og:title"]';
export const queryMangaPath = '/series';
export const queryManga = 'div#searched_series_page button a.grid';
export const queryChapters = 'div#chapters a';