import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'topmanhua',
        title: 'Top Manhua'
    },
    container: {
        url: 'https://manhuatop.org/manhua/the-heroine-had-an-affair-with-my-fiance/',
        id: '/manhua/the-heroine-had-an-affair-with-my-fiance/',
        title: 'The Heroine Had an Affair with My Fiance'
    },
    child: {
        id: '/manhua/the-heroine-had-an-affair-with-my-fiance/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 527_616,
        type: 'image/jpeg'
    }
}).AssertWebsite();