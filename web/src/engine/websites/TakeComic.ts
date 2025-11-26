import { Tags } from '../Tags';
import icon from './TakeComic.webp';
import { ComiciViewer } from './templates/ComiciViewer';
import * as Common from './decorators/Common';

import { FetchJSON } from '../platform/FetchProvider';
import { type Manga, Chapter } from '../providers/MangaPlugin';

type APIChapters = {
    series: {
        episodes: {
            id: string;
            title: string;
        }[]
    }
};

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/?$/, 'h1.series-h-title', Common.WebsiteInfoExtractor({ queryBloat: 'span' }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.series-list-item-link', Common.PatternLinkGenerator('/series/list/up/{page}', 1), 0, anchor => ({ id: anchor.pathname, title: anchor.querySelector('div.series-list-item-h span').textContent.trim() }))

export default class extends ComiciViewer {

    public constructor() {
        super('takecomic', `TakeComic`, 'https://takecomic.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
        this.apiUrl = new URL('https://takecomic.jp/api/');
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { series: { episodes } } = await FetchJSON<APIChapters>(new Request(new URL(`./episodes?seriesHash=${manga.Identifier.split('/').at(-1)}&episodeFrom=1&episodeTo=9999`, this.apiUrl)));
        return episodes.map(({id, title })=> new Chapter(this, manga, `/episodes/${id}`, title) );
    }
}