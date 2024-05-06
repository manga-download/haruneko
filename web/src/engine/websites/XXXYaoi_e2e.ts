import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'xxxyaoi',
        title: 'XXXYaoi'
    },
    container: {
        url: 'https://3xyaoi.com/bl/love-is-an-illusion/',
        id: JSON.stringify({ slug: '/bl/love-is-an-illusion/' }),
        title: 'Love is an Illusion'
    },
    child: {
        id: '/bl/love-is-an-illusion/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 234_602,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());