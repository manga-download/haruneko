import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lectormangalat',
        title: 'LectorManga (.Lat)'
    }, /* CloudFlare
    container: {
        url: 'https://lectormanga.lat/biblioteca/lily-of-the-valley/',
        id: JSON.stringify({ post: '18933', slug: '/biblioteca/lily-of-the-valley/'}),
        title: 'Lily of the valley'
    },
    child: {
        id: '/biblioteca/lily-of-the-valley/capitulo-10/',
        title: 'Capítulo 10'
    },
    entry: {
        index: 0,
        size: 610831,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());