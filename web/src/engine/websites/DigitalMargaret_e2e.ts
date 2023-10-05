import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'digitalmargaret',
        title: 'デジタルマーガレット (Digital Margaret)'
    },
    container: {
        url: 'https://digitalmargaret.jp/detail/sakuranoyouna/',
        id: '/detail/sakuranoyouna/',
        title: '桜のような僕の恋人'
    },
    child: {
        id: '/contents/sakuranoyouna/230101_1-1Tx3bCnGJ',
        title: '第1-1話'
    },
    entry: {
        index: 0,
        size: 964_808,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());