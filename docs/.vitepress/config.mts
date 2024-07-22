import { defineConfig } from 'vitepress';

const manual = '/user-manual';
const classic = `${manual}/usage/classic`;
const fluentcore = `${manual}/usage/fluent-core`;
const dev = '/development-guide';
const devtutorials = `${dev}/tutorials`

export default defineConfig({
    title: 'HakuNeko',
    description: 'Manga, Anime & Novel Downloader',
    head: [
        [ 'link', { rel: 'shortcut icon', href: '/assets/favicon.ico' } ],
    ],
    ignoreDeadLinks: 'localhostLinks',
    themeConfig: {
        logo: '/assets/logo.png',
        nav: [
            { text: 'User Manual', link: `${manual}/` },
            { text: 'Development Guide', link: `${dev}/` },
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/manga-download/haruneko' },
            { icon: 'discord', link: 'https://discord.gg/A5d3NDf' },
        ],
		docFooter: { prev: false, next: false },
        editLink: {
            text: 'Edit',
            pattern: 'https://github.com/manga-download/haruneko/tree/master/docs/:path',
        },
        search: { provider: 'local' },
        sidebar: {
            '/': [
                { text: 'User Manual', link: `${manual}/` },
                { text: 'Development Guide', link: `${dev}/` },
            ],
            '/user-manual/': [
                { text: 'Setup', link: `${manual}/setup` },
                {
                    text: 'Usage (Front-End)',
                    link: `${manual}/usage/`,
                    items: [
                        {
                            text: 'Classic',
                            collapsed: true,
                            items: [
                                { text: 'User Interface', link: `${classic}/ui-reference` },
                                { text: 'Tutorials', link: `${classic}/tutorials` },
                            ],
                        },
                        {
                            text: 'Fluent-Core',
                            collapsed: true,
                            items: [
                                { text: 'User Interface', link: `${fluentcore}/ui-reference` },
                                { text: 'Tutorials', link: `${fluentcore}/tutorials` },
                            ],
                        },
                    ]
                },
                { text: 'About', link: `${manual}/about` }
            ],
            '/development-guide/': [
                { text: 'Concepts', link: `${dev}/concepts` },
                { text: 'Setup Environment', link: `${dev}/setup-environment` },
                {
                    text: 'Tutorials',
                    collapsed: true,
                    items: [
                        { text: 'Use Engine', link: `${devtutorials}/use-engine` },
                        { text: 'Add Website', link: `${devtutorials}/add-website` },
                        { text: 'Add Front-End', link: `${devtutorials}/add-frontend` },
                        { text: 'Localization', link: `${devtutorials}/localization` },
                    ],
                },
            ]
        }
    },
});