import App from './App.svelte';
import programLocations from './programLocations.js'


const app = new App({
	target: document.getElementById('app'),
	props: {
		programs: programLocations
	}
});

export default app;