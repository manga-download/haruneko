import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'infrafandub',
        title: 'Infra Fandub'
    },
    container: {
        url: 'https://infrafandub.xyz/manga/tribu-de-dios/',
        id: JSON.stringify({ post: '977', slug: '/manga/tribu-de-dios/' }),
        title: 'Tribu de dios'
    },
    child: {
        id: '/manga/tribu-de-dios/capitulo-48/',
        title: 'Capitulo 48'
    },
    entry: {
        index: 1,
        size: 1_195_138,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());