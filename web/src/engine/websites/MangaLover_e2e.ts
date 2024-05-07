import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangalover',
        title: '3asq (مانجا العاشق)'
    },
    container: {
        url: 'https://3asq.org/manga/gokurakugai/',
        id: JSON.stringify({ post: '12936', slug: '/manga/gokurakugai/' }),
        title: 'Gokurakugai'
    },
    child: {
        id: '/manga/gokurakugai/1/',
        title: '1 - مكتب مقاطعة غوكوراكو لحل المشاكل'
    },
    entry: {
        index: 0,
        size: 2_536_608,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());