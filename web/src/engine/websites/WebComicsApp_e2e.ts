import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'webcomicsapp',
        title: 'WebComicsApp',
    },
    container: {
        url: 'https://www.webcomicsapp.com/comic/The-Last-Hero/60af57208c252b2d960bf732',
        id: '60af57208c252b2d960bf732',
        title: 'The Last Hero'
    },
    child: {
        id: '1',
        title: 'Ch. 0 Prologue'
    },
    entry: {
        index: 0,
        size: 51_713,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());