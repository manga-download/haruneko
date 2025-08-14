import { Tags } from '../Tags';
import icon from './ComicEarthStar.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';

type GQLMangas = {
    seriesSlice: {
        seriesList: {
            title: string;
            firstEpisode: {
                permalink: string;
            };
        }[];
    };
};

type GQLSerialGroups = {
    seriesOneshot: GQLMangas;
    seriesOngoing: GQLMangas;
    seriesFinished: GQLMangas;
};

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.ChaptersMultiPageAJAXV2()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURI = new URL('/graphql', 'https://comic-earthstar.com');

    public constructor() {
        super('comicearthstar', `コミック アース・スター (Comic Earth Star)`, 'https://comic-earthstar.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { seriesOneshot, seriesOngoing, seriesFinished } = await FetchGraphQL<GQLSerialGroups>(new Request(this.apiURI), undefined, `
            query {
                seriesOneshot: serialGroup(groupName: "連載・読切：読切作品") { ...Mangas }
                seriesOngoing: serialGroup(groupName: "連載・読切：連載作品：連載中") { ...Mangas }
                seriesFinished: serialGroup(groupName: "連載・読切：連載作品：連載終了") { ...Mangas }
            }
            fragment Mangas on SerialGroup {
                seriesSlice { seriesList { title, firstEpisode { permalink } } }
            }
        `, {});

        return [
            ...seriesOneshot.seriesSlice.seriesList,
            ...seriesOngoing.seriesSlice.seriesList,
            ...seriesFinished.seriesSlice.seriesList,
        ].map(manga => new Manga(this, provider, new URL(manga.firstEpisode.permalink).pathname, manga.title.trim())).distinct();
    }
}