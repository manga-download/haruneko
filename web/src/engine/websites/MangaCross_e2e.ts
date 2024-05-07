import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangacross',
        title: 'MangaCross'
    },
    container: {
        url: 'https://mangacross.jp/comics/watamaho/',
        id: 'watamaho',
        title: 'あの頃、私たちは魔法使いでした。'
    },
    child: {
        id: '/comics/watamaho/1',
        title: '第1話 「桜が舞った日のこと」'
    },
    entry: {
        index: 0,
        size: 897_673,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());