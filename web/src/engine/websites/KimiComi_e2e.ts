import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kimicomi',
        title: 'キミコミ (KimiComi)'
    },
    container: {
        url: 'https://kimicomi.com/series/8953ca38bf1f6',
        id: '/series/8953ca38bf1f6',
        title: 'ニートだけどハロワにいったら異世界につれてかれた'
    },
    child: {
        id: '/episodes/54a5fbfee6ed7/',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 1_538_095,
        type: 'image/jpeg',
        timeout: 10000
    }
}).AssertWebsite();