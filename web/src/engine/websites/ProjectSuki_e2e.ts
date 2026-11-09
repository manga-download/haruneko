import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'projectsuki',
        title: 'Project Suki'
    },
    container: {
        url: 'https://projectsuki.com/book/207989',
        id: '/book/207989',
        title: 'Absolute Sword Sense'
    },
    child: {
        id: '/read/207989/34655/1',
        title: 'Chapter 89'
    },
    entry: {
        index: 0,
        size: 336_404,
        type: 'image/webp'
    }
}).AssertWebsite();