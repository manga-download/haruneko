import { Tags } from '../Tags';
import { FetchWindowScript } from '../platform/FetchProvider';
import icon from './KLMangash.webp';
import { Zing92Base } from './templates/Zing92Base';

export default class extends Zing92Base {

    public constructor() {
        super('klmangash', 'KLManga(.sh)', 'https://klmanga.fit', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
        this.WithNonceName('nonce_a').WithDecodeImageAction('decode_images_g');
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}