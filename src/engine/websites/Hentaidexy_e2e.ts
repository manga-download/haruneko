import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentaidexy',
        title: 'Hentaidexy'
    },
    container: {
        url: 'https://hentaidexy.com/reads/second-life-ranker/',
        id: JSON.stringify({ post: '1425', slug: '/reads/second-life-ranker/' }),
        title: 'Second Life Ranker'
    },
    child: {
        id: '/reads/second-life-ranker/second-life-ranker/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 440_071,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());