import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'arcanefansub',
        title: 'Arcane Fansub'
    },
    container: {
        url: 'https://arcanefansub.com/manga/aishiteru-game-wo-owarasetai/',
        id: '/manga/aishiteru-game-wo-owarasetai/',
        title: 'Aishiteru Game wo Owarasetai'
    },
    child: {
        id: '/aishiteru-game-wo-owarasetai-bolum-10-5/',
        title: 'Bölüm 10.5'
    },
    entry: {
        index: 1,
        size: 527_536,
        type: 'image/jpeg'
    }
}).AssertWebsite();