import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangabtt',
        title: 'MangaBTT'
    },
    container: {
        url: 'https://rawlampo.com/manga/sss-grade-saint-knight-67753',
        id: '/manga/sss-grade-saint-knight-67753',
        title: 'SSS Grade Saint Knight'
    },
    child: {
        id: '/manga/sss-grade-saint-knight/chapter-17-eng-li/733713',
        title: 'Chapter 17'
    },
    entry: {
        index: 0,
        size: 828_203,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());