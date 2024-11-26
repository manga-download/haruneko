import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'allhentai',
        title: 'AllHentai'
    },
    container: {
        url: 'https://20.allhen.online/nochiu_ona_nimfomanka',
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
};

new TestFixture(config).AssertWebsite();