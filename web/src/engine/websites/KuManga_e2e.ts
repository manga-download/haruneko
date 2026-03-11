import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kumanga',
        title: 'KuManga'
    },
    container: {
        url: 'https://www.kumanga.com/manga/341/komi-san-wa-komyushou-desu',
        id: '/manga/341/komi-san-wa-komyushou-desu',
        title: 'Komi-san wa Komyushou Desu'
    },
    child: {
        id: '/manga/341/capitulo/472',
        title: 'Capítulo 472'
    },
    entry: {
        index: 3,
        size: 203_503,
        type: 'image/jpeg'
    }
}).AssertWebsite();