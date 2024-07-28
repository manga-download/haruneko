import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicaction',
        title: 'webアクション (Comic Action)'
    },
    container: {
        url: 'https://comic-action.com/episode/13933686331665056851',
        id: '/episode/13933686331665056851',
        title: 'ダンジョンの中のひと'
    },
    child: {
        id: '/episode/13933686331665056851',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 712_291,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());