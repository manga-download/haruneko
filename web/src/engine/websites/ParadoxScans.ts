import { Tags } from '../Tags';
import icon from './ParadoxScans.webp';
import { InitManga } from './templates/InitManga';
import * as Common from './decorators/Common';

@Common.PagesSinglePageJS(`
    new Promise(resolve => {
        const elements = [...document.querySelectorAll('#chapter-content img, #chapter-content canvas')];
        resolve(elements.map(element => {
            if (element instanceof HTMLImageElement) return new URL(element.dataset.originalSrc ?? element.src, location).href;
            return new URL(atob(element.dataset.enc).split('').reverse().join(''), location).href;
        }));
    })`
, 1500)
export default class extends InitManga {
    public constructor() {
        super('paradoxscans', 'Paradox Scans', 'https://paradoxscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}