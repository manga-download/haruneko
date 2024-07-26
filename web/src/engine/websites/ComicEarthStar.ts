import { Tags } from '../Tags';
import icon from './ComicEarthStar.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';

const queryOneshots = `
    query Earthstar_Oneshot {
        seriesOneshot: serialGroup(groupName: "連載・読切：読切作品") {
            seriesSlice {
                seriesList {
                    title
                    firstEpisode {
                        permalink
                    }
                }
            }
        }
    }
`;

type APIOneshots = {
    seriesOneshot: {
        seriesSlice: {
            seriesList: APIManga[]
        }
    }
}

type APIManga = {
    title: string,
    firstEpisode: {
        permalink: string
    }
}

const querySeries = `
    query Earthstar_Series {
        seriesOngoing: serialGroup(groupName: "連載・読切：連載作品：連載中") {
            seriesSlice {
                seriesList {
                    ...Earthstar_SeriesListItem_Series
                }
            }
        }
        seriesFinished: serialGroup(groupName: "連載・読切：連載作品：連載終了") {
            seriesSlice {
                seriesList {
                    ...Earthstar_SeriesListItem_Series
                }
            }
        }
    }
    
    fragment Earthstar_SeriesListItem_Series on Series {
        title
        firstEpisode {
            permalink
        }
    }
`;

type APISeries = {
    seriesOngoing: {
        seriesSlice: {
            seriesList: APIManga[]
        }
    },
    seriesFinished: {
        seriesSlice: {
            seriesList: APIManga[]
        }
    }
}

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.ChaptersSinglePageCSS()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {
    private apiUrl = 'https://comic-earthstar.com/graphql';

    public constructor() {
        super('comicearthstar', `コミック アース・スター (Comic Earth Star)`, 'https://comic-earthstar.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist: Manga[] = [];
        const { seriesOneshot } = await this.PerformGraphQL<APIOneshots>('Earthstar_Oneshot', queryOneshots);
        const { seriesOngoing, seriesFinished } = await this.PerformGraphQL<APISeries>('Earthstar_Series', querySeries);

        seriesOneshot.seriesSlice.seriesList.forEach(serie => {
            mangalist.push(new Manga(this, provider, new URL(serie.firstEpisode.permalink).pathname, serie.title.trim()));
        });

        seriesOngoing.seriesSlice.seriesList.forEach(serie => {
            mangalist.push(new Manga(this, provider, new URL(serie.firstEpisode.permalink).pathname, serie.title.trim()));
        });

        seriesFinished.seriesSlice.seriesList.forEach(serie => {
            mangalist.push(new Manga(this, provider, new URL(serie.firstEpisode.permalink).pathname, serie.title.trim()));
        });

        return mangalist.distinct();
    }

    private async PerformGraphQL<T>(operationName: string, query: string): Promise<T> {
        const uri = new URL(this.apiUrl);
        uri.searchParams.set('opname', operationName);
        return FetchGraphQL<T>(new Request(uri), operationName, query, {});
    }
}