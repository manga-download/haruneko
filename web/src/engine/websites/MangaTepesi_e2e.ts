import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangatepesi',
        title: 'MangaTepesi'
    },
    container: {
        url: 'https://mangatepesi.com/manga/guard-pass/24',
        id: '/manga/guard-pass/24',
        title: 'Guard Pass'
    },
    child: {
        id: '/manga/guard-pass/23-bolum/1930',
        title: '23.Bölüm'
    },
    entry: {
        index: 1,
        size: 1_467_126,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());