interface Parameters {
    orientation:String;
};

export function resizeBar (node: HTMLElement, params: Parameters) {
    let dragStart = null;
    let width:number = undefined;
    let delta:number = 0;
    let targetNode = node.parentElement;
    const attr = params.orientation === 'vertical' ? 'screenX' : 'screenY';
    const mouseDownAction = (e) => {
        e.preventDefault();
        dragStart = e[attr];
        width = targetNode.offsetWidth;
        document.addEventListener('mousemove', mouseMoveAction);
        document.addEventListener('mouseup', mouseUpAction);
    };
    const mouseMoveAction = (e) => {
        if (dragStart != null) {
            delta = e[attr] - dragStart;
            targetNode.style.width= `${width + delta}px`;
        }
    };
    const mouseUpAction = () => {
        dragStart = null;
        width = width + delta;
        targetNode.style.width= `${width}px`;
        delta=0;
        document.removeEventListener('mousemove', mouseMoveAction);
        document.removeEventListener('mouseup', mouseUpAction);
    };

    node.addEventListener('mousedown', mouseDownAction);

    return {
        destroy() {
            node.removeEventListener('mousedown', mouseDownAction);
        }
    };
};