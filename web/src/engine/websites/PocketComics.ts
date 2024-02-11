import { Tags } from '../Tags';
import icon from './PocketComics.webp';
import { Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import Comico, { type APIResult, type ApiChapters } from './Comico';
import { Choice } from '../SettingsManager';
import { WebsiteResourceKey as W, TagResourceKey as T } from '../../i18n/ILocale';
import { Exception } from '../Error';

@Common.ImageAjax()
export default class extends Comico {
    public constructor() {
        super('pocketcomics', `Pocket-Comics (コミコ)`, 'https://www.pocketcomics.com', [Tags.Language.French, Tags.Language.English, Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Official]);

        this.api = 'https://api.pocketcomics.com';
        this.Settings.language = new Choice('language',
            W.Plugin_Common_Preferred_Language,
            W.Plugin_Common_Preferred_LanguageInfo,
            'en-US', ...[
                { key: 'en-US', label: T.Tags_Language_English },
                { key: 'fr-FR', label: T.Tags_Language_French },
                { key: 'zh-TW', label: T.Tags_Language_Chinese },
            ]);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/comic/\\d+$`).test(url);
    }
    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname;
        const data = await this.fetchPOST<APIResult<ApiChapters>>(id, this.Settings.language.Value as string);
        if (data.result.code == 404) throw new Exception(W.Plugin_MissingManga_LanguageMismatchError, id, this.Settings.language.Value as string);
        const title = data.data.volume.content != null ? data.data.volume.content.name : data.data.episode.content.name;
        return new Manga(this, provider, JSON.stringify({ id: id, lang: this.Settings.language.Value as string }), title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        const languages = ['en-US', 'fr-FR', 'zh-TW'];
        for (const language of languages) {
            for (const path of this.mangaPaths) {
                for (let page = 0, run = true; run; page++) {
                    const mangas = await this.getMangasFromPage(page, provider, path, language);
                    mangas.length > 0 ? mangaList.push(...mangas) : run = false;
                }
            }
        }
        return mangaList.distinct();
    }
}
