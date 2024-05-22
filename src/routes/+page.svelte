<script lang="ts">
	import { onMount } from 'svelte';
	import TagButton from '$lib/components/TagButton.svelte';

  export let data;

  const { session, user, supabase } = data;

  // let untaggedEmails: EmailMessage[] = [];
  // let taggedEmails: EmailMessage[] = [];
  // let currentEmail: EmailMessage | null = null;
  
  // let error = "";

  // onMount(async () => {
  //   await retrieveEmails();

  //   getEmail();
  // });

  // async function retrieveEmails() {
  //   await updateDb();
    
  //   const queryResponse = await supabase
  //     .from("emails")
  //     .select()
  //     .eq("email", user?.email)
  //     .is("tag", null)
  //     .order("id", { ascending: true })
  //     .limit(5);
    
  //   if (queryResponse.error) {
  //     error = queryResponse.error.message;
  //     return;
  //   }

  //   const { data } = queryResponse;

  //   untaggedEmails = [...untaggedEmails, ...data];
  // }

  // async function getEmail() {
  //   currentEmail = null;

  //   if (untaggedEmails.length <= 0) {
  //     await retrieveEmails();
  //   };

  //   const email = untaggedEmails.shift() as EmailMessage;
  //   untaggedEmails = untaggedEmails;

  //   currentEmail = email;
  //   console.log("Current", currentEmail);
  // }

  // function tagEmail() {
  //   if (currentEmail) {
  //     currentEmail.tag = true;
  //     currentEmail.tag_timestamp = new Date().toISOString();
  //     taggedEmails.push(currentEmail);
  //   }
    
  //   getEmail();
  // }

  // async function updateDb() {
  //   console.log("Tagged", taggedEmails);
  
  //   await supabase
  //     .from("emails")
  //     .upsert(taggedEmails)
  //     .then((response) => {
  //       console.log("Response", response);
  //     });
    
  //   taggedEmails = [];
  // }

  let currentEmail: EmailMessage;
  let error: string;

  async function getEmail() {
    const response = await supabase
      .from("emails")
      .select()
      .eq("email", user?.email)
      .is("tag", null)
      .order("id", { ascending: true })
      .limit(1);

    if (response.error) {
      console.error("Error", response.error.message);
      error = response.error.message;
      return;
    }

    const { data } = response;

    if (data.length <= 0) {
      error = "No emails returned";
      return;
    }

    currentEmail = data[0];
  }

  async function tagNeed(tag: boolean) {
    if (!currentEmail) return;

    currentEmail.tag = tag;
    currentEmail.tag_timestamp = new Date().toISOString();
    currentEmail.tagger = user?.email ?? "";

    upsertEmail();
  }

  async function tagValid(valid: boolean) {
    if (!currentEmail) return;

    currentEmail.valid = valid;
    currentEmail.tag_timestamp = new Date().toISOString();
    currentEmail.tagger = user?.email ?? "";

    upsertEmail();
  }

  async function upsertEmail() {
    if (!currentEmail) return;

    const response = await supabase
      .from("emails")
      .upsert(currentEmail);

    console.log("Response", response);

    getEmail();
  }

  onMount(() => {
    getEmail();
  });
</script>

<div class="row">
  <div class="history">

  </div>
  <div class="main">
    <div class="header">
      <div class="left">
        <h1>#{currentEmail?.id ?? ""}</h1>
        <p><span class="fixed">SUBJECT</span>{currentEmail?.subject ?? ""}</p>
        <p><span class="fixed">FROM</span>{currentEmail?.from ?? ""}</p>
        <p><span class="fixed">TIME</span>{currentEmail ? new Date(currentEmail.email_timestamp) : ""}</p>
      </div>
      <div class="right">
        <TagButton
          bgColor="#419d78"
          icon="mdi:thumb-up"
          text="Need"
          onClick={() => { tagNeed(true) }}
          disabled={!currentEmail} />
        <TagButton
          bgColor="#FB4B4E"
          icon="mdi:thumb-down"
          text="No Need"
          onClick={() => { tagNeed(false) }}
          disabled={!currentEmail}/>
        <TagButton
          bgColor="#4062BB"
          icon="mdi:do-not-disturb-alt"
          text="Invalid"
          onClick={() => { tagValid(false)}}
          disabled={!currentEmail}/>
      </div>
    </div>
    {#if currentEmail}
      <div class="main-content">
        <iframe title="{currentEmail.id}" frameBorder="0" srcdoc="{currentEmail.content}" />
      </div>
    {:else}
      <p>No emails</p>
    {/if}
  </div>
</div>

<style>
  .row {
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }

  .row > * {
    padding: 0 1rem;
  }

  .history {
    grid-area: 1 / 1 / 2 / 2;
    width: 100%;
    border-right: 1px solid #e0e0e0;
  }

  .main {
    grid-area: 1 / 2 / 2 / 3;
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
  }

  .header .left h1 {
    font-size: 1.5rem;
  }

  .header .left p {
    font-size: 0.9rem;
  }

  span.fixed {
    width: 5rem;
    display: inline-block;
    font-weight: bold;
  }

  .header .right {
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
  }

  .main-content{
    margin-bottom: 1rem;
    width: 100%;
    height: 100%;
    flex-grow: 1;
  }

  iframe {
    width: 100%;
    height: 100%;
    user-select: none;
    border: 1px solid #e0e0e0;
  }
</style>
