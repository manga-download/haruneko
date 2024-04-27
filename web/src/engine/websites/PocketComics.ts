import { Tags } from '../Tags';
import icon from './PocketComics.webp';
import { Manga, type MangaPlugin } from '../providers/MangaPlugin';
import Comico, { type APIResult, type ApiChapters } from './Comico';
import { Choice } from '../SettingsManager';
import { WebsiteResourceKey as W, TagResourceKey as T } from '../../i18n/ILocale';
import { Exception } from '../Error';

export default class extends Comico {

    private readonly languageOptions = [
        { key: 'en-US', label: T.Tags_Language_English },
        { key: 'fr-FR', label: T.Tags_Language_French },
        { key: 'zh-TW', label: T.Tags_Language_Chinese },
    ];

    public constructor() {
        super('pocketcomics', `Pocket-Comics (コミコ)`, 'https://www.pocketcomics.com', [Tags.Language.French, Tags.Language.English, Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Official]);

        this.api = 'https://api.pocketcomics.com';
        this.mangaLanguages = this.languageOptions.map(option => option.key);
        this.Settings.language = new Choice('language',
            W.Plugin_Common_Preferred_Language,
            W.Plugin_Common_Preferred_LanguageInfo,
            this.languageOptions[0].key,
            ...this.languageOptions,
        );
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/comic/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname;
        const data = await super.FetchPOST<APIResult<ApiChapters>>(id, this.Settings.language.Value as string);
        if (data.result.code == 404) {
            throw new Exception(W.Plugin_PocketComics_LanguageMismatchError, id, this.Settings.language.Value as string);
        }
        const title = data.data.volume?.content?.name ?? data.data.episode.content.name;
        return new Manga(this, provider, JSON.stringify({ id: id, lang: this.Settings.language.Value as string }), title.trim());
    }
}