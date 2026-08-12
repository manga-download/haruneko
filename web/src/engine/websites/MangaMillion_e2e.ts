import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangamillion',
        title: 'Manga Million'
    },
    container: {
        url: 'https://mangamillion.shueisha.co.jp/en/title/1087',
        id: '1087',
        title: 'Claymore'
    },
    child: {
        id: '98278',
        title: '#001 Scene 1:Silver-eyed Slayer [de]'
    },
    entry: {
        index: 0,
        size: 115_380,
        type: 'image/webp'
    }
}).AssertWebsite();