import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'capibaratraductor',
        title: 'Capibara Traductor'
    },
    container: {
        url: 'https://capibaratraductor.com/6ianfranc9/manga/anoshima-no-uminesou',
        id: '/6ianfranc9/manga/anoshima-no-uminesou',
        title: 'Anoshima no Uminesou'
    },
    child: {
        id: '/6ianfranc9/manga/anoshima-no-uminesou/chapters/5',
        title: 'Chapter 5 La Novia De Kazuma'
    },
    entry: {
        index: 2,
        size: 350_752,
        type: 'image/webp'
    }
}).AssertWebsite();