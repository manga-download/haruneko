import { Tags } from '../Tags';
import icon from './MangAs.webp';
import { DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';
import { RateLimit } from '../taskpool/RateLimit';
import { Numeric } from '../SettingsManager';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import type { Priority } from '../taskpool/TaskPool';

const chapterScript = `
    new Promise((resolve, reject) => {
        const path = window.location.pathname +'/';
        resolve(jschaptertemp.map(chapter =>  { 
            return {
                id : path + chapter.slug,
                title : chapter.number + ' : ' + chapter.name.trim() 
            }}));
    });
`;

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('img').getAttribute('title').trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, MangaReader.queryMangaTitle)
@Common.MangasMultiPageCSS('/filterList?page={page}&sortBy=name', 'div.media a.thumbnail', 1, 1, 500, MangaExtractor )
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageCSS(MangaReader.queryPages, MangaReader.ChapterPageExtractor)

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangas', `MangAs`, 'https://mangas.in', Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
        this.Settings.throttle = new Numeric('throttle.images', R.Plugin_Settings_ThrottlingInteraction, R.Plugin_Settings_ThrottlingInteractionInfo, 4, 1, 60);
        this.Settings.throttle.ValueChanged.Subscribe((_, value: number) => this.imageTaskPool.RateLimit = new RateLimit(value, 5));
        this.imageTaskPool.RateLimit = new RateLimit(this.Settings.throttle.value as number, 5);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const server1 = 's1.mangas.in/uploads/manga';
        const server2 = 's2.mangas.in/uploads/manga';
        const blob = await Common.FetchImageElement.call(this, page, priority, signal, true, true);
        if (blob.type.startsWith('image/')) return blob;
        page.Link.href = page.Link.href.includes(server1) ? page.Link.href.replace(server1, server2) : page.Link.href.replace(server2, server1);
        return Common.FetchImageElement.call(this, page, priority, signal, true, true);
    }
}
