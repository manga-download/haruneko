import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'championcross',
        title: 'Champion Cross'
    },
    container: {
        url: 'https://championcross.jp/series/50d8ea89cfc92/',
        id: '/series/50d8ea89cfc92/',
        title: 'あの頃、私たちは魔法使いでした。'
    },
    child: {
        id: '/episodes/13d4bf3743424/',
        title: '第1話　「桜が舞った日のこと」'
    },
    entry: {
        index: 0,
        size: 2_691_707,
        type: 'image/png'
    }
}).AssertWebsite();