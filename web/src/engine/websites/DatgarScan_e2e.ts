import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'datgarscan',
        title: 'Datgar Scan'
    },
    container: {
        url: 'https://datgarscanlation.blogspot.com/2023/03/myo-chan-sensei-wa-kaku-katariki.html',
        id: '/2023/03/myo-chan-sensei-wa-kaku-katariki.html',
        title: 'Myo-chan Sensei Wa Kaku Katariki'
    },
    child: {
        id: '/2025/05/cap-61.html',
        title: 'Cap 61'
    },
    entry: {
        index: 3,
        size: 694_388,
        type: 'image/jpeg'
    }
}).AssertWebsite();