import { Tags } from '../Tags';
import icon from './Akuma.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `
    new Promise( (resolve, reject) => {
        const url = window.location.href.replace(/\\/1$/, '');
        const token = document.querySelector('meta[name="csrf-token"]').content.trim();
        fetch(url, {
            credentials: 'include',
            headers: {
                'X-CSRF-TOKEN': token,
                'X-Requested-With': 'XMLHttpRequest',

            },
            method: 'POST',
        }).then(response => response.json()
            .then(data => resolve(data.map(image => img_prt + '/' + image)))
            .catch(error => reject(error))
        )
        .catch(error => reject(error));
    });
 `;

@Common.MangaCSS(/^{origin}\/g\/[^/]+$/, 'h1.entry-title')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('akuma', 'Akuma.moe', 'https://akuma.moe', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return (await FetchWindowScript<string[]>(new Request(new URL(`${chapter.Identifier}/1`, this.URI)), pageScript)).map(image => new Page(this, chapter, new URL(image)));
    }

}