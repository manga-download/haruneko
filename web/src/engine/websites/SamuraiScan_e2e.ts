import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'samuraiscan',
        title: 'Samurai Scan'
    },
    container: {
        url: 'https://samurai.yoketo.xyz/rd/dios-marcial-estelar/',
        id: JSON.stringify({ post: '39', slug: '/rd/dios-marcial-estelar/' }),
        title: 'Dios Marcial Estelar'
    },
    child: {
        id: '/rd/dios-marcial-estelar/capitulo-1/',
        title: 'Capitulo 1',
    },
    entry: {
        index: 1,
        size: 106_120,
        type: 'image/webp'
    }
}).AssertWebsite();