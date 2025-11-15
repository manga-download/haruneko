import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: '3hentai',
        title: '3Hentai'
    },
    container: {
        url: 'https://ru.3hentai.net/d/529276',
        id: '/d/529276',
        title: 'Administrator Privileges | Привилегии администратора'
    },
    child: {
        id: '/d/529276',
        title: 'Administrator Privileges | Привилегии администратора'
    },
    entry: {
        index: 0,
        size: 46_776,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();