const React = require('react');
const useState = React.useState;

export default function App() {

    const [ count, setCount ] = useState(0);

    return (
        <div id="container">
            <h3>Hello React Button</h3>
        </div>
    );
}