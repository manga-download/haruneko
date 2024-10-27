import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'arabshentai',
        title: 'ArabsHentai'
    },
    container: {
        url: 'https://arabshentai.com/manga/benefactors-daughters/',
        id: '/manga/benefactors-daughters/',
        title: 'اخوتي بالتبني'
    },
    child: {
        id: '/manga/benefactors-daughters/14_021303',
        title: '14'
    },
    entry: {
        index: 0,
        size: 1_132_098,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();