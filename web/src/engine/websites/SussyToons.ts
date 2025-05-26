import { Tags } from '../Tags';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import { FetchWindowScript } from '../platform/FetchProvider';
import type { Chapter, Page } from '../providers/MangaPlugin';
import icon from './MaidScan.webp';
import { SussyBase, type APIManga, type APIChapter } from './templates/SussyBase';

AddAntiScrapingDetection(async (invoke) => {
    const script = `
        new Promise( resolve => {
          setTimeout(  () => {
             window.turnstile ? resolve(true): resolve(false);
          }, 5000);
        })
     `;
    const result = await invoke<boolean>(script);
    return result ? FetchRedirection.Interactive : undefined;
});

const pageScript = `
    new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            let response = null;
            try {
                response = turnstile?.getResponse();
            } catch {};

            if (!response) return;
            else {
                clearInterval(interval);
                resolve(response);
                window.close();
            }
        }, 500);
    });
`;

export default class extends SussyBase {

    public constructor() {
        super('sussytoons', 'Sussy Toons', 'https://www.sussytoons.wtf', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
        this.scanId = '1';
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { cap_id, cap_numero }: APIChapter = JSON.parse(chapter.Identifier);
        const { obr_id } = JSON.parse(chapter.Parent.Identifier) as APIManga;
        const token = await FetchWindowScript<string>(new Request(new URL(`./capitulo/${cap_id}/`, this.URI)), pageScript, 0, 30_000);
        alert(token);

    }

}