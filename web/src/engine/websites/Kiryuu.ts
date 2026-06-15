import { Tags } from '../Tags';
import icon from './Kiryuu.webp';
import { KiruBase } from './templates/KiruBase';
import { FetchWindowScript } from '../platform/FetchProvider';

export default class extends KiruBase {

    public constructor() {
        super('kiryuu', 'Kiryuu', 'https://v6.kiryuu.to', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin;', 0);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}