import { TestFixture } from '../../../test/WebsitesFixture';

//test with local cdn
new TestFixture({
    plugin: {
        id: 'reaperscans',
        title: 'Reaper Scans'
    },
    container: {
        url: 'https://reaperscans.com/series/990k-ex-life-hunter',
        id: JSON.stringify({ id: '49', slug: '990k-ex-life-hunter' }),
        title: '990k Ex-Life Hunter',
    },
    child: {
        id: JSON.stringify({ id: '6145', slug: 'chapter-74' }),
        title: 'Chapter 74',
    },
    entry: {
        index: 0,
        size: 432_585,
        type: 'image/jpeg'
    }
}).AssertWebsite();

//test with s3 cdn
new TestFixture({
    plugin: {
        id: 'reaperscans',
        title: 'Reaper Scans'
    },
    container: {
        url: 'https://reaperscans.com/series/regressing-as-the-reincarnated-bastard-of-the-sword-clan-811',
        id: JSON.stringify({ id: '228', slug: 'regressing-as-the-reincarnated-bastard-of-the-sword-clan-811' }),
        title: 'Regressing as the Reincarnated Bastard of the Sword Clan',
    },
    child: {
        id: JSON.stringify({ id: '20499', slug: 'chapter-34' }),
        title: 'Chapter 34',
    },
    entry: {
        index: 0,
        size: 367_069,
        type: 'image/jpeg'
    }
}).AssertWebsite();