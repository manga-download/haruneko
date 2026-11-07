import { Tags } from '../Tags';
import icon from './YaoiMe.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS } from '../platform/FetchProvider';

type HydratedChapters = {
    groups: {
        num: number;
        label: string;
        variants: {
            id: number;
            s: number; // source id
            lang: string;
            nPages: number;
        }[];
    }[];
    sources: Record<number, string>
};

const sourceViewNames = {
    atsu: 'Atsumaru',
    comix: 'Comix',
    danke: 'Danke fürs Lesen',
    dekai: 'MangaDex Archive',
    weebcentral: 'WeebCentral',
    desirescans: 'DesireScans',
    ehentai: 'E-Hentai',
    hentainexus: 'HentaiNexus',
    kagane: 'Kagane',
    kaganearc: 'Kagane Archive',
    kaizenscan: 'Kaizen Scan',
    kaliscan: 'KaliScan',
    mangaball: 'MangaBall',
    mangabuddy: 'MangaBuddy',
    mangadex: 'MangaDex',
    mangadex2: 'MangaDex',
    mangafire: 'MangaFire',
    mangafire2026: 'MangaFire',
    mangago: 'Mangago',
    mangahome: 'MangaHome',
    mangahub: 'MangaHub',
    mangak: 'MangaK',
    mangakatana: 'MangaKatana',
    mangataro: 'MangaTaro',
    mangavyvy: 'MangaVyvy',
    manhuahot: 'ManhuaHot',
    mythtoons: 'Myth Toons',
    nhentai: 'nhentai',
    octopusmanga: 'OctopusManga',
    paradisescans: 'Paradise Scans',
    schale: 'Schale',
    seraphicdeviltry: 'Seraphic Deviltry',
    springtoons: 'Spring Toons',
    theblank: 'The Blank',
    lustoon: 'Lustoon',
    underdogs: 'Underdogs',
    stonescape: 'Stonescape',
    solsticetranslations: 'Solstice Translations',
    nyraxmanga: 'Nyrax Manga',
    manhuaplus: 'ManhuaPlus',
    divascans: 'Diva Scans',
    kaynscans: 'Kayn Scans',
    valirscans: 'Valir Scans',
    lunatoons: 'Luna Toons',
    luacomic: 'Lua Comic',
    roliascan: 'Rolia Scan',
    asurascans: 'Asura Scans',
    philiascans: 'Philia Scans',
    sirenscans: 'Siren Scans',
    witchtoons: 'Witch Toons',
    elftoon: 'Elf Toon',
    templescan: 'Temple Scan',
    toontop: 'ToonTop',
    yaoimangaonline: 'Yaoi Manga Online',
    yona: 'Yona',
    zinmanga: 'ZinManga',
};

const chapterLanguageMap = new Map([
    ['ar', [Tags.Language.Arabic]],
    ['en', [Tags.Language.English]],
    ['de', [Tags.Language.German]],
    ['es', [Tags.Language.Spanish]],
    ['es-419', [Tags.Language.Spanish]],
    ['fr', [Tags.Language.French]],
    ['id', [Tags.Language.Indonesian]],
    ['it', [Tags.Language.Italian]],
    ['ja', [Tags.Language.Japanese]],
    ['ko', [Tags.Language.Korean]],
    ['pl', [Tags.Language.Polish]],
    ['pt', [Tags.Language.Portuguese]],
    ['pt-br', [Tags.Language.Portuguese]],
    ['ru', [Tags.Language.Russian]],
    ['th', [Tags.Language.Thai]],
    ['tr', [Tags.Language.Turkish]],
    ['vi', [Tags.Language.Vietnamese]],
    ['zh', [Tags.Language.Chinese]],
]);

@Common.MangaCSS(/^{origin}\/series\/\d+\/[^/]+$/, 'meta[property="og:title"]')
@Common.MangasMultiPageCSS('a.card-title', Common.PatternLinkGenerator('/browse?page={page}'))
@Common.PagesSinglePageJS(`
    [...document.querySelectorAll('div[data-page] img')].map(img => {
        const url = new URL(img.src);
        url.searchParams.delete('w');
        return url.href;
    })
`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yaoime', 'Yaoi.me', 'https://yaoi.me', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { groups, sources } = await FetchNextJS<HydratedChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'groups' in data && 'sources' in data);
        return groups
            .sort((self, other) => other.num - self.num)
            .flatMap(({ label, variants }) => variants
                .sort((self, other) => self.lang.localeCompare(other.lang) || (sources[self.s] ?? '').localeCompare(sources[other.s] ?? '') || other.nPages - self.nPages)
                .map(({ id, s, lang, nPages }) => {
                    const title = `${label} (${lang}) [${sourceViewNames[sources[s]] ?? sources[s] ?? s} @ ${nPages} pages]`;
                    return new Chapter(this, manga, `/chapter/${s}/${id}`, title, ...chapterLanguageMap.get(lang) ?? []);
                }));
    };
}