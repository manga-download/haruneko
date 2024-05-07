import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'doujinku',
        title: 'Doujinku'
    },
    container: {
        url: 'https://doujinku.xyz/manga/no-mans-land/',
        id: '/manga/no-mans-land/',
        title: 'No Man’s Land'
    },
    child: {
        id: '/no-mans-land-chapter-40/',
        title: 'Chapter 40'
    },
    entry: {
        index: 1,
        size: 550_637,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());