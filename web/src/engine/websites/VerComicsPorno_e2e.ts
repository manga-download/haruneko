import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'vercomicsporno',
        title: 'VerComicsPorno'
    }, /* CloudFlare
    container: {
        url: 'https://vercomicsporno.com/ghostlessm-hot-lessons-chapter-1-justice-league',
        id: '/ghostlessm-hot-lessons-chapter-1-justice-league',
        title: '[Ghostlessm] Hot Lessons Chapter 1 (Justice League)'
    },
    child: {
        id: '/ghostlessm-hot-lessons-chapter-1-justice-league',
        title: '[Ghostlessm] Hot Lessons Chapter 1 (Justice League)'
    },
    entry: {
        index: 0,
        size: 235_831,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());