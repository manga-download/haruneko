import { Tags } from '../Tags';
import icon from './QiScans.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { VTheme } from './templates/VTheme';
import * as Common from './decorators/Common';

@Common.PagesSinglePageJS(`[ ...document.querySelectorAll('div.container div.items-center div.w-full img[loading]') ].map(image => image.src);`, 1500)
export default class extends VTheme {

    public constructor() {
        super('quantumscans', 'Qi Scans', 'https://qiscans.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('/series/-', this.URI)), '');
    }
}