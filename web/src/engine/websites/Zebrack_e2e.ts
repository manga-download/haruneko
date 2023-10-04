import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'zebrack',
        title: 'Zebrack(ゼブラック)'
    },
    container: {
        url: 'https://zebrack-comic.shueisha.co.jp/magazine/1/issue/14486/detail',
        id: '/magazine/1/issue/14486/detail',
        title: '週刊少年ジャンプ 2023年44号'
    },
    child: {
        id: 'magazine/1/14486',
        title: '週刊少年ジャンプ 2023年44号'
    },
    entry: {
        index: 0,
        size: 485_738,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());