import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'laimanhua8',
        title: 'Laimanhua8'
    },
    container: {
        url: 'https://www.laimanhua88.com/kanmanhua/jiandieguojiajia/',
        id: '/kanmanhua/jiandieguojiajia/',
        title: '间谍过家家'
    },
    child: {
        id: '/kanmanhua/jiandieguojiajia/30110070.html',
        title: '第70话 试看版'
    },
    entry: {
        index: 0,
        size: 252_049, // Polished image size may vary => https://developers.cloudflare.com/images/polish/
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();