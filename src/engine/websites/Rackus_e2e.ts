import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'rackus',
        title: 'Rackus'
    },
    container: {
        url: 'https://rackusreads.com/manga/the-female-lead-acquires-cheat-skills/',
        id: '/manga/the-female-lead-acquires-cheat-skills/',
        title: 'The Female Lead Acquires Cheat Skills'
    },
    child: {
        id: '/the-female-lead-acquires-cheat-skills-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 719_764,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();