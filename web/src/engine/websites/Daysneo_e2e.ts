import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'daysneo',
        title: 'Daysneo'
    },
    container: {
        url: 'https://daysneo.com/works/6df9b7a6558d937a366c62ae4d1aee44.html',
        id: '/works/6df9b7a6558d937a366c62ae4d1aee44.html',
        title: 'めぐりん*めぐるん'
    },
    child: {
        id: '/works/6df9b7a6558d937a366c62ae4d1aee44/episode/9e0dc3a7f2e1bf6851654d0b0f098f0c.html',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 108_761,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());