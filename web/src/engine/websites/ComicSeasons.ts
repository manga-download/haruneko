import { Tags } from '../Tags';
import icon from './ComicSeasons.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/#series_list', 'div[class*="SeriesListItem_series_list_item"] a',
    anchor => ({ id: anchor.pathname, title: anchor.dataset.seriesTitle.trim() }))
@CoreView.ChaptersMultiPageAJAXV2()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicseasons', 'Comic Seasons', 'https://comic-seasons.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}