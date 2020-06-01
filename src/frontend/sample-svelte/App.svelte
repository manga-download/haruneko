<script>
	let count = 0;
	function increment() {
		count++;
	}
</script>

<style>
    #container {
        padding: 2em;
        text-align: center;
    }
    button{
        padding: 0.5em;
    }
</style>

<div id="container">
    <h3>Hello Svelte Button</h3>
    <button on:click={increment}>
        Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
</div>