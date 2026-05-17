import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'qtoon',
        title: 'QToon'
    },
    container: {
        url: 'https://qqtoon.com/pt/detail/c_9h7GLWdlXrsrkT1XO7Eq',
        id: 'c_9h7GLWdlXrsrkT1XO7Eq',
        title: 'A Imperatriz Se Casou Novamente [pt]'
    },
    child: {
        id: 'e_1d2zPI0VKA5yf9KXWspt',
        title: 'Capítulo 178'
    },
    entry: {
        index: 0,
        size: 280_257,
        type: 'image/jpeg'
    }
}).AssertWebsite();