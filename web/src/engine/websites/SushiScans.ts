// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './SushiScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/sushiscan\.su\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sushiscans', 'Sushi Scans', 'https://sushiscan.su', Tags.Media.Manga, Tags.Language.French);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SushiScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'sushiscans';
        super.label = 'Sushi Scans';
        this.tags = [ 'manga', 'french' ];
        this.url = 'https://sushiscan.su';
        this.path = '/manga/list-mode/';
    }

    async _getPages(chapter) {
        const script = `
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        resolve(ts_reader.params.sources.shift().images);
                    } catch(error) {
                        reject(error);
                    }
                }, 2500);
            });
        `;
        const uri = new URL(chapter.id, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await Engine.Request.fetchUI(request, script);
        // HACK: bypass 'i0.wp.com' image CDN to ensure original images are loaded directly from host
        return data.map(link => this.getAbsolutePath(link, request.url).replace(/\/i\d+\.wp\.com/, '')).filter(link => !link.includes('histats.com'));
    }
}
*/