import React from 'react';

const styles = {
    container: {
        height: '100%',
        padding: '2em',
        textAlign: 'center' as const,
        backgroundColor: 'lightgrey'
    },
    button: {
        padding: '0.5em'
    }
};

export default function App() {

    const [ count, setCount ] = React.useState(0);

    return (
        <div style={styles.container}>
            <h3>Hello React Button</h3>
            <button onClick={() => setCount(count + 1)} style={styles.button}>
                Clicked: {count}
            </button>
        </div>
    );
}