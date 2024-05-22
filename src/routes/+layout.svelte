<script>
  import { goto, invalidate } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;
  $: ({ session, supabase } = data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (!newSession) {
        /**
         * Queue this as a task so the navigation won't prevent the
         * triggering function from completing
         */
        setTimeout(() => {
          goto('/auth', { invalidateAll: true });
        });
      }
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => data.subscription.unsubscribe();
  });

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error', error.message);
    }
  }
</script>

{#if session}
  <nav>
    <p>Logged in as <strong>{session.user.email}</strong></p>
    <button on:click={signOut}>Logout</button>
  </nav>
  <div class="container">
    <slot />
  </div>
{:else}
  <div class="container">
    <slot />
  </div>
{/if}


<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(html), :global(body) {
    overflow: hidden;
    font-family: 'IBM Plex Sans', sans-serif;
  }
  
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
    padding: 0 1rem;
    background-color: #f9f9f9;
    border-bottom: 1px solid #e0e0e0;
  }

  nav button {
    cursor: pointer;
    padding: 0.25rem 1rem;
  }

  .container {
    height: calc(100vh - 4rem);
  }
</style>