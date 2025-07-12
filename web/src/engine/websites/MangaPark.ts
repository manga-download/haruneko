import { Tags } from '../Tags';
import icon from './MangaPark.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

const primaryDomain = 'mangapark.org';
const patternAliasDomains = [
    primaryDomain,
    'mangapark.net',
    'mangapark.com',
    'mangapark.me',
    'mangapark.io',
    'mangapark.to',
    'comicpark.org',
    'comicpark.to',
    'readpark.org',
    'readpark.net',
    'parkmanga.com',
    'parkmanga.net',
    'parkmanga.org',
    'mpark.to',
].join('|').replaceAll('.', '\\.');

@Common.MangaCSS(new RegExp(`^https?://(${patternAliasDomains})/title/[^/]+$`), 'h3 > a[q\\:id]')
@Common.MangasMultiPageCSS('/search?page={page}', 'h3 > a[q\\:id]')
@Common.ChaptersSinglePageCSS('div.scrollable-panel div[q\\:key] > div:first-of-type > a.link-primary[q\\:id]', (a: HTMLAnchorElement) => ({ id: a.pathname, title: a.closest('div').innerText }))
@Common.PagesSinglePageCSS('div[data-name="image-item"] img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangapark', 'MangaPark', `https://${primaryDomain}`, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(this.URI), `window.cookieStore.set('nsfw', '2');`);
    }
}