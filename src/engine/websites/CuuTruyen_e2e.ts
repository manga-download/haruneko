import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cuutruyen',
        title: 'Cứu Truyện'
    },
    container: {
        url: 'https://cuutruyen.net/mangas/156',
        id: '156',
        title: 'My Hero Academia (FULL HD)'
    },
    child: {
        id: '36660',
        title: 'Chapter 430 : MY HERO ACADEMIA'
    },
    entry: {
        index: 0,
        size: 3_524_798,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();