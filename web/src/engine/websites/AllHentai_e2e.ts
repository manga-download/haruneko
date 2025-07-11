import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'allhentai',
        title: 'AllHentai'
    },
    container: {
        url: 'https://z.allhen.online/nochiu_ona_nimfomanka',
        id: '/nochiu_ona_nimfomanka',
        title: 'Ночью она нимфоманка'
    },
/*   Need to be logged, and chapter link change with user id anyway

    child: {
        id: '/nochiu_ona_nimfomanka/vol1/4?mtr=1',
        title: '1 - 1',
    },
    entry: {
        index: 0,
        size: 155_934,
        type: 'image/png'
    }*/
}).AssertWebsite();