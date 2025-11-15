import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sany',
        title: 'Sany'
    },
    container: {
        url: 'https://sanyteam.com/manga/khong-khoang-cach/',
        id: '/manga/khong-khoang-cach/',
        title: 'Không Khoảng Cách',
    },
    child: {
        id: '/khong-khoang-cach-chap-21/',
        title: 'Chap 21'
    },
    entry: {
        index: 1,
        size: 746_834,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();