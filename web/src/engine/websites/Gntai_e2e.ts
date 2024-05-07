import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gntai',
        title: 'GNTAI'
    },
    container: {
        url: 'https://www.gntai.net/mangas-hentai/la-lluvia-es-como-una-manta/',
        id: '/mangas-hentai/la-lluvia-es-como-una-manta/',
        title: 'La lluvia es como una manta'
    },
    child: {
        id: '/mangas-hentai/la-lluvia-es-como-una-manta/',
        title: 'La lluvia es como una manta'
    },
    entry: {
        index: 0,
        size: 420_020,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());