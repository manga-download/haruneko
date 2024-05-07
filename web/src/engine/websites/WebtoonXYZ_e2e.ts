import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'webtoonxyz',
        title: 'WebtoonXYZ'
    },
    /* CloudFlare
    container: {
        url: 'https://www.webtoon.xyz/read/the-creator-is-on-hiatus/',
        id: JSON.stringify({ post: '10628', slug: '/read/the-creator-is-on-hiatus/' }),
        title: 'I�ll Be Taking A Break For Personal Reasons'
    },
    child: {
        id: '/read/the-creator-is-on-hiatus/chapter-81/',
        title: 'Chapter 81'
    },
    entry: {
        index: 0,
        size: 122_885,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());