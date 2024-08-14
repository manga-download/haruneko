//For websites similar to MangaSect, Manga347, ManhuaPlus, ManhuaGold,  MangaReader.to,

export const mangaPath ='/all-manga/{page}/';
export const queryMangaTitleFromURI = 'div.anisc-detail .manga-name';
export const queryMangas = 'div.item div.manga-detail .manga-name a';
export const queryChapters = [
    'ul#chapters-list li a.item-link',
    'ul#myUL li.chapter a',
].join(',');

export const queryPagesScript = `
    new Promise(async (resolve, reject) => {
        try {
            const ajaxendpoint = new URL('/ajax/image/list/chap/'+ CHAPTER_ID, window.location.href);
            const response = await fetch(ajaxendpoint, {
                headers: {
                    'X-Requested-With' : 'XMLHttpRequest',
            }});
            const jsonData = await response.json();
            const dom = new DOMParser().parseFromString(jsonData.html, 'text/html');
            const nodes = [...dom.querySelectorAll('div.separator')];

            //sort if needed
            nodes.sort(function (a, b) {
                if (!a.dataset?.index || !b.dataset?.index) return 0;
                const za = parseInt(a.dataset.index);
                const zb = parseInt(b.dataset.index);
                return za - zb;
            });
            resolve(nodes.map(element => element.querySelector('a.readImg').href));

        } catch(error) {
            reject(error);
        }
    });
`;
