import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicgrowl',
        title: 'コミックグロウル (Comic Growl)'
    },
    container: {
        url: 'https://comic-growl.com/episode/4856001361503716077',
        id: '/episode/4856001361503716077',
        title: 'LatteComi 悪役令嬢？ いいえお転婆娘です〜ざまぁなんて言いません〜アンソロジーコミック'
    },
    child: {
        id: '/episode/4856001361503716077',
        title: '悪役令嬢？ いいえお転婆娘です〜ざまぁなんて言いません〜 試し読み'
    },
    entry: {
        index: 0,
        size: 5_489_763,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());