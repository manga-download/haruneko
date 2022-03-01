<script>
    import { Router, Route } from 'svelte-navigator';

    import Home from './Home.svelte';
    import HowTo from './HowTo.svelte';
    import Ukraine from './Ukraine.svelte';
    import PathBar from './ContentPathBar.svelte';
</script>

<Router primary={false}>
    <header>
        <PathBar />
    </header>

    <main>
        <Route>
            <Home />
        </Route>
        <Route path="howto">
            <HowTo />
        </Route>
        <Route path="/may/peace/come/to/ukraine/soon">
            <Ukraine />
        </Route>
        <Route path="about">
            <h2>About</h2>
            <p>That's what it's all about!</p>
        </Route>
    </main>
</Router>
