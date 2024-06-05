import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangageko',
        title: 'MangaGeko'
    },
    container: {
        url: 'https://www.mgeko.cc/manga/martial-peak-mg1/',
        id: '/manga/martial-peak-mg1/',
        title: 'Martial Peak'
    },
    child: {
        id: '/reader/en/martial-peak-chapter-3616-eng-li/',
        title: '3616 (eng)'
    },
    entry: {
        index: 0,
        size: 403_800,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());