import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangadoom',
        title: 'MangaDoom'
    },
    container: {
        url: 'https://www.mngdoom.com/against-the-gods/',
        id: '/against-the-gods/',
        title: 'Against the Gods'
    },
    child: {
        id: '/against-the-gods/594/all-pages',
        title: '594'
    },
    entry: {
        index: 0,
        size: 1_413_019,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());