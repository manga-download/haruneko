import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwa18cc',
        title: 'Manhwa 18 (.cc)'
    },
    container: {
        url: 'https://manhwa18.cc/webtoon/lets-hang-out-from-today',
        id: '/webtoon/lets-hang-out-from-today',
        title: 'Let’s Hang Out from Today'
    },
    child: {
        id: '/webtoon/lets-hang-out-from-today/chapter-53',
        title: 'Chapter 53'
    },
    entry: {
        index: 0,
        size: 340_258,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());