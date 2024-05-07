import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asurascans-tr',
        title: 'Asura Scans (TR)',
    },
    container: {
        url: 'https://asurascans.com.tr/manga/age-of-arrogance/',
        id: JSON.stringify({ post: "605", slug: "/manga/age-of-arrogance/" }),
        title: 'Age of Arrogance',
    },
    child: {
        id: '/manga/age-of-arrogance/bolum-28/',
        title: 'Bölüm 28',
    },
    entry: {
        index: 1,
        size: 199_932,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());