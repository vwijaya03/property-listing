<script lang="ts">
  export let searchTerm = '';
  export let placeholder = 'Search properties...';

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    searchTerm = target.value;
  }
</script>

<div class="search-container">
  <input
    type="text"
    bind:value={searchTerm}
    on:input={handleInput}
    placeholder={placeholder}
    class="search-input"
  />
  <button class="search-button">Search</button>
</div>

<style src="../styles/search.css"></style>