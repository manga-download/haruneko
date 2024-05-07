import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'origamiorpheans',
        title: 'ORIGAMI ORPHEANS'
    },
    container: {
        url: 'https://origami-orpheans.com/manga/harukana-receive/',
        id: '/manga/harukana-receive/',
        title: 'Harukana Receive'
    },
    child: {
        id: '/harukana-receive-cap-46/',
        title: 'Capítulo 46'
    },
    entry: {
        index: 1,
        size: 5_139_847,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());