import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangabat',
        title: 'MangaBat'
    },
    container: {
        url: 'https://readmangabat.com/read-jv387640',
        id: 'https://readmangabat.com/read-jv387640',
        title: 'The Devil Ring',
    },
    child: {
        id: 'https://readmangabat.com/read-jv387640-chap-162',
        title: 'Chapter 162'
    },
    entry: {
        index: 1,
        size: 232_046,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();