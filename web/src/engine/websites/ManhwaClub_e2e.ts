import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwaclub',
        title: 'ManhwaHentai'
    },
    container: {
        url: 'https://manhwahentai.to/pornhwa/secret-class-uncensored/',
        id: JSON.stringify({ post: '66098', slug: '/pornhwa/secret-class-uncensored/' }),
        title: 'Secret Class Uncensored'
    },
    child: {
        id: '/pornhwa/secret-class-uncensored/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 170_686,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());