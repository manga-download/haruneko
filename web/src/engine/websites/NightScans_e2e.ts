import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nightscans',
        title: 'NightScans'
    },
    container: {
        url: 'https://nightsup.net/series/4190634673-all-football-talents-are-mine/',
        id: '/series/4190634673-all-football-talents-are-mine/',
        title: 'All Football Talents Are Mine'
    },
    child: {
        id: '/8781815493-all-football-talents-are-mine-chapter-20/',
        title: 'Chapter 20'
    },
    entry: {
        index: 1,
        size: 223_172,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();