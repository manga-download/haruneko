import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'kuimh',
        title: '酷爱漫画 (Kuimh)'
    },
    container: {
        url: 'https://www.kuimh.com/book/mh11568',
        id: '/book/mh11568',
        title: '被大公家领养的圣女',
    },
    child: {
        id: '/chapter/393045-3747909',
        title: '序章',
    },
    entry: {
        index: 0,
        size: 34_815,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());