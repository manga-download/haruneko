import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manhwaindo',
        title: 'ManhwaIndo'
    },
    container: {
        url: 'https://manhwaindo.id/series/9th-class-sword-master/',
        id: '/series/9th-class-sword-master/',
        title: '9th Class Sword Master'
    },
    child: {
        id: '/9th-class-sword-master-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 84_843,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());