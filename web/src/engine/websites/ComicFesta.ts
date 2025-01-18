import { Tags } from '../Tags';
import icon from './ComicFesta.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ClipStudioReader from './decorators/ClipStudioReader';
import { FetchCSS } from '../platform/FetchProvider';

type JSONChapters = {
    packages: {
        id: number,
        number: number,
        fairInfo : {
            free: {
                endAt: string,
                startAt: string
            },
            trial: {
                endAt: string,
                startAt: string
            }
        }
    }[]
}

@Common.MangaCSS(/^{origin}\/titles\/\d+/, 'section[class*="title-name-section_section__"] h2', Common.ElementLabelExtractor('span'))
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
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(manga.Identifier, this.URI)), 'script:not([src])');
        const { packages } = this.FindJSONObject<JSONChapters>(scripts, /isDisplayVolumeNumber/, 'isDisplayVolumeNumber');
        return packages
            .map(chapter => {
                const suffix = chapter.fairInfo.trial ? '/trial_download' : '/free_download';
                return new Chapter(this, manga, `/volumes/${chapter.id}${suffix}`, chapter.number.toString());
            });
    }

    private FindJSONObject<T>(scripts: HTMLScriptElement[], scriptRegex: RegExp, keyName: string, currentElement = undefined): T {

        if (scripts && scriptRegex) {
            const script = scripts.find(script => scriptRegex.test(script.text))?.text;
            if (!script) return undefined;
            //script are like self.__next_f.push([1,"
            const json = JSON.parse(script.substring(script.indexOf(',"') + 1, script.length - 2));// to remove trailing )]
            currentElement = JSON.parse(json.substring(json.indexOf(':') + 1));
            return this.FindJSONObject<T>(undefined, undefined, keyName, currentElement);
        }

        if (!currentElement) return undefined;
        if (currentElement[keyName]) {
            return currentElement;
        }
        let result = undefined;
        for (let i in currentElement) {
            if (result) break;
            if (typeof currentElement[i] === 'object')
                result = result ?? this.FindJSONObject<T>(undefined, undefined, keyName, currentElement[i]);
        }
        return result as T;
    }
}