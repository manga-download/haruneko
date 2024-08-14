import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'magusmanga',
        title: 'MagusManga'
    },
    container: {
        url: 'https://oocini.biz/series/8042757755-absolute-threshold/',
        id: '/series/8042757755-absolute-threshold/',
        title: 'Absolute Threshold'
    },
    child: {
        id: '/7884971399-absolute-threshold-chapter-22/',
        title: 'Chapter 22'
    },
    entry: {
        index: 1,
        size: 718_960,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());