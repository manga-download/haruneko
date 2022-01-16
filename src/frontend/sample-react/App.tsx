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