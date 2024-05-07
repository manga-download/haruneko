import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'atikrost',
        title: 'Atikrost'
    },
    container: {
        url: 'https://www.atikrost.com/manga/i-am-the-grim-reaper-webtoon-oku/',
        id: JSON.stringify({ post: '51', slug: '/manga/i-am-the-grim-reaper-webtoon-oku/' }),
        title: 'I am the Grim Reaper'
    },
    child: {
        id: '/manga/i-am-the-grim-reaper-webtoon-oku/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 99_003,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());