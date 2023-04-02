import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'cycomi',
        title: 'CyComi'
    },
    container: {
        url: 'https://cycomi.com/title/156',
        id: '156',
        title: 'あなたは私におとされたい'
    },
    child: {
        id: '12036',
        title: '第１話 - ジュウネンメノボクタチ'
    },
    entry: {
        index: 0,
        size: 219_613,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());