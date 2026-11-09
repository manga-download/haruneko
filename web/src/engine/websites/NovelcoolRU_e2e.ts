import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'novelcool-ru',
        title: 'Novel Cool (Russian)'
    },
    container: {
        url: 'https://ru.novelcool.com/novel/Infinite-Wizard.html',
        id: '/novel/Infinite-Wizard.html',
        title: 'Безграничный маг',
    },
    child: {
        id: encodeURI('/chapter/Том 3 Глава 185/14815079/'),
        title: 'Том 3 Глава 185',
    },
    entry: {
        index: 1,
        size: 72_570,
        type: 'image/webp'
    }
}).AssertWebsite();