import { Tags } from '../Tags';
import icon from './ComicFesta.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ClipStudioReader from './decorators/ClipStudioReader';
import { FetchNextJS } from '../platform/FetchProvider';

type JSONChapters = {
    packages: {
        id: number;
        number: number;
        fairInfo: {
            free: {
                endAt: string;
                startAt: string;
            },
            trial: {
                endAt: string;
                startAt: string;
            }
        }
    }[]
};

@Common.MangaCSS(/^{origin}\/titles\/\d+/, 'section[class*="title-name-section"] h2', Common.WebsiteInfoExtractor({ queryBloat: 'span' }))
@Common.MangasNotSupported()
@ClipStudioReader.PagesSinglePageAJAX()
@ClipStudioReader.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicfesta', 'コミックフェスタ | ComicFesta', 'https://comic.iowl.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { packages } = await FetchNextJS<JSONChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'isDisplayVolumeNumber' in data);
        return packages
            .map(({ fairInfo: { trial }, id, number }) => {
                return new Chapter(this, manga, `/volumes/${id}${trial ? '/trial_download' : '/free_download'}`, `${number}`);
            });
    }
}