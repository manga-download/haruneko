import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'webtoontrnet',
        title: 'Webtoon TR'
    },
    container: {
        url: 'https://webtoontr.net/webtoon/the-margraves-bastard-used-to-be-the-emperor/',
        id: JSON.stringify({ post: '14522', slug: '/webtoon/the-margraves-bastard-used-to-be-the-emperor/' }),
        title: 'The Margrave’s Bastard Used to be the Emperor'
    },
    child: {
        id: '/webtoon/the-margraves-bastard-used-to-be-the-emperor/bolum-44/',
        title: 'Bölüm 44'
    },
    entry: {
        index: 0,
        size: 157_284,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();