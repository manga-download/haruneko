import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'imhentai',
        title: 'IMHentai'
    },
    container: {
        url: 'https://imhentai.xxx/gallery/999446/',
        id: '/gallery/999446/',
        title: '[TheOtherHalf] Scrawled [Ongoing]'
    },
    child: {
        id: '/gallery/999446/',
        title: '[TheOtherHalf] Scrawled [Ongoing]'
    },
    entry: {
        index: 0,
        size: 349_359,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());