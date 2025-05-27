<script lang="ts">
  export let currentPage: number;
  export let totalPages: number;
  export let onPageChange: (page: number) => void;

  $: visiblePages = getVisiblePages(currentPage, totalPages);

  function getVisiblePages(current: number, total: number): number[] {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, 5];
    if (current >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
    return [current - 2, current - 1, current, current + 1, current + 2];
  }
</script>

<nav aria-label="..." class="agents pt-55">
  <ul class="pagination">
    <!-- Previous -->
    <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
      <a
        class="page-link"
        href="/#"
        on:click|preventDefault={() => currentPage > 1 && onPageChange(currentPage - 1)}
        tabindex={currentPage === 1 ? -1 : 0}
      >
        Previous
      </a>
    </li>

    <!-- Page Numbers -->
    {#each visiblePages as page}
      <li class="page-item {page === currentPage ? 'active' : ''}">
        <a
          class="page-link"
          href="/#"
          on:click|preventDefault={() => onPageChange(page)}
        >
          {page}
          {#if page === currentPage}
            <span class="sr-only">(current)</span>
          {/if}
        </a>
      </li>
    {/each}

    <!-- Next -->
    <li class="page-item {currentPage === totalPages ? 'disabled' : ''}">
      <a
        class="page-link"
        href="/#"
        on:click|preventDefault={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        tabindex={currentPage === totalPages ? -1 : 0}
      >
        Next
      </a>
    </li>
  </ul>
</nav>
