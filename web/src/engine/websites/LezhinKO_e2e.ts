import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lezhin-ko',
        title: 'Lezhin (Korean)'
    },
    container: {
        url: 'https://www.lezhin.com/ko/comic/brianoslab',
        id: '/ko/comic/brianoslab',
        title: `브리아노의 연구소`
    },
    child: {
        id: '/ko/comic/brianoslab/1',
        title: '연구소',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 1_700_930,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());