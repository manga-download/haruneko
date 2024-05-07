import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'nekomik',
        title: 'Nekomik'
    },
    container: {
        url: 'https://nekomik.me/manga/peerless-dad/',
        id: '/manga/peerless-dad/',
        title: 'Peerless Dad'
    },
    child: {
        id: '/peerless-dad-chapter-00/',
        title: 'Chapter 00'
    },
    entry: {
        index: 1,
        size: 57_374,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());