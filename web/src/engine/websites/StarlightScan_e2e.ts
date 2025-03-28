import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'starlightscan',
        title: 'Starlight Scan'
    },
    container: {
        url: 'https://starligthscan.com/mangas/smell/',
        id: '/mangas/smell/',
        title: 'Smell'
    },
    child: {
        id: '/mangas/smell/?episodio=1',
        title: 'Capítulo 01'
    },
    entry: {
        index: 3,
        size: 966_989,
        type: 'image/png'
    }
}).AssertWebsite();