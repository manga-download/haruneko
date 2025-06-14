import { Tags } from '../Tags';
import icon from './MangaPro.webp';
import { VTheme } from './templates/VTheme';
import * as Common from './decorators/Common';

@Common.PagesSinglePageJS('[...document.querySelectorAll("section img[loading]")].map(image => image.src);', 2500)
export default class extends VTheme {

    public constructor() {
        super('mangapro', 'Manga Pro', 'https://promanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}