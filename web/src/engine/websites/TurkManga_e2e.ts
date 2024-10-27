import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'turkmanga',
        title: 'TurkManga'
    },
    container: {
        url: 'https://turkmanga.com.tr/manga/mercenary-enrollment',
        id: '/manga/mercenary-enrollment',
        title: 'Mercenary Enrollment'
    },
    child: {
        id: 'bolum-196',
        title: 'Bölüm 195'
    },
    entry: {
        index: 1,
        size: 1_496_390,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();