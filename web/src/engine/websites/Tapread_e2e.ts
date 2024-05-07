import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tapread',
        title: 'Tapread'
    },
    container: {
        url: 'https://www.tapread.com/comic/detail/570',
        id: '570',
        title: 'Don\'t Kiss Me, Demon'
    },
    child: {
        id: '278742',
        title: '1 - 001'
    },
    entry: {
        index: 0,
        size: 165_534,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());