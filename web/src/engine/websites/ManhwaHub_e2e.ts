import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwahub',
        title: 'ManhwaHub'
    },
    container: {
        url: 'https://manhwahub.net/webtoon/thorns-on-innocence',
        id: '/webtoon/thorns-on-innocence',
        title: 'Thorns on Innocence'
    },
    child: {
        id: '/webtoon/thorns-on-innocence/chapter-100',
        title: 'Chapter 100'
    },
    entry: {
        index: 0,
        size: 44_174,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());