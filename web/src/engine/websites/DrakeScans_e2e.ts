import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'drakescans',
        title: 'DrakeScans'
    },
    container: {
        url: 'https://drakescans.com/series/im-stuck-on-the-same-day-for-a-thousand-years/',
        id: JSON.stringify({ post: '1239', slug: '/series/im-stuck-on-the-same-day-for-a-thousand-years/'}),
        title: 'I’m Stuck On The Same Day For A Thousand Years'
    },
    child: {
        id: '/series/im-stuck-on-the-same-day-for-a-thousand-years/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 684_501,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());