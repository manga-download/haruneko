import { Tags } from '../Tags';
import icon from './EternalMangas.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type JSONManga = {
    id: number,
    name: string,
    slug: string
}

@Common.MangaCSS(/^{origin}\/ver\/[^/]+$/, 'meta[property="og:title"]')
@Common.ChaptersSinglePageCSS('div[class*="infoProject_divListChapter"] a[class*="infoProject_divChapter"]', Common.AnchorInfoExtractor(false, 'span:not([class*="infoProject_numChapter"])'))
@Common.PagesSinglePageCSS('main.read img[class*="readChapter_image"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('eternalmangas', 'Eternal Mangas', 'https://eternalmangas.com', Tags.Media.Manhwa, Tags.Media.Novel, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL('./comics', this.URI)), 'script:not([src])');
        const mangas = this.ExtractData<JSONManga[]>(scripts, 'project_id', 'aea');
        return mangas.map(manga => new Manga(this, provider, `/ver/${manga.slug}`, manga.name));
    }

    private ExtractData<T>(scripts: HTMLScriptElement[], scriptMatcher: string, keyName: string): T {
        const script = scripts.map(script => script.text).find(text => text.includes(scriptMatcher) && text.includes(keyName));
        const content = JSON.parse(script.substring(script.indexOf(',"') + 1, script.length - 2)) as string;
        const record = JSON.parse(content.substring(content.indexOf(':') + 1)) as JSONObject;

        return (function FindValueForKeyName(parent: JSONElement): JSONElement {
            if (parent[keyName]) {
                return parent[keyName];
            }
            for (const child of (Object.values(parent) as JSONElement[]).filter(value => value && typeof value === 'object')) {
                const result = FindValueForKeyName(child);
                if (result) {
                    return result;
                }
            }
            return undefined;
        })(record) as T;
    }
}