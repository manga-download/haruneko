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
        }[];
    }[];
    sources: Record<number, string>
};

const chapterLanguageMap = new Map([
    ['ar', Tags.Language.Arabic],
    ['en', Tags.Language.English],
    ['de', Tags.Language.German],
    ['es', Tags.Language.Spanish],
    ['es-419', Tags.Language.Spanish],
    ['fr', Tags.Language.French],
    ['id', Tags.Language.Indonesian],
    ['it', Tags.Language.Italian],
    ['ja', Tags.Language.Japanese],
    ['ko', Tags.Language.Korean],
    ['pl', Tags.Language.Polish],
    ['pt', Tags.Language.Portuguese],
    ['pt-br', Tags.Language.Portuguese],
    ['ru', Tags.Language.Russian],
    ['th', Tags.Language.Thai],
    ['tr', Tags.Language.Turkish],
    ['vi', Tags.Language.Vietnamese],
    ['zh', Tags.Language.Chinese]
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
            .reduce((aggregator: Chapter[], { label, variants }) => {
                const chapters = variants.map(({ id, s, lang }) => {
                    //append source AND id because sources can have the same name (i.e multiple 'Kagane')
                    const chapterSuffix = variants.length > 1 ? `[${sources[s]}] [${id}]` : undefined;
                    return new Chapter(this, manga, `/chapter/${s}/${id}`, [label, `[${lang}]`, chapterSuffix].joinTitleSegments(), ...[chapterLanguageMap.get(lang)].filter(Boolean));
                });
                return [...aggregator, ...chapters];
            }, []);
    };
}