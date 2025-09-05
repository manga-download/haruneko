import { Tags } from '../Tags';
import * as Common from './decorators/Common';
import icon from './QuantumScans.webp';
import { VTheme } from './templates/VTheme';

@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.container div.items-center div.w-full img[loading]')].map(image => image.src);`, 1500)
export default class extends VTheme {

    public constructor() {
        super('quantumscans', 'Quantum Scans', 'https://quantumtoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
        this.apiUrl = new URL('https://vapi.quantumtoon.com/api/');
    }

    public override get Icon() {
        return icon;
    }
}