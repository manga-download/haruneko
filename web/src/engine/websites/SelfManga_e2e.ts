import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'selfmanga',
        title: 'SelfManga'
    },
    container: {
        url: 'https://selfmanga.live/temnyi_dvoreckii_dodzinsi__ah__eta_prekrasnaia_koshachia_jizn_',
        id: '/temnyi_dvoreckii_dodzinsi__ah__eta_prekrasnaia_koshachia_jizn_',
        title: 'Темный Дворецкий додзинси: Ах, эта прекрасная кошачья жизнь!',
    },
    child: {
        id: '/temnyi_dvoreckii_dodzinsi__ah__eta_prekrasnaia_koshachia_jizn_/vol1/6?mtr=1',
        title: '1 Экстра Бонусы',
    },
    entry: {
        index: 0,
        size: 787_620,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();