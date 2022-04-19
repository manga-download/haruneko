// TODO: Currently svelte-check transforms all .svelte components to .tsx representations to leverage typescripts tsx capabilities,
//       svelte-check also uses its own type definitions for the transformed .tsx (which are not compatible with the definitions from react)
//       See: https://github.com/sveltejs/language-tools/blob/master/packages/svelte2tsx/svelte-jsx.d.ts
//       As a result, svelte-check will report false positives when type checking real react TSX components ...
//       Further reading: https://github.com/sveltejs/language-tools/issues/1256#issuecomment-983371138
//       Temporary solution: use '--use-new-transformation' flag for svelte-check

import * as React from 'react';
import { CSSProperties, useState } from 'react';

const styles: { [key: string]: CSSProperties } = {
    container: {
        height: '100%',
        padding: '2em',
        textAlign: 'center',
        backgroundColor: 'lightgrey'
    },
    button: {
        padding: '0.5em'
    }
};

export default function App() {

    const [ count, setCount ] = useState(0);

    return (
        <div style={styles.container}>
            <h3>Hello React Button</h3>
            <button style={styles.button} onClick={() => setCount(count + 1)}>
                Clicked: {count}
            </button>
        </div>
    );
}