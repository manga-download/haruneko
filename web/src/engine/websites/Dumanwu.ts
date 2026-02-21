import { Tags } from '../Tags';
import icon from './Dumanwu.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    data: {
        id: string;
        bookName: string;
    }[] | string;
};

const chapterScript = `
    new Promise(async (resolve, reject) => {
        try {
            const chapters = [...document.querySelectorAll('div.chaplist-box ul li a')].map(el => ({ id : el.pathname, title : el.text.trim()}) );
            const response = await fetch(window.location.origin+ '/morechapter', {
                method: 'POST',
                body: 'id='+ window.location.pathname.split('/').at(-2),
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            const {data} = await response.json();
            const moreChapters = Array.isArray(data) ? data.map(el =>({ id : window.location.pathname + el.chapterid+'.html', title : el.chaptername}) ) : [];
            resolve([...chapters, ...moreChapters].filter(el => el.id.startsWith(window.location.pathname)));
        } catch(error) {
            reject(error);
        }
    });
`;

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h1.banner-title')
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.chapter-img-box img')].map(img => img.dataset.src ?? img.src);`, 500)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dumanwu', 'Dumanwu', 'https://dumanwu1.com', Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (let category = 1; category <= 16; category++) {
                for (let page = 1, run = true; run; page++) {
                    const { data } = await FetchJSON<APIMangas>(new Request(new URL('/data/sort', this.URI), {
                        method: 'POST',
                        body: `s=${category}&p=${page}`,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    }));
                    const mangas = Array.isArray(data)? data.map(({ id, bookName }) => new Manga(this, provider, `/${id}/`, bookName)) : [];
                    mangas.length > 0 ? yield* mangas : run = false;
                }
            }
        }.call(this))).distinct();
    }
}