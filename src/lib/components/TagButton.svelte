<script lang="ts">
  import Icon from '@iconify/svelte';

  export let bgColor: string;
  export let icon: string;
  export let text: string;
  export let onClick: () => void;
  export let disabled: boolean = false;
</script>

<button style="--bg-color: {bgColor}" on:click={onClick} disabled={disabled}>
  <Icon icon={icon} height=2rem />
  <br>
  {text}
</button>

<style>
  button {
    border: none;
    height: 100%;
    min-height: 5rem;
    aspect-ratio: 3 / 2;
    cursor: pointer;
    background-color: var(--bg-color);
    color: #E7E7E7;
  }

  button:disabled {
    opacity: 0.9;
    cursor: not-allowed;
  }

  button:hover {
    filter: brightness(0.9);
  }
</style>