import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ikigaimangas',
        title: 'Ikigai Mangas'
    },
    container: {
        url: 'https://visualikigai.glovix.one/series/jinx-manhwa/',
        id: '/series/jinx-manhwa/',
        title: 'Jinx'
    },
    child: {
        id: '/capitulo/1097548914620071937/',
        title: 'Capítulo 74'
    },
    entry: {
        index: 13,
        size: 881_469,
        type: 'image/jpeg'
    }
}).AssertWebsite();