import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'kingofmanga',
        title: 'KingOfManga'
    },
    container: {
        url: 'https://myshojo.com/comics/the-tale-of-the-tiger-girl/',
        id: '/comics/the-tale-of-the-tiger-girl/',
        title: 'The Tale of the Tiger Girl',
    },
    child: {
        id: '/the-tale-of-the-tiger-girl-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 115_416,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();