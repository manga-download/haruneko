// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HeroScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('heroscan', `HeroScan`, 'https://heroscan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HeroScan extends FlatManga {

    constructor() {
        super();
        super.id = 'heroscan';
        super.label = 'HeroScan';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://heroscan.com';

        this.queryChapters = 'div#tab-chapper span[class^="title"] a.chapter';
    }

    // Same decryption as in ManhuaScan
    async _getPages(chapter) {
        const script = `
            new Promise(async resolve => {
                const response = await fetch('/app/manga/controllers/cont.chapterServer1.php', {
                    method: 'POST',
                    body: 'id=' + chapter_id,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                const data = await response.text();
                const key = CryptoJS.enc.Hex.parse('e11adc3949ba59abbe56e057f20f131e');
                const options = {
                    iv: CryptoJS.enc.Hex.parse('1234567890abcdef1234567890abcdef'),
                    padding: CryptoJS.pad.ZeroPadding
                };
                const decrypted = CryptoJS.AES.decrypt(data, key, options).toString(CryptoJS.enc.Utf8).replace(/(^\u0002+)|(\u0003+$)/g, '').trim();
                resolve(decrypted.split(','));
            });
        `;
        let uri = new URL(chapter.id, this.url);
        let request = new Request(uri, this.requestOptions);
        return Engine.Request.fetchUI(request, script);
    }
}
*/