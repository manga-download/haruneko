import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'topmanhua',
        title: 'Top Manhua'
    },
    container: {
        url: 'https://www.topmanhua.com/manhua/the-heroine-had-an-affair-with-my-fiance/',
        id: JSON.stringify({ post: '89119', slug: '/manhua/the-heroine-had-an-affair-with-my-fiance/' }),
        title: 'The Heroine Had an Affair with My Fiance'
    },
    child: {
        id: '/manhua/the-heroine-had-an-affair-with-my-fiance/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 527_616,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());