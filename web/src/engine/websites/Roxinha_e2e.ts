import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'roxinha',
        title: 'Roxinha'
    },
    container: {
        url: 'https://roxinha.online/manga/1010',
        id: '1010',
        title: 'Essência da Reencarnação'
    },
    child: {
        id: '181839',
        title: 'Capítulo 189'
    },
    entry: {
        index: 2,
        size: 230_438,
        type: 'image/webp'
    }
}).AssertWebsite();