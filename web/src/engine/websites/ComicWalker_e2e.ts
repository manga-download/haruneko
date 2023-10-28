import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comicwalker',
        title: 'コミックウォーカー (ComicWalker)'
    },
    container: {
        url: 'https://comic-walker.com/contents/detail/KDCW_AM06204400010000_68/',
        id: '/contents/detail/KDCW_AM06204400010000_68/',
        title: 'いつかのLo-fiみゅーじっく'
    },
    child: {
        id: '/viewer/?tw=2&dlcl=ja&cid=KDCW_AM06204400010001_68',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 133_710,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());