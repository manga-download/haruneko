import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'patimanga',
        title: 'PatiManga'
    },
    container: {
        url: 'https://www.patimanga.com/manga/yeniden-dogan-alev/',
        id: '/manga/yeniden-dogan-alev/',
        title: 'Alevin Doğuşu'
    },
    child: {
        id: '/alevin-dogusu-bolum-23/',
        title: 'Bölüm 23'
    },
    entry: {
        index: 0,
        size: 383_576,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();