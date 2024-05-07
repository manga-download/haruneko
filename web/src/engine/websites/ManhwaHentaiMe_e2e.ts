import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwahentaime',
        title: 'ManhwaHentai.me'
    },
    container: {
        url: 'https://manhwahentai.me/webtoon/boarding-school/',
        id: JSON.stringify({ post: '52232', slug: '/webtoon/boarding-school/' }),
        title: 'Boarding School'
    },
    child: {
        id: '/webtoon/boarding-school/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 898_037,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());