import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuako',
        title: 'ManhuaKo'
    },
    container: {
        url: 'https://manhuako.com/manhua/martial-peak',
        id: '/manhua/martial-peak',
        title: 'Martial Peak'
    },
    child: {
        id: '/manhua/martial-peak/chapter-3707',
        title: '3707'
    },
    entry: {
        index: 1,
        size: 554_019,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());