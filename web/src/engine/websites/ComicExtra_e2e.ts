import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicextra',
        title: 'ComicExtra'
    },
    container: {
        url: 'https://comicextra.org/comic/grimm-fairy-tales-2016',
        id: '/comic/grimm-fairy-tales-2016',
        title: 'Grimm Fairy Tales (2016)'
    },
    child: {
        id: '/grimm-fairy-tales-2016/issue-2023-swimsuit-special/full',
        title: '#2023 Swimsuit Special'
    },
    entry: {
        index: 0,
        size: 349_415,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());