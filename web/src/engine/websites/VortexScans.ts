import { Tags } from '../Tags';
import icon from './VortexScans.webp';
import { VTheme } from './templates/VTheme';
import * as Common from './decorators/Common';

@Common.PagesSinglePageJS(` [ ...document.querySelectorAll('.image-container img[data-image-index]') ].map(img => img.src)
    new Promise(resolve => {
        const images = [ ...document.querySelectorAll('.image-container img[data-image-index]') ];
        images.forEach(img => img.scrollIntoView());
        setTimeout(() => resolve(images.map(img => img.src)), 500);
    });
`)
export default class extends VTheme {

    public constructor() {
        super('vortexscans', 'Vortex Scans', 'https://vortexscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}