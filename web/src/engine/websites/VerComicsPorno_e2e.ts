import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'vercomicsporno',
        title: 'VerComicsPorno'
    },
    container: {
        url: 'https://vercomicsporno.com/ghostlessm-hot-lessons-chapter-1-justice-league',
        id: '/ghostlessm-hot-lessons-chapter-1-justice-league',
        title: '[Ghostlessm] Hot Lessons Chapter 1 (Justice League)'
    },
    child: {
        id: '/ghostlessm-hot-lessons-chapter-1-justice-league',
        title: '[Ghostlessm] Hot Lessons Chapter 1 (Justice League)'
    },
    entry: {
        index: 0,
        size: 235_831,
        type: 'image/jpeg'
    }
}).AssertWebsite();