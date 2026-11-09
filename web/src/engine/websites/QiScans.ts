import { Tags } from '../Tags';
import icon from './QiScans.webp';
import { EzMangaBase } from './templates/EzMangaBase';

export default class extends EzMangaBase {

    public constructor() {
        super('quantumscans', 'Qi Scans', 'https://qimanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
        this.WithApiURL('https://api.qimanga.com/api/v1/');
    }

    public override get Icon() {
        return icon;
    }
}