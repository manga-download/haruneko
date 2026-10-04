import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rfdragonscan',
        title: 'RF Dragon Scan',
    },
    container: {
        url: 'https://rfdragonscan.net/dd3de284-e02c-4513-8541-09eb5eeaaa9a/jogador-renascido',
        id: '/dd3de284-e02c-4513-8541-09eb5eeaaa9a/jogador-renascido',
        title: 'Jogador Renascido',
    }, /* Need Login
    child: {
        id: '/dd3de284-e02c-4513-8541-09eb5eeaaa9a/jogador-renascido/capitulo/194',
        title: 'Capítulo 194',
    },
    entry: {
        index: 0,
        size: 196_008,
        type: 'image/webp'
    }*/
}).AssertWebsite();