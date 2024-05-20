<script>
  export let data;

  const emails = data.emails;

  console.log(emails);
</script>

{#each emails as email}
  <h1>{email.id}</h1>
  <p>{email.content}</p>
  <p>{email.email_timestamp}</p>
{/each}

