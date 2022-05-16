// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SushiScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sushiscans', `Sushi Scans`, 'https://sushi-scan.su' /*, Tags.Language.English, Tags ... */);
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
        this.url = 'https://sushi-scan.su';
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