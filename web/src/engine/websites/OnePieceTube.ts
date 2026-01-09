import { Tags } from '../Tags';
import icon from './OnePieceTube.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/kapitel-mangaliste$/, 'div#main-content div.border-bottom p')
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/manga/kapitel-mangaliste', 'ol.breadcrumb li:last-of-type a', anchor => ({ id: anchor.pathname, title: 'One Piece (jap. ワンピース)' }))
@Common.ChaptersSinglePageJS(`__data.entries.map(({ href, number, name}) =>  ( { id: new URL(href).pathname, title : [number, name].join(' ').trim() }));`)
@Common.PagesSinglePageJS(`__data.chapter.pages.map(page => page.url);`)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('onepiecetube', `One Piece Tube`, 'https://onepiece.tube', Tags.Language.German, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}