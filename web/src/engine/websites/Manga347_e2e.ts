import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga347',
        title: 'Manga 347'
    },
    container: {
        url: 'https://manga347.com/manga/100-000-levels-of-body-refining-all-the-dogs-i-raise-are-the-emperor/18',
        id: '/manga/100-000-levels-of-body-refining-all-the-dogs-i-raise-are-the-emperor/18',
        title: '100,000 Levels of Body Refining : All the dogs I raise are the Emperor'
    },
    child: {
        id: '/manga/100-000-levels-of-body-refining-all-the-dogs-i-raise-are-the-emperor/chapter-306/28326',
        title: 'Chapter 306'
    },
    entry: {
        index: 0,
        size: 752_237,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());