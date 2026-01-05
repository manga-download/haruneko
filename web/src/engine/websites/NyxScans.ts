import { Tags } from '../Tags';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import icon from './NyxScans.webp';
import { VTheme } from './templates/VTheme';

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.querySelector('body main.card > h1')?.textContent.trim() === 'One more step'`);
    return result ? FetchRedirection.Interactive : undefined;
});

export default class extends VTheme {

    public constructor() {
        super('nyxscans', 'Nyx Scans', 'https://nyxscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}