import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'smangavf',
        title: 'SMangaVF'
    },
    container: {
        url: 'https://scan-manga.me/manga/tales-of-demons-and-gods-scan',
        id: '/manga/tales-of-demons-and-gods-scan',
        title: 'Tales Of Demons And Gods'
    },
    child: {
        id: '/manga/tales-of-demons-and-gods-scan/426.5',
        title: '426.5'
    },
    entry: {
        index: 0,
        size: 1_221_835,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());