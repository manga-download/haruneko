import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gmanga',
        title: 'GManga'
    },
    container: {
        url: 'https://gmanga.me/mangas/17240/oh-my-devil',
        id: '17240' ,
        title: 'Oh, My Devil'
    },
    child: {
        id: '17240/Oh, My Devil/19/373162',
        title: 'Vol.0 Ch.19 [Strawberry 🫐🍰]'
    },
    entry: {
        index: 1,
        size: 883_053,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());