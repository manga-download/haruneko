import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'evilflowers',
        title: 'EvilFlowers'
    },
    container: {
        url: 'https://evilflowers.com/project/spam-mail-hunter/',
        id: JSON.stringify({ post: '545', slug: '/project/spam-mail-hunter/' }),
        title: 'Spam Mail Hunter'
    },
    child: {
        id: '/project/spam-mail-hunter/volume-08/chapter-36/',
        title: 'Chapter 36'
    },
    entry: {
        index: 1,
        size: 324_347,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());