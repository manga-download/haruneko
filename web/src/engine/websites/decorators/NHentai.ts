import { type MangaScraper, type Manga, Chapter } from '../../providers/MangaPlugin';
import * as Common from './Common';

/*
https://8muses.uk/
https://9hentai.uk/
https://9hentai.us/
https://doujin.uk/
https://doujindesu.uk/
https://doujins.cc/
https://doujins.uk/
https://doujinshi.uk/
https://hentai2read.xyz/
https://hentaifox.cc/
https://hitomi.vip/
https://hitomila.xyz/
https://nhentai.uk/
https://porncomics.uk/
*/

export const queryMangaTitle = 'div#info-block div#info .title';

export const pageScript = `
    new Promise((resolve) => {
        try {
            const pages = reader.gallery.images.pages.map((currElement, index) => {
                return reader.get_image_url(index+1);
            });
            resolve(pages);
        } catch(error) {}

        try {
            preloadImage(1, numberOfPages * 2); //preloadImage only prepare half of pictures, so here is a little trick
            resolve(images.map(image => image.getAttribute('src')).filter(image => image));
        } catch(error) {}

       try {
            resolve(reader.gallery.images.pages.map(page => page.url()) );
        } catch(error) {}
    }); 
`;

/**
* A class decorator that adds the ability to create a chapter from a manga (Same identifier with /1 appended, same title).
* This is useful when website doesnt have the notion of chapter or images are directly on chapter page (most likely for X-rated websites)
*/
export function ChaptersUniqueFromManga() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return [new Chapter(this, manga, `${manga.Identifier}/1`, manga.Title)];
            }
        };
    };
}