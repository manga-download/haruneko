import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'warungkomik',
        title: 'WarungKomik'
    },
    container: {
        url: 'https://warungkomik.com/manga/against-the-gods/',
        id: '/manga/against-the-gods/',
        title: 'Against the Gods'
    },
    child: {
        id: '/against-the-gods-chapter-597/',
        title: 'Chapter 597'
    },
    entry: {
        index: 1,
        size: 297_370,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());