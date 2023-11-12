import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicride',
        title: 'ComicRide',
        timeout: 45000
    },
    container: {
        url: 'https://www.comicride.jp//book/kamihatsu/index.html', //purposedly test a bad url like comicride can give us
        id: '/book/kamihatsu/',
        title: '神の遣いの少女は初恋の将軍にすべてを捧ぐ'
    },
    child: {
        id: '/viewer/kamihatsu/kamihatsu_001/',
        title: '-第１話-'
    },
    entry: {
        index: 0,
        size: 2_549_444,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());