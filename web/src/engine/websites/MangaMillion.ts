import { Tags } from '../Tags';
import icon from './MangaMillion.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import protoTypes from './MangaMillion.proto?raw';
import { FetchProto, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromHex } from '../BufferEncoder';
import { DecryptAES } from '../Crypto';

type MangaMillionResponse = {
    mangaList: MangaListViewResponse;
    titleDetail: TitleDetailViewResponse;
    titleLanguageSelect: TitleLanguageSelectViewResponse;
    chapterList: ChapterListViewResponse;
    viewer: ViewerViewResponse;
};

type MangaListViewResponse = {
    items: MangaListItem[];
};

type MangaListItem = {
    originalTitle: OriginalTitleSummary;
    availableLanguageCodes: string[];
};

type OriginalTitleSummary = {
    originalTitleId: number;
    serviceTitleName: string;
};

type TitleDetailViewResponse = {
    serviceTitle: ServiceTitle;
};

type ServiceTitle = {
    serviceTitleName: string;
};

type TitleLanguageSelectViewResponse = {
    languages: Language[];
};

type Language = {
    code: string;
    serviceName: string;
};

type ChapterListViewResponse = {
    chapterGroups: ChapterGroup[];
};

type ChapterGroup = {
    chapters: ChapterInfo[];
};

type ChapterInfo = {
    number: string;
    name: string;
    translatedChapterId?: number;
};

type ViewerViewResponse = {
    pages: ViewerPage[];
    aesKey: string;
    aesIv: string;
};

type ViewerPage = {
    imageUrl: string;
};

type PageData = {
    aesKey: string;
    aesIv: string;
};

// keep this as references for future languages tags inclusion
const chapterLanguageMap = new Map([
    //['af', Tags.Language.Afrikaans],
    //['am', Tags.Language.Amharic],
    ['ar', Tags.Language.Arabic],
    /*['as', Tags.Language.Assamese],
    ['be', Tags.Language.Belarusian],
    ['bg', Tags.Language.Bulgarian],
    ['bho', Tags.Language.Bhojpuri],
    ['bo', Tags.Language.Tibetan],
    ['ca', Tags.Language.Catalan],
    ['ceb', Tags.Language.Cebuano],
    ['cnr', Tags.Language.Montenegrin],
    ['cs', Tags.Language.Czech],
    ['cy', Tags.Language.Welsh],
    ['da', Tags.Language.Danish],*/
    ['de', Tags.Language.German],
    //['doi', Tags.Language.Dogri],
    //['dv', Tags.Language.Dhivehi],
    //['ee', Tags.Language.Ewe],
    //['el', Tags.Language.Greek],
    ['en', Tags.Language.English],
    ['es', Tags.Language.Spanish],
    ['es-AR', Tags.Language.Spanish],
    ['es-MX', Tags.Language.Spanish],
    //['et', Tags.Language.Estonian],
    //['eu', Tags.Language.Basque],
    //['fi', Tags.Language.Finnish],
    ['fr', Tags.Language.French],
    /*['ga', Tags.Language.Irish],
    ['gl', Tags.Language.Galician],
    ['gn', Tags.Language.Guarani],
    ['gu', Tags.Language.Gujarati],
    ['haw', Tags.Language.Hawaiian],
    ['he', Tags.Language.Hebrew],
    ['hi', Tags.Language.Hindi],
    ['hmn', Tags.Language.Hmong],
    ['hr', Tags.Language.Croatian],
    ['hu', Tags.Language.Hungarian],
    ['hy', Tags.Language.Armenian],*/
    ['id', Tags.Language.Indonesian],
    //['ig', Tags.Language.Igbo],
    //['ilo', Tags.Language.Ilocano],
    //['is', Tags.Language.Icelandic],
    ['it', Tags.Language.Italian],
    //['ka', Tags.Language.Georgian],
    //['km', Tags.Language.Khmer],
    //['kn', Tags.Language.Kannada],
    ['ko-KR', Tags.Language.Korean],
    /*['kok', Tags.Language.Konkani],
    ['la', Tags.Language.Latin],
    ['lb', Tags.Language.Luxembourgish],
    ['lg', Tags.Language.Luganda],
    ['ln', Tags.Language.Lingala],
    ['lo', Tags.Language.Lao],
    ['lt', Tags.Language.Lithuanian],
    ['lus', Tags.Language.Mizo],
    ['lv', Tags.Language.Latvian],
    ['mai', Tags.Language.Maithili],
    ['mg', Tags.Language.Malagasy],
    ['mi', Tags.Language.Maori],
    ['mk', Tags.Language.Macedonian],
    ['ml', Tags.Language.Malayalam],
    ['mn', Tags.Language.Mongolian],
    ['mni', Tags.Language.Meitei],
    ['mr', Tags.Language.Marathi],
    ['mt', Tags.Language.Maltese],
    ['mww', Tags.Language.HmongMiao],
    ['my', Tags.Language.Burmese],
    ['ne', Tags.Language.Nepali],
    ['nl', Tags.Language.Dutch],
    ['no', Tags.Language.Norwegian],
    ['nso', Tags.Language.Sepedi],
    ['ny', Tags.Language.Chichewa],
    ['or', Tags.Language.Odia],
    ['pa', Tags.Language.Punjabi],*/
    ['pl', Tags.Language.Polish],
    ['pt', Tags.Language.Portuguese],
    ['pt-BR', Tags.Language.Portuguese],
    //['qu', Tags.Language.Quechua],
    //['ro', Tags.Language.Romanian],
    //['ro-MD', Tags.Language.Moldovan],
    ['ru', Tags.Language.Russian],
    /*['rw', Tags.Language.Kinyarwanda],
    ['sa', Tags.Language.Sanskrit],
    ['sd', Tags.Language.Sindhi],
    ['si', Tags.Language.Sinhala],
    ['sk', Tags.Language.Slovak],
    ['sl', Tags.Language.Slovenian],
    ['sm', Tags.Language.Samoan],
    ['sn', Tags.Language.Shona],
    ['sr', Tags.Language.Serbian],
    ['sv', Tags.Language.Swedish],
    ['sw', Tags.Language.Swahili],
    ['ta', Tags.Language.Tamil],
    ['te', Tags.Language.Telugu],*/
    ['th', Tags.Language.Thai],
    //['tl', Tags.Language.Tagalog],
    ['tr', Tags.Language.Turkish],
    //['ts', Tags.Language.Tsonga],
    //['uk', Tags.Language.Ukrainian],
    ['vi', Tags.Language.Vietnamese],
    //['xh', Tags.Language.Xhosa],
    //['yi', Tags.Language.Yiddish],
    //['yo', Tags.Language.Yoruba],
    //['zh-CN', Tags.Language.Chinese],
    ['zh-HK', Tags.Language.Chinese],
    ['zh-TW', Tags.Language.Chinese],
    //['zu', Tags.Language.Zulu]
]);

export default class extends DecoratableMangaScraper {
    private readonly apiURL = 'https://api.mangamillion.shueisha.co.jp/api/';
    private token = '';

    public constructor() {
        super('mangamillion', 'Manga Million', 'https://mangamillion.shueisha.co.jp', Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // TODO: Update the token whenever the user performs a login/logout through manual website interaction
        this.token = await FetchWindowScript(new Request(this.URI), `cookieStore.get('access_token').then(({ value }) => value ?? null).catch(error => null);`, 1500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+\/title/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = url.split('/').at(-1);
        const { titleDetail: { serviceTitle: { serviceTitleName } } } = await this.FetchAPI(`./title_detail?service_language=en&avif_enable=false&original_title_id=${mangaId}`);
        return new Manga(this, provider, `${mangaId}`, serviceTitleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { mangaList: { items } } = await this.FetchAPI(`./manga_list?service_language=en&avif_enable=false&tag_name=all-titles`);
        return items.map(({ originalTitle: { originalTitleId, serviceTitleName } }) => new Manga(this, provider, `${originalTitleId}`, serviceTitleName));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { titleLanguageSelect: { languages } } = await this.FetchAPI(`./title_language_select?service_language=en&avif_enable=false&original_title_id=${manga.Identifier}`);
        const chapterPromises = languages.map(async ({ code }) => {
            const { chapterList: { chapterGroups } } = await this.FetchAPI(`./chapter_list?service_language=en&avif_enable=true&original_title_id=${manga.Identifier}&translated_language=${code}`);
            return chapterGroups.flatMap(({ chapters }) => {
                return chapters
                    .filter(({ translatedChapterId }) => translatedChapterId)
                    .map(({ translatedChapterId, name, number }) =>
                        new Chapter(this, manga, `${translatedChapterId}`, [number, name, `[${code}]`].joinTitleSegments(),
                            ...[chapterLanguageMap.get(code)].filter(Boolean))
                    );
            });
        });

        const nestedChapters = await Promise.all(chapterPromises);
        return nestedChapters.flat();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const { viewer: { pages, aesIv, aesKey } } = await this.FetchAPI(`./viewer?service_language=en&avif_enable=false&translated_chapter_id=${chapter.Identifier}&quality=high`);
        return pages.map(({ imageUrl }) => new Page(this, chapter, new URL(imageUrl), { aesIv, aesKey, Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { aesIv, aesKey } = page.Parameters;
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !aesIv || !aesIv ? blob : this.DecryptImage(blob, aesKey, aesIv);
    }

    private async DecryptImage(blob: Blob, keyData: string, iv: string): Promise<Blob> {
        const decrypted = await DecryptAES(await blob.arrayBuffer(), GetBytesFromHex(keyData), { name: 'AES-CBC', iv: GetBytesFromHex(iv) });
        return Common.GetTypedData(decrypted);
    }

    private async FetchAPI(endpoint: string): Promise<MangaMillionResponse> {
        return FetchProto<MangaMillionResponse>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                'Access-Token': this.token
            }
        }), protoTypes, 'MangaMillion.Response');
    }
}