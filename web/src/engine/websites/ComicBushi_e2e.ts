import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicbushi',
        title: 'コミックブシロードWEB (Comic Bushiroad WEB)'
    },
    container: {
        url: 'https://comicbushi-web.com/episode/4856001361518745875',
        id: '/episode/4856001361518745875',
        title: 'LatteComi 悪役令嬢？ いいえお転婆娘です〜ざまぁなんて言いません〜アンソロジーコミック'
    },
    child: {
        id: '/episode/4856001361518745871',
        title: '「モブ扱いされる俺は身分を隠して学園に通う王太子なんだけど、君たちが王太子と信じてやまないハイスペックイケメンは侯爵家のご令嬢だ。」前編'
    },
    entry: {
        index: 0,
        size: 676_924,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());