import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rawmangasu',
        title: 'RawManga (.su)'
    },
    container: {
        url: 'https://rawmanga.su/r/私、ただいま憑依中です/',
        id: JSON.stringify({ post: '157225', slug: encodeURI('/r/私、ただいま憑依中です/') }),
        title: '私、ただいま憑依中です!'
    },
    child: {
        id: encodeURI('/r/私、ただいま憑依中です/第70話/').toLowerCase(),
        title: '第70話'
    },
    entry: {
        index: 0,
        size: 588_968,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();