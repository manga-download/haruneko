import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nextscan',
        title: 'NextScan'
    },
    container: {
        url: 'https://www.nextscanid.my.id/2023/10/a-story-about-dragon-and-rising-of.html',
        id: '/2023/10/a-story-about-dragon-and-rising-of.html',
        title: 'A Story About a Dragon and the Rising of an Adventurer ~ A Healer Who Was Seen as Useless and Was Kicked Out From an S Rank Party, Goes off to Revive the Strongest Dragon in an Abandoned Area'
    },
    child: {
        id: '/2023/10/a-story-about-dragon-and-rising-of_29.html',
        title: 'Chapter 12'
    },
    entry: {
        index: 1,
        size: 422_176,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());