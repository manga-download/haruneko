import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicryu',
        title: 'COMICリュウ'
    },
    container: {
        url: 'https://www.comic-ryu.jp/_zingnize/index.html',
        id: '/_zingnize/index.html',
        title: 'ZINGNIZE'
    },
    child: {
        id: '/_zingnize/comic/01.html',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 1_103_078,
        type: 'image/jpeg',
        timeout: 15000
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());