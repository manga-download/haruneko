import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'clovermanga',
        title: 'Clover Manga'
    },
    container: {
        url: 'https://clover-manga.com/manga/lucia/',
        id: JSON.stringify({ post: '1460', slug: '/manga/lucia/' }),
        title: 'Lucia'
    },
    child: {
        id: '/manga/lucia/blm-1292da051dac459534b0936f92fc747658f/',
        title: 'Bölüm 129'
    },
    entry: {
        index: 0,
        size: 723_650,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());