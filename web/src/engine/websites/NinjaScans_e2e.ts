import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninjascans',
        title: 'Ninja Scans',
    },
    container: {
        url: 'https://ninjacomics.xyz/manga/o-antigo-soberano-da-eternidade/',
        id: JSON.stringify({ post: '2047', slug: '/manga/o-antigo-soberano-da-eternidade/' }),
        title: 'O Antigo Soberano da Eternidade',
    },
    child: {
        id: '/manga/o-antigo-soberano-da-eternidade/capitulo-484/',
        title: 'Capítulo 484',
    },
    entry: {
        index: 2,
        size: 1_058_406,
        type: 'image/webp',
    },
}).AssertWebsite();