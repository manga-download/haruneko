import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicbrise',
        title: 'Comic-Brise'
    },
    container: {
        url: 'https://www.comic-brise.com/contents/mobu/',
        id: '/contents/mobu/',
        title: 'モブ顔令嬢～乙女ゲー世界の悪役令嬢に転生したのにどうしてこうなった～'
    },
    child: {
        id: '/comic_ep/mobu_ep1',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 4_607_990,
        type: 'image/png',
        timeout: 10000
    }
};

new TestFixture(config).AssertWebsite();