import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'ngomik',
        title: 'Ngomik'
    },
    container: {
        url: 'https://ngomik.mom/manga/reborn-as-the-heavenly-demon/',
        id: '/manga/reborn-as-the-heavenly-demon/',
        title: 'Reborn as The Heavenly Demon'
    },
    child: {
        id: '/reborn-as-the-heavenly-demon-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 1,
        size: 168_025,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());