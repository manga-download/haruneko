import { Tags } from '../Tags';
import icon from './MangaGalaxy.webp';
import VortexScans from './VortexScans';

export default class extends VortexScans {

    public constructor() {
        super('mangagalaxy', 'Manga Galaxy', 'https://mangagalaxy.net', [Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator]);
    }

    public override get Icon() {
        return icon;
    }
}