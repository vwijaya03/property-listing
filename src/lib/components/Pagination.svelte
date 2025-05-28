<script lang="ts">
  const { currentPage, totalPages, onPageChange } = $props();

  const visiblePages = $derived.by(() => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
    }

    return pages;
  });
</script>

<nav aria-label="..." class="agents pt-55">
  <ul class="pagination">
    <!-- Previous -->
    <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
      <a
        class="page-link"
        href="/#"
        onclick={(e) => {
          e.preventDefault();
          return currentPage > 1 && onPageChange(currentPage - 1);
        }}
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
          onclick={(e) => {
            e.preventDefault();
            return onPageChange(page);
          }}
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
        onclick={(e) => {
          e.preventDefault();
          return currentPage < totalPages && onPageChange(currentPage + 1);
        }}
        tabindex={currentPage === totalPages ? -1 : 0}
      >
        Next
      </a>
    </li>
  </ul>
</nav>
