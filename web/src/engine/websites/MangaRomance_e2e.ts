import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaromance',
        title: 'Manga Romance'
    },
    container: {
        url: 'https://www.mangaromance.eu/search/label/Almight%20Network?&max-results=20',
        id: encodeURIComponent('Almight Network'),
        title: 'Almight Network'
    },
    child: {
        id: '/2020/02/almight-network-chapter-125-english.html',
        title: 'Chapter 125'
    },
    entry: {
        index: 0,
        size: 202_679,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());