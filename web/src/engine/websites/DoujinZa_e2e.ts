import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'doujinza',
        title: 'DoujinZa'
    },
    container: {
        url: 'https://doujinza.com/doujin/happy-campus/',
        id: JSON.stringify({ post: '15811', slug: '/doujin/happy-campus/' }),
        title: 'Happy Campus'
    },
    child: {
        id: '/doujin/happy-campus/%e0%b8%95%e0%b8%ad%e0%b8%99%e0%b8%97%e0%b8%b5%e0%b9%88-31/',
        title: 'ตอนที่ 31'
    },
    entry: {
        index: 0,
        size: 1_093_282,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());