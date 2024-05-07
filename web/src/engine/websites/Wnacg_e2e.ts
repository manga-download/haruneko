import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'wnacg',
        title: 'Wnacg'
    },
    container: {
        url: 'https://www.wnacg.com/photos-index-aid-201161.html',
        id: '/photos-index-aid-201161.html',
        title: '[楝蛙] つづきから (COMIC 快楽天 2021年8月号) [無修正]'
    },
    child: {
        id: '/photos-index-aid-201161.html',
        title: '[楝蛙] つづきから (COMIC 快楽天 2021年8月号) [無修正]'
    },
    entry: {
        index: 0,
        size: 291_243,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());