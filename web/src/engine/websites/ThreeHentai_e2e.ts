import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: '3hentai',
        title: '3Hentai'
    },
    container: {
        url: 'https://ru.3hentai.net/d/33417',
        id: '/d/33417',
        title: 'Kenka suru hodo Naka ga Are'
    },
    child: {
        id: '/d/33417/1',
        title: 'Kenka suru hodo Naka ga Are'
    },
    entry: {
        index: 0,
        size: 437_188,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());