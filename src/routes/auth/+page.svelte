<div class="container">
	<form method="POST" action="?/oauth">
		<p>Sign in to continue to the app</p>
		<button>Sign in with Google</button>
	</form>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	p {
		margin: 1rem;
	}

	button {
    cursor: pointer;
    padding: 0.5rem 1rem;
	}
</style>