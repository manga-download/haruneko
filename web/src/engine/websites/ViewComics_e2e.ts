import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'viewcomics',
        title: 'ViewComics'
    },
    container: {
        url: 'https://azcomix.me/comic/warhammer-40000-marneus-calgar-2020',
        id: '/comic/warhammer-40000-marneus-calgar-2020',
        title: 'Warhammer 40,000: Marneus Calgar (2020-)'
    },
    child: {
        id: '/warhammer-40000-marneus-calgar-2020/issue-1/full',
        title: 'Issue #1'
    },
    entry: {
        index: 0,
        size: 1_943_408,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();