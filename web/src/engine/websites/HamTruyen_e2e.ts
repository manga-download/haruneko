import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hamtruyen',
        title: 'HamTruyen'
    },
    container: {
        url: 'https://hamtruyen.info/em-chong-say-dam-toi-0.html',
        id: '/em-chong-say-dam-toi-0.html',
        title: 'Em chồng say đắm tôi'
    },
    child: {
        id: '/doc-truyen/em-chong-say-dam-toi-chapter-35.html',
        title: 'chapter 35'
    },
    entry: {
        index: 1,
        size: 365_442,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();