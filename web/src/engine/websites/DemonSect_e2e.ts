import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'demonsect',
        title: 'Demon Sect',
        //timeout: 25000
    },
    container: {
        url: 'https://dsectcomics.org/comics/reencarnacao-maldita/',
        id: JSON.stringify({ post: '684', slug: '/comics/reencarnacao-maldita/' }),
        title: 'Reencarnação Maldita',
        //timeout: 30000
    },
    child: {
        id: '/comics/reencarnacao-maldita/cap-81/',
        title: 'CAP. 81',
        //timeout: 25000
    },
    entry: {
        index: 1,
        size: 523_180,
        type: 'image/webp',
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());