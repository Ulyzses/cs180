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
    <p>Logged in as {session.user.email}</p>
    <button on:click={signOut}>Logout</button>
  </nav>
{/if}

<slot />

<style>
  * {
    box-sizing: border-box;
  }

  :global(html), :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
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
</style>