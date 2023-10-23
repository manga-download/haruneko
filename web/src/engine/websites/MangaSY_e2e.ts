import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangasy',
        title: 'Manga SY'
    },
    container: {
        url: 'https://www.mangasy.com/manga/his-thousands-romantic-tricks/',
        id: JSON.stringify({ post: '9476', slug: '/manga/his-thousands-romantic-tricks/' }),
        title: 'His Thousands Romantic Tricks'
    },
    child: {
        id: '/manga/his-thousands-romantic-tricks/chapter-157-the-end/',
        title: 'Chapter 157-The End',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 73_444,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());