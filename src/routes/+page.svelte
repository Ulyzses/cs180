<script>
  export let data;

  const emails = data.emails;

  // console.log(data);
</script>

{#each emails as email}
  <h1>{email.id}</h1>
    <iframe srcdoc="{email.content}" />
  <p>{email.email_timestamp}</p>
{/each}