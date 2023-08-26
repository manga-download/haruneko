import { Tags } from '../Tags';
import icon from './UnionMangas.webp';
import { type Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

@Common.MangaCSS(/^https?:\/\/guimah\.com\/perfil\//, 'div.perfil-manga div.row div.col-md-12 h2')
@Common.MangasMultiPageCSS('/lista-mangas/visualizacoes/{page}', 'div.tamanho-bloco-perfil div.lista-mangas-novos > a:last-of-type')
@MangaStream.PagesSinglePageCSS([/banner_/], 'img.img-manga')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('unionmangas', `UnionMangas`, 'https://guimah.com', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    //chapters filtering because there are dupe, try My hero Academia
    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await Common.FetchChaptersSinglePageCSS.call(this, manga, 'div.perfil-manga div.capitulos div:first-of-type > a');
        return chapters.filter((chapter, index) => {
            return index === chapters.findIndex(c => c.Identifier === chapter.Identifier);
        });
    }

}