import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicogyaaa',
        title: 'Comic Ogyaaa'
    },
    container: {
        url: 'https://comic-ogyaaa.com/episode/3269754496895640012',
        id: '/episode/3269754496895640012',
        title: 'ネコロポリス計画定例集会'
    },
    child: {
        id: '/episode/3269754496895640012',
        title: '第１話 ネコVSストリートファイター'
    },
    entry: {
        index: 0,
        size: 1_180_749,
        type: 'image/png'
    }
}).AssertWebsite();