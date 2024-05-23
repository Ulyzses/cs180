<script lang="ts">
  import Icon from '@iconify/svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
  import { history } from '$lib/stores';

  export let item: HistoryItem;
  export let supabase: SupabaseClient;

  async function undo() {
    console.log("Undoing");

    if (!item || !item.allowUndo) return;

    const { oldValue, newValue } = item;

    const response = await supabase
      .from("emails")
      .upsert(oldValue);
    
    console.log(response);

    const newHistoryItem: HistoryItem = {
      oldValue: newValue,
      newValue: oldValue,
      text: `Reverted tag for #${oldValue.id}`,
      timestamp: new Date(),
      allowUndo: false,
    }

    $history = [newHistoryItem, ...$history];
  }
</script>

<div class="log" data-timestamp="{item.timestamp.toLocaleString()}">
  {#if item.allowUndo}
    <button on:click={undo}>
      <Icon icon="mdi:undo-variant" />
    </button>
  {/if}
  <p>{item.text}</p>
</div>

<style>
  .log {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #e0e0e0;
    position: relative;
  }

  .log:hover::before {
    content: attr(data-timestamp);
    font-size: 10px;
    color: #7f7f7f;

    display: block;
  }

  .log:hover {
    background-color: #00000010;

  }

  p {
    font-size: 14px;
  }

  button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 2rem;

    border: none;
    cursor: pointer;
  }
</style>