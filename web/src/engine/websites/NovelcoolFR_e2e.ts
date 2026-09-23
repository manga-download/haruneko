import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'novelcool-fr',
        title: 'Novel Cool (French)'
    },
    container: {
        url: 'https://fr.novelcool.com/novel/Shingeki-No-Kyojin.html',
        id: '/novel/Shingeki-No-Kyojin.html',
        title: 'Shingeki No Kyojin',
    },
    child: {
        id: '/chapter/Vol-33-Ch-136-Offrez-votre-coeur-/5434209/',
        title: 'Vol. 33 Ch. 136 Offrez votre coeur!',
    },
    entry: {
        index: 1,
        size: 76_622,
        type: 'image/webp'
    }
}).AssertWebsite();