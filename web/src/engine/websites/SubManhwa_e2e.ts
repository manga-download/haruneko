import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'submanhwa',
        title: 'SubManhwa'
    },
    container: {
        url: 'https://submanhwa.com/serie/esta-bien-que-una-hermana-imaginaria-se-enamore-de-un-joven-monje',
        id: '/serie/esta-bien-que-una-hermana-imaginaria-se-enamore-de-un-joven-monje',
        title: '¿Está Bien Que Una Hermana Pervertida Se Enamore De Un Joven Monje?'
    },
    child: {
        id: '/serie/esta-bien-que-una-hermana-imaginaria-se-enamore-de-un-joven-monje/7.2',
        title: 'Capítulo 7.2 :'
    },
    entry: {
        index: 0,
        size: 227_826,
        type: 'image/webp'
    }
}).AssertWebsite();