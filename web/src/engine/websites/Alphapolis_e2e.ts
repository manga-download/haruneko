import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const configOfficial: Config = {
    plugin: {
        id: 'alphapolis',
        title: 'ALPHAPOLIS (アルファポリス)'
    },
    container: {
        url: 'https://www.alphapolis.co.jp/manga/official/777000246',
        id: '/manga/official/777000246',
        title: '令嬢はまったりをご所望。'
    },
    child: {
        id: '/manga/official/777000246/2888',
        title: '第1回'
    },
    entry: {
        index: 0,
        size: 375_221,
        type: 'image/jpeg'
    }
};

const fixtureOfficial = new TestFixture(configOfficial);
describe(fixtureOfficial.Name, async () => (await fixtureOfficial.Connect()).AssertWebsite());

const configManga: Config = {
    plugin: {
        id: 'alphapolis',
        title: 'ALPHAPOLIS (アルファポリス)'
    },
    container: {
        url: 'https://www.alphapolis.co.jp/manga/853344814/118889164',
        id: '/manga/853344814/118889164',
        title: 'そのフラグをへし折りたい！'
    },
    child: {
        id: '/manga/853344814/118889164/episode/8516663',
        title: '闇に光るツーマンセル【1】'
    },
    entry: {
        index: 0,
        size: 217_919,
        type: 'image/jpeg'
    }
};

const fixtureManga = new TestFixture(configManga);
describe(fixtureManga.Name, async () => (await fixtureManga.Connect()).AssertWebsite());
