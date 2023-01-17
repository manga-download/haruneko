import { Tags } from '../Tags';
import icon from './DoujinDesu.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

const queryPages = 'div.main div img[src]:not([src=""])';

const script = `
      new Promise((resolve, reject) => {
          setTimeout(() => {
              const images = [...document.querySelectorAll('${queryPages}')];
              resolve(images.map(image => image.dataset['lazySrc'] || image.dataset['src'] || image.getAttribute('original') ||  image.src));
          }, 2500);
      });
 `;

@Common.MangaCSS(/^https?:\/\/212\.32\.226\.234\/manga\/[^/]+\/$/, 'section.metadata h1.title', Common.ElementLabelExtractor('span.alter'))
@Common.MangasMultiPageCSS('/manga/page/{page}/', 'div.entries article.entry a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@MangaStream.ChaptersSinglePageCSS('div#chapter_list div.epsleft span.lchx a')
@Common.PagesSinglePageJS(script)
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujindesu', 'DoujinDesu', 'https://212.32.226.234', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}