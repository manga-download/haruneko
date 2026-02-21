import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cosmoscans',
        title: 'Cosmo Scans'
    },
    container: {
        url: 'https://www.cosmoscans.com/manga/becoming-a-cheat-level-skill-thief/',
        id: '/manga/becoming-a-cheat-level-skill-thief/',
        title: 'Becoming a Cheat-Level Skill Thief'
    },
    child: {
        id: '/becoming-a-cheat-level-skill-thief-bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 2,
        size: 921_410,
        type: 'image/jpeg'
    }
}).AssertWebsite();