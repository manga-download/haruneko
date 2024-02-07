import { Tags } from '../Tags';
import icon from './Comico.webp';
import { type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import Comico from './Comico';

@Common.ImageAjax()
export default class extends Comico {
    public constructor() {
        super('pocketcomics', `Pocket-Comics (コミコ)`, 'https://www.pocketcomics.com', [Tags.Language.French, Tags.Language.English, Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Official]);
        this.api = 'https://api.pocketcomics.com';
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        const languages = ['en-US', 'fr-FR', 'zh-TW'];
        for (const language of languages) {
            for (const path of this.mangaPaths) {
                for (let page = 0, run = true; run; page++) {
                    const mangas = await this.getMangasFromPage(page, provider, path, language);
                    mangas.length > 0 ? mangaList.push(...mangas) : run = false;
                }
            }
        }
        return mangaList.distinct();
    }
}
