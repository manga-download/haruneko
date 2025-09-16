import { Tags } from '../Tags';
import * as Common from './decorators/Common';
import icon from './QiScans.webp';
import { VTheme } from './templates/VTheme';

@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.container div.items-center div.w-full img[loading]')].map(image => image.src);`, 1500)
export default class extends VTheme {

    public constructor() {
        super('quantumscans', 'Qi Scans', 'https://qiscans.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
        this.apiUrl = new URL('https://api.qiscans.org/api/');
    }

    public override get Icon() {
        return icon;
    }
}