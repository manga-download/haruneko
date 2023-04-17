import { Tags } from '../Tags';
import icon from './UnionMangas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

@Common.MangaCSS(/^https?:\/\/unionleitor\.top\/pagina-manga\//, 'div.perfil-manga div.row div.col-md-12 h2')
@Common.MangasMultiPageCSS('/lista-mangas/visualizacoes/{page}', 'div.tamanho-bloco-perfil div.lista-mangas-novos > a:last-of-type')
@Common.ChaptersSinglePageCSS('div.perfil-manga div.capitulos div:first-of-type > a')
@MangaStream.PagesSinglePageCSS([/banner_/], 'img.img-manga')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('unionmangas', `UnionMangas`, 'https://unionleitor.top', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}