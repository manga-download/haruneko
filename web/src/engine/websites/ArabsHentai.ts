import { Tags } from '../Tags';
import icon from './ArabsHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.sheader div.data h1')
@Common.MangasMultiPageCSS('article div.data h3 a', Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#chapter-list ul li a:not(:has(span.chapter-lock))', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLSpanElement>('span.chapternum').textContent.trim()
}))
@Common.PagesSinglePageJS(`
    new Promise(resolve => {
	    const images = document.documentElement.innerHTML.match(/const\\s+images\\s*=\\s*(\\[.*?\\]);/s)?.at(1);
	    if (images) {
		    const pages = JSON.parse(images).map(({	url	}) => atob(url));
		    return resolve(pages);
	    }
	    resolve([...document.querySelectorAll('img.wp-manga-chapter-img')].map(img => img.src));
    });
`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('arabshentai', 'ArabsHentai', 'https://arabshentai.com', Tags.Media.Manhwa, Tags.Language.Arabic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}