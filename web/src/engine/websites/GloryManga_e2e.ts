import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'glorymanga',
        title: 'GloryManga'
    },
    container: {
        url: 'https://glorymanga.com/manga/dragon-master/',
        id: JSON.stringify({ post: '12536', slug: '/manga/dragon-master/' }),
        title: 'Dragon Master'
    },
    child: {
        id: '/manga/dragon-master/dragon-master-blm-1261553b9c2600d31971091860a599322/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 2_754_583,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());