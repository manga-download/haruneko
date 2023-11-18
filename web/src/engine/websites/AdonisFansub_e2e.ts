import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'adonisfansub',
        title: 'AdonisFansub'
    },
    container: {
        url: 'https://manga.adonisfansub.com/manga/nyx-stay-night/',
        id: '/manga/nyx-stay-night/',
        title: 'Nyx Stay Night'
    },
    child: {
        id: '/nyx-stay-night-bolum-0/',
        title: 'Bölüm 0'
    },
    entry: {
        index: 0,
        size: -1,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());