import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cypherscans',
        title: 'CypherScans'
    },
    container: {
        url: 'https://cypheroscans.xyz/manga/solo-max-level-newbie/',
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
}).AssertWebsite();