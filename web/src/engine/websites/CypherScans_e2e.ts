import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cypherscans',
        title: 'CypherScans'
    },
    container: {
        url: 'https://cypho-scans.xyz/manga/solo-max-level-newbie/',
        id: '/manga/solo-max-level-newbie/',
        title: 'Solo Max-Level Newbie'
    },
    child: {
        id: '/solo-max-level-newbie-chapter-130/',
        title: 'Chapter 130'
    },
    entry: {
        index: 0,
        size: 823_040,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();