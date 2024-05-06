import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tortugaceviri',
        title: 'Tortuga Çeviri'
    },
    container: {
        url: 'https://tortuga-ceviri.com/manga/kagurabachi/',
        id: JSON.stringify({ post: '450', slug: '/manga/kagurabachi/' }),
        title: 'Kagurabachi'
    },
    child: {
        id: '/manga/kagurabachi/kagurabachi-01/',
        title: '01'
    },
    entry: {
        index: 2,
        size: 663_393,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());