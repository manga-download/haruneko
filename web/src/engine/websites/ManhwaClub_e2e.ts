import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manhwaclub',
        title: 'ManhwaClub'
    },
    container: {
        url: 'https://manhwaclub.net/manga/is-it-your-mother-or-sister-04/',
        id: JSON.stringify({ post: '20873', slug: '/manga/is-it-your-mother-or-sister-04/'}),
        title: 'Is It Your Mother or Sister?'
    },
    child: {
        id: '/manga/is-it-your-mother-or-sister-04/chapter-36-raw/',
        title: 'Chapter 36 raw'
    },
    entry: {
        index: 0,
        size: 222_228,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());