import { Tags } from '../Tags';
import icon from './ManmanApp.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIChapter = {
    code: number;
    data: {
        id: string;
        title: string;
    }[]
};

@Common.MangaCSS(/^{origin}\/comic-[\d]+\.html$/, 'div.cartoon li.title', Common.WebsiteInfoExtractor({ queryBloat: 'span' }))
@Common.MangasMultiPageCSS('div.classification li.title a', Common.PatternLinkGenerator('/comic/category_{page}.html'))
@Common.PagesSinglePageCSS('img.man_img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manmanapp', `Manman Comic 漫漫漫画`, 'https://www.manmanapp.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = manga.Identifier.match(/(\d+).html/).at(1);
        // Website api is crappy. It returns only a few page of chapters before stopping.
        // To get most chapters we must loop FORWARD and BACKWARD :/
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (const sort of ['0', '1']) {
                for (let page = 1, run = true; run; page++) {
                    const { code, data } = await FetchJSON<APIChapter>(new Request(new URL('/works/comic-list-ajax.html', this.URI), {
                        method: 'POST',
                        body: new URLSearchParams({ id: mangaId, sort, page: `${page}` }).toString(),
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                        }
                    }));
                    const chapters = code == 1 ? data.map(({ id, title }) => new Chapter(this, manga, `/comic/detail-${id}.html`, title.trim())) : [];
                    chapters.length > 0 ? yield* chapters : run = false;
                }
            }
        }.call(this))).sort((self, other) => other.Identifier.localeCompare(self.Identifier)).distinct();
    }
}