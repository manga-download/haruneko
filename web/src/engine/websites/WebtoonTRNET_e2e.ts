import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'webtoontrnet',
        title: 'Webtoon TR'
    },
    container: {
        url: 'https://webtoontr.net/webtoon/dreaming-freedom-5/',
        id: JSON.stringify({ post: '9028', slug: '/webtoon/dreaming-freedom-5/' }),
        title: 'Dreaming Freedom'
    },
    child: {
        id: '/webtoon/dreaming-freedom-5/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 318_969,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());