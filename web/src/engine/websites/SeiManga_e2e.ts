import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'seimanga',
        title: 'SeiManga'
    },
    container: {
        url: 'https://1.seimanga.me/mastera_mecha_onlain__progressiv___skerco_glubokoi_nochi',
        id: '/mastera_mecha_onlain__progressiv___skerco_glubokoi_nochi',
        title: 'Мастера меча онлайн: Прогрессив — Скерцо глубокой ночи',
    },
    child: {
        id: '/mastera_mecha_onlain__progressiv___skerco_glubokoi_nochi/vol3/19?mtr=1',
        title: '3 - 19 Эпилог',
    },
    entry: {
        index: 0,
        size: 472_438,
        type: 'image/jpeg'
    }
}).AssertWebsite();