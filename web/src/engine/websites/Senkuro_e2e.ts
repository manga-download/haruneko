import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'senkuro',
        title: 'Senkuro'
    },
    container: {
        url: 'https://senkuro.com/manga/yuanlai-wo-zao-jiu-wudile',
        id: 'yuanlai-wo-zao-jiu-wudile',
        title: 'Yuanlai Wo Zao Jiu Wudile'
    },
    child: {
        id: '168044841786166522',
        title: 'Том 1 Глава 155'
    },
    entry: {
        index: 0,
        size: 1_530_765,
        type: 'image/jpeg'
    }
}).AssertWebsite();