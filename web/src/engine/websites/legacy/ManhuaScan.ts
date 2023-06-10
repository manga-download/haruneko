import { Tags } from '../../Tags';
import icon from './ManhuaScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as FlatManga from '../decorators/FlatManga';

const pageScript = `
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

@Common.MangaCSS(/^https?:\/\/manhuascan\.io\/manga\/[^/]+$/, FlatManga.queryMangaTitle)
@Common.MangasMultiPageCSS('/manga-list?page={page}', FlatManga.queryMangas)
@FlatManga.ChaptersSinglePageCSS(FlatManga.queryChapters)
@Common.PagesSinglePageJS(pageScript)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuascan', `ManhuaScan`, 'https://manhuascan.io', Tags.Language.English, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}