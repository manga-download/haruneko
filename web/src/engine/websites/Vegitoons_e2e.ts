import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'vegitoons',
        title: 'Vegitoons'
    },
    container: {
        url: 'https://vegitoons.black/obra/10946',
        id: '10946',
        title: 'A 101ª Heroína'
    },
    child: {
        id: '411704',
        title: 'Capítulo 71'
    },
    entry: {
        index: 0,
        size: 182_572,
        type: 'image/jpeg'
    }
}).AssertWebsite();