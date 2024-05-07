import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'diskusscan',
        title: 'Diskus Scan'
    },
    container: {
        url: 'https://diskusscan.com/manga/shenwu-tianzun/',
        id: '/manga/shenwu-tianzun/',
        title: 'Shenwu Tianzun'
    },
    child: {
        id: '/shenwu-tianzun-capitulo-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 117_062,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());