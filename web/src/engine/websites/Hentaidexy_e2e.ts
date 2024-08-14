import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentaidexy',
        title: 'Hentaidexy'
    },
    container: {
        url: 'https://dexyscan.com/manga/66afa9ad8b11e637395b2e60/second-life-ranker',
        id: '66afa9ad8b11e637395b2e60',
        title: 'Second Life Ranker'
    },
    child: {
        id: '66afb16a8b11e637395b4471',
        title: 'Chapter 161'
    },
    entry: {
        index: 0,
        size: 821_246,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());