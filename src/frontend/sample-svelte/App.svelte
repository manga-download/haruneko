<script lang="ts">
	let count: number = 0;
	function increment() {
		count++;
	}
</script>

<style>
    #container {
        height: 100%;
        padding: 2em;
        text-align: center;
        background-color: lightgrey;
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