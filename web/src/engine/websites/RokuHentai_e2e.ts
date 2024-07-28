import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rokuhentai',
        title: 'RokuHentai'
    },
    container: {
        url: 'https://rokuhentai.com/fdoabr/0',
        id: '/fdoabr/0',
        title: '[Pixiv sasapoliton 40651568]'
    },
    child: {
        id: '/fdoabr/0',
        title: '[Pixiv sasapoliton 40651568]'
    },
    entry: {
        index: 0,
        size: 68_628,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());