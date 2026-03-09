import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'turktoon',
        title: 'Turktoon'
    },
    container: {
        url: 'https://www.turktoon.com/2025/04/i-am-evil-god-manhua.html',
        id: '/2025/04/i-am-evil-god-manhua.html',
        title: 'I am an Evil God'
    },
    child: {
        id: '/2025/05/i-am-evil-god-bolum-130.html',
        title: 'Bölüm 130'
    },
    entry: {
        index: 3,
        size: 493_313,
        type: 'image/jpeg'
    }
}).AssertWebsite();