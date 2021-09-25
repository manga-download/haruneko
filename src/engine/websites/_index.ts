import { DecoratableMangaScraper } from "../providers/MangaPlugin";
export class Website extends DecoratableMangaScraper {
    public constructor() {
        super('website', 'Wesbite', 'https://website');
    }
}