import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'pocketcomics',
        title: 'Pocket-Comics (コミコ)'
    },
    container: {
        url: 'https://www.pocketcomics.com/comic/10040',
        id: JSON.stringify({ id: '/comic/10040', lang: 'en-US' }),
        title: 'The Devilishly Trash Duke'
    },
    child: {
        id: '1',
        title: 'Prologue'
    },
    entry: {
        index: 0,
        size: 184_838,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
