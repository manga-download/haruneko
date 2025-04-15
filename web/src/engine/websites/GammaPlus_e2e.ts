import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'gammaplus',
        title: 'GammaPlus'
    },
    container: {
        url: 'https://gammaplus.takeshobo.co.jp/manga/medusa/',
        id: '/manga/medusa/',
        title: '人妻メデュサさんとのNTR生活'
    },
    child: {
        id: '/_files/medusa/01/',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 1_026_940,
        type: 'image/png'
    }
}).AssertWebsite();