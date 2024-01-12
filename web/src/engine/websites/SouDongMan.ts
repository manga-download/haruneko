import { Tags } from '../Tags';
import icon from './KanMan.webp';
import MHKX, { type MHXK_infos } from './decorators/MHKX';
import * as Common from './decorators/Common';

@Common.ImageAjax(true)
export default class extends MHKX {
    public constructor() {
        const product: MHXK_infos = {
            id: '9',
            name: 'soudm',
            platform: 'pc'
        };

        super('soudongman', `斗罗大陆 (SouDongMan)`, 'https://www.soudongman.com', product, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}