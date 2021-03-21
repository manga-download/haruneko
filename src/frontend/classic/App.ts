import { IMediaContainer } from '../../engine/providers/MediaPlugin';

export default class App {

    constructor(root: HTMLElement) {
        // artificial delay to make loading screen visible
        //await new Promise(resolve => setTimeout(resolve, 2500));
        const container = this.CreateContainer();
        container.appendChild(this.CreateInfo());
        container.appendChild(this.CreateElement('hr'));
        container.appendChild(this.CreateFrontendButtonList());
        container.appendChild(this.CreateElement('hr'));
        container.appendChild(this.CreateRequestButtonList());
        container.appendChild(this.CreateElement('hr'));
        container.appendChild(this.CreateWebsiteButtonList());
        root.appendChild(container);
    }

    private CreateElement(tag: string, html?: string): HTMLElement {
        const element = document.createElement(tag);
        if(html) {
            element.innerHTML = html;
        }
        return element;
    }

    private CreateContainer(): HTMLElement {
        const container = this.CreateElement('div');
        container.style.padding = '1em';
        return container;
    }

    private CreateInfo(): HTMLElement {
        return this.CreateElement('p', `
            <strong>Platform :</strong> ${process.platform}<br>
            <strong>NW.js :</strong> ${process.versions}
        `); // process.versions['node-webkit']
    }

    private CreateFrontendButtonList() {
        const buttons = window.Frontend.AvailableFrontends
            .filter(info => info.ID !== 'classic')
            .map(info => `<li><a href="#" onclick="Frontend.Load('${info.ID}')" title="${info.Description}">Load Frontend: ${info.Label}</a></li>`).join('');
        return this.CreateElement('ul', buttons);
    }

    private CreateRequestButtonList() {
        const list = this.CreateElement('ul');

        const buttonFetchJSON = this.CreateElement('a', `FetchJSON`) as HTMLAnchorElement;
        buttonFetchJSON.href = '#';
        buttonFetchJSON.onclick = async () => {
            const uri = new URL('https://postman-echo.com/get');
            const request = new Request(uri.href, {
                method: 'GET',
                referrer: 'https://hakuneko.download',
                headers: {
                    'user-agent': 'Mozilla/5.0 (HakuNeko; OS)',
                    'referer': 'https://hakuneko.download',
                    'origin': 'hakuneko.download',
                    'cookie': 'adult=1',
                    'X-Foo': 'bar'
                }
            });
            const data = await window.HakuNeko.RequestProvider.FetchJSON(request);
            console.log('FetchJSON:', data);
        };
        const itemFetchJSON = this.CreateElement('li');
        itemFetchJSON.appendChild(buttonFetchJSON);
        list.appendChild(itemFetchJSON);

        // another button ...

        return list;
    }

    private CreateWebsiteButtonList() {
        const list = this.CreateElement('ul');

        const buttonGetMangas = this.CreateElement('a', `GetMangas`) as HTMLAnchorElement;
        buttonGetMangas.href = '#';
        buttonGetMangas.onclick = async () => {
            const website = window.HakuNeko.PluginController.WebsitePlugins[0];
            await website.Initialize();
            await website.Update();
            console.log('Mangas:', [...website]);
        };
        const itemGetMangas = this.CreateElement('li');
        itemGetMangas.appendChild(buttonGetMangas);
        list.appendChild(itemGetMangas);

        const buttonGetChapters = this.CreateElement('a', `GetChapters`) as HTMLAnchorElement;
        buttonGetChapters.href = '#';
        buttonGetChapters.onclick = async () => {
            const website = window.HakuNeko.PluginController.WebsitePlugins[0];
            await website.Initialize();
            await website.Update();
            const manga = [...website][0] as IMediaContainer;
            await manga.Initialize();
            await manga.Update();
            console.log('Chapters:', [...manga]);
        };
        const itemGetChapters = this.CreateElement('li');
        itemGetChapters.appendChild(buttonGetChapters);
        list.appendChild(itemGetChapters);

        const buttonGetPages = this.CreateElement('a', `GetPages`) as HTMLAnchorElement;
        buttonGetPages.href = '#';
        buttonGetPages.onclick = async () => {
            const website = window.HakuNeko.PluginController.WebsitePlugins[0];
            await website.Initialize();
            await website.Update();
            const manga = [...website][0] as IMediaContainer;
            await manga.Initialize();
            await manga.Update();
            const chapter = [...manga][0] as IMediaContainer;
            await chapter.Initialize();
            await chapter.Update();
            console.log('Pages:', [...chapter]);
        };
        const itemGetPages = this.CreateElement('li');
        itemGetPages.appendChild(buttonGetPages);
        list.appendChild(itemGetPages);

        return list;
    }
}