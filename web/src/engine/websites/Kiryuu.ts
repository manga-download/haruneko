import { Tags } from '../Tags';
import { FetchWindowScript } from '../platform/FetchProvider';
import icon from './Kiryuu.webp';
import NatsuID from './NatsuID';

export default class extends NatsuID {

    public constructor() {
        super('kiryuu', 'Kiryuu', 'https://kiryuu03.com', [Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation]);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin;', 0);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}