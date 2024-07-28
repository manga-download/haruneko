import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        index: 13,
        size: 527_088,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());