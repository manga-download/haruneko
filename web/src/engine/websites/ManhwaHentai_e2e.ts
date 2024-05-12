import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwahentai',
        title: 'ManhwaHentai'
    },
    container: {
        url: 'https://manhwahentai.to/pornhwa/young-aunt/',
        id: JSON.stringify({ post: '96722', slug: '/pornhwa/young-aunt/' }),
        title: 'Young Aunt'
    },
    child: {
        id: '/pornhwa/young-aunt/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 2_250_720,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());