import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tksuperherocomics',
        title: 'Televi-kun Superhero Comics (てれびくんスーパーヒーローコミックス)'
    },
    container: {
        url: 'https://televikun-super-hero-comics.com/rensai/theheroisinside/',
        id: '/rensai/theheroisinside/',
        title: 'ヒーローは中にいる！'
    },
    child: {
        id: '/rensai/theheroisinside/episode-017/',
        title: '17話 合宿スタート！！',
    },
    entry: {
        index: 0,
        size: 2_021_320,
        type: 'image/png'
    }
}).AssertWebsite();