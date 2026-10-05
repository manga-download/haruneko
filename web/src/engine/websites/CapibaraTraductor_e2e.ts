import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: regular manga

new TestFixture({
    plugin: {
        id: 'capibaratraductor',
        title: 'Capibara Traductor'
    },
    container: {
        url: 'https://capibaratraductor.com/senshimanga/manga/nue-no-onmyouji',
        id: '/senshimanga/manga/nue-no-onmyouji',
        title: 'Nue no Onmyouji'
    },
    child: {
        id: '/senshimanga/manga/nue-no-onmyouji/chapters/1',
        title: 'Capítulo 1 Vista retrato del cielo'
    },
    entry: {
        index: 1,
        size: 293_707,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: "joint" manga

new TestFixture({
    plugin: {
        id: 'capibaratraductor',
        title: 'Capibara Traductor'
    },
    container: {
        url: 'https://capibaratraductor.com/joint/manga/darwin-incident',
        id: '/joint/manga/darwin-incident',
        title: `Darwin's Incident`
    },
    child: {
        id: '/joint/manga/darwin-incident/chapters/31',
        title: 'Capítulo 31 Reunión en lo alto'
    },
    entry: {
        index: 5,
        size: 927_512,
        type: 'image/jpeg'
    }
}).AssertWebsite();