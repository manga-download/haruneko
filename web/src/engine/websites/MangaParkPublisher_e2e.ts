import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga-park',
        title: 'マンガPark (Manga-Park)'
    },
    container: {
        url: 'https://manga-park.com/title/72515',
        id: '/title/72515',
        title: '放課後、生徒会室で'
    },
    child: {
        id: '606536',
        title: '1 - 第1話①'
    },
    entry: {
        index: 0,
        size: 194_900,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());