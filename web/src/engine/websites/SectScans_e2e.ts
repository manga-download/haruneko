import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sectscans',
        title: 'Sect Scans'
    },
    container: {
        url: 'https://sectscans.com/comics/the-son-of-the-first-emperor-kills-enemies-and-becomes-a-god/',
        id: JSON.stringify({ post: '1843', slug: '/comics/the-son-of-the-first-emperor-kills-enemies-and-becomes-a-god/' }),
        title: 'The Son Of The First Emperor Kills Enemies And Becomes A God'
    },
    child: {
        id: '/comics/the-son-of-the-first-emperor-kills-enemies-and-becomes-a-god/chapter-80/',
        title: 'Chapter 80'
    },
    entry: {
        index: 1,
        size: 149_850,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());