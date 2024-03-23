import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuascarlet',
        title: 'Manhua Scarlet'
    },
    container: {
        url: 'https://manhuascarlet.com/series/i-have-a-dragon-in-my-body/',
        id: '/series/i-have-a-dragon-in-my-body/',
        title: 'I Have a Dragon in My Body'
    },
    child: {
        id: '/i-have-a-dragon-in-my-body-chapter-1/',
        title: 'الفصل 1'
    },
    entry: {
        index: 0,
        size: 177_066,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());