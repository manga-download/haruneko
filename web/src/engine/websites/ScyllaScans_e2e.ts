import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scyllascans',
        title: 'Scylla Scans'
    },
    container: {
        url: 'https://scyllacomics.xyz/manga/alya-sometimes-hides-her-feelings-in-russian',
        id: '/manga/alya-sometimes-hides-her-feelings-in-russian',
        title: 'Alya Sometimes Hides Her Feelings in Russian'
    },
    child: {
        id: '/manga/alya-sometimes-hides-her-feelings-in-russian/36',
        title: 'Chapter 36'
    },
    entry: {
        index: 1,
        size: 1_698_143,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());