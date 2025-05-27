<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import PropertyCard from '$lib/components/PropertyCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import type { Property, City, LotSize, Facing, PropertyPrice, Sort } from '$lib/types/property.ts';

  const { data } = $props();

  const currentPage = $derived(data.currentPage);
  const properties = $derived(data.properties);
  const totalData = $derived(data.totalData);
  const totalPages = $derived(data.totalPages);
  const cities = $derived(data.cities);
  const lotSizes = $derived(data.lotSizes);
  const facings = $derived(data.facings);
  const prices = $derived(data.prices);
  const sorts = $derived(data.sorts);

  let q = $state('');
  let searchCity = $state('');
  let selectedCity = $state('');
  let selectedLotSize = $state('');
  let selectedFacing = $state('');
  let selectedMinPrice = $state('');
  let selectedMaxPrice = $state('');
  let selectedSort = $state('');

  let modifiedCities = $derived.by(() => {
		const query = searchCity;
		if (!query) return cities;
		const lowerCity = query.toLowerCase();
		return cities.filter(city => city.cityName.toLowerCase().includes(lowerCity));
	});

  function handlePageChange(pageNum: number) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('page', pageNum.toString());
    goto(`${newUrl.pathname}?${newUrl.searchParams.toString()}`);
  }

  function handleSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    selectedSort = selectElement.value;
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('sort', selectedSort);
    
    goto(`${newUrl.pathname}?${newUrl.searchParams.toString()}`);
  }

  function handleSearch() {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    // Update or add new params
    if (q) searchParams.set('q', q);
    else searchParams.delete('q');

    if (selectedCity) searchParams.set('city', selectedCity);
    else searchParams.delete('city');

    if (selectedLotSize) searchParams.set('lot_size', selectedLotSize);
    else searchParams.delete('lotSize');

    if (selectedFacing) searchParams.set('facing', selectedFacing);
    else searchParams.delete('facing');

    if (selectedMinPrice) searchParams.set('min_price', selectedMinPrice);
    else searchParams.delete('min_price');

    if (selectedMaxPrice) searchParams.set('max_price', selectedMaxPrice);
    else searchParams.delete('max_price');

    if (selectedSort) searchParams.set('sort', selectedSort);
    else searchParams.delete('sort');

    console.log('Search Params:', searchParams.toString());
    // Navigate with merged params
    goto(`${currentUrl.pathname}?${searchParams.toString()}`);
  }

  onMount(() => {
		// Initialize the selected city from the URL if available
    const urlParams = new URLSearchParams(window.location.search);
    selectedCity = urlParams.get('city') || '';
    selectedLotSize = urlParams.get('lot_size') || '';
    selectedFacing = urlParams.get('facing') || '';
    selectedMinPrice = urlParams.get('min_price') || '';
    selectedMaxPrice = urlParams.get('max_price') || '';
    selectedSort = urlParams.get('sort') || '';
    q = urlParams.get('q') || '';
	});
</script>

<style>
  /* Prevent pointer events and hover styles */
  .nice-select .option.search-input {
    background-color: transparent !important;
    color: inherit !important;
    margin-top: 6px; /* <-- add margin above input */
  }

  /* Allow input to be usable inside */
  .nice-select .option.search-input input {
    pointer-events: auto;
    background-color: white;
    color: #333;
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ccc; /* <-- add border */
    border-radius: 4px;
    outline: none;
    box-sizing: border-box;
  }

  /* Prevent hover styles */
  .nice-select .option.search-input:hover {
    background-color: transparent !important;
    color: inherit !important;
  }
</style>

<!-- START SECTION PROPERTIES LISTING -->
<section class="properties-right featured portfolio blog pt-5">
  <div class="container">
    <section class="headings-2 pt-0 pb-55">
        <div class="pro-wrapper">
            <div class="detail-wrapper-body">
                <div class="listing-title-bar">
                    <h3>Cari Properti</h3>
                </div>
            </div>
        </div>
    </section>

    <!-- Listing Grid -->
    <div class="row">
      <aside class="col-lg-4 col-md-12 car">
        <div class="widget">
          <!-- Search Fields -->
          <div class="widget-boxed main-search-field">
            <div class="widget-boxed-header">
              <h4>Filter Properti</h4>
            </div>
            <!-- Search Form -->
            <div class="trip-search">
              <form class="form">
                <!-- Form Lookin for -->
                <div class="form-group looking">
                  <div class="first-select wide">
                    <div class="main-search-input-item">
                      <input
                        type="text"
                        placeholder="Enter Keyword..."
                        class="form-control"
                        bind:value={q}
                      />
                    </div>
                  </div>
                </div>
                <!--/ End Form Lookin for -->

                <!-- Kota -->
                <div class="form-group categories">
                  <div class="nice-select form-control wide">
                    <!-- Show selected city name or fallback -->
                    <span class="current">
                      {#if selectedCity}
                        {#if cities.find(c => c.cityId.toString() === selectedCity)}
                          {cities.find(c => c.cityId.toString() === selectedCity)?.cityName}
                        {:else}
                          Kota
                        {/if}
                      {:else}
                        Kota
                      {/if}
                    </span>

                    <ul class="list" style="overflow-y: auto; height: 200px;">
                      <!-- Search input -->
                      <li class="option search-input" role="presentation">
                        <input 
                          type="text" 
                          placeholder="Cari Kota..." 
                          bind:value={searchCity} 
                          class="form-control" 
                          onkeydown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const matched = modifiedCities.find(c => c.cityName.toLowerCase().includes(searchCity.toLowerCase()));
                              if (matched) selectedCity = matched.cityId.toString();
                            }
                          }} 
                          onclick={(e) => e.stopPropagation()}
                        />
                      </li>

                      <!-- City list -->
                      {#each modifiedCities as city}
                        <li
                          class="option"
                          role="option"
                          aria-selected={selectedCity === city.cityId.toString()}
                          onclick={() => selectedCity = city.cityId.toString()}
                          onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              selectedCity = city.cityId.toString();
                            }
                          }}
                        >
                          {city.cityName}
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>

                <!-- Luas Tanah -->
                <div class="form-group categories">
                  <div class="nice-select form-control wide">
                    <span class="current">
                      {#if selectedLotSize}
                        {#if lotSizes.find(s => s.value === selectedLotSize)}
                          {lotSizes.find(s => s.value === selectedLotSize)?.title}
                        {:else}
                          Luas Tanah
                        {/if}
                      {:else}
                        Luas Tanah
                      {/if}
                    </span>

                    <ul class="list">
                      <li
                        role="presentation"
                        class="option"
                        onclick={() => selectedLotSize = ''}
                      >
                        Pilih Luas Tanah
                      </li>

                      {#each lotSizes as size}
                        <li
                          class="option"
                          role="option"
                          aria-selected={selectedLotSize === size.value}
                          onclick={() => selectedLotSize = size.value}
                          onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              selectedLotSize = size.value;
                            }
                          }}
                        >
                          {size.title}
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>

                <!-- Hadap -->
                <div class="form-group beds">
                  <div class="nice-select form-control wide">
                    <span class="current">
                      {#if selectedFacing}
                        {#if facings.find(f => f.value === selectedFacing)}
                          {facings.find(f => f.value === selectedFacing)?.title}
                        {:else}
                          Hadap
                        {/if}
                      {:else}
                        Hadap
                      {/if}
                    </span>

                    <ul class="list">
                      <li
                        class="option"
                        onclick={() => selectedFacing = ''}
                        role="presentation"
                      >
                        Pilih Hadap
                      </li>

                      {#each facings as face}
                        <li 
                          class="option"
                          role="option"
                          aria-selected={selectedFacing === face.value}
                          onclick={() => selectedFacing = face.value}
                          onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              selectedFacing = face.value;
                            }
                          }}
                        >
                          {face.title}
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>

                <!-- Harga Min (≥) -->
                <div class="form-group bath">
                  <div class="nice-select form-control wide">
                    <span class="current">
                      {#if selectedMinPrice}
                        {#if prices.find(p => p.numericValue.toString() === selectedMinPrice)}
                          ≥ {prices.find(p => p.numericValue.toString() === selectedMinPrice)?.title}
                        {:else}
                          Harga Min
                        {/if}
                      {:else}
                        Harga Min
                      {/if}
                    </span>

                    <ul class="list">
                      <li
                        class="option"
                        onclick={() => selectedMinPrice = ''}
                        role="presentation"
                      >
                        Pilih Harga Min
                      </li>

                      {#each prices as price}
                        <li
                          class="option"
                          role="option"
                          aria-selected={selectedMinPrice === price.numericValue.toString()}
                          onclick={() => selectedMinPrice = price.numericValue.toString()}
                          onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              selectedMinPrice = price.numericValue.toString();
                            }
                          }}
                        >
                          ≥ {price.title}
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>

                <!-- Harga Max (≤) -->
                <div class="form-group bath">
                  <div class="nice-select form-control wide">
                    <span class="current">
                      {#if selectedMaxPrice}
                        {#if prices.find(p => p.numericValue.toString() === selectedMaxPrice)}
                          ≤ {prices.find(p => p.numericValue.toString() === selectedMaxPrice)?.title}
                        {:else}
                          Harga Max
                        {/if}
                      {:else}
                        Harga Max
                      {/if}
                    </span>

                    <ul class="list">
                      <li
                        class="option"
                        onclick={() => selectedMaxPrice = ''}
                        role="presentation"
                      >
                        Pilih Harga Max
                      </li>

                      {#each prices as price}
                        <li
                          class="option"
                          role="option"
                          aria-selected={selectedMaxPrice === price.numericValue.toString()}
                          onclick={() => selectedMaxPrice = price.numericValue.toString()}
                          onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              selectedMaxPrice = price.numericValue.toString();
                            }
                          }}
                        >
                          ≤ {price.title}
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>
              </form>
            </div>
            <!--/ End Search Form -->

            <div class="col-lg-12 no-pds">
              <div class="at-col-default-mar">
                <button 
                  class="btn btn-default hvr-bounce-to-right"
                  onclick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div class="col-lg-8 col-md-12 blog-pots">
        <section class="headings-2 pt-0">
          <div class="pro-wrapper d-flex align-items-center" style="justify-content: normal;">
            <div class="detail-wrapper-body d-flex align-items-center">
              <div class="listing-title-bar mr-3">
                <div class="text-heading">
                  <p class="font-weight-bold mb-0">{totalData} Search results</p>
                </div>
              </div>
              <div class="input-group border rounded input-group-lg w-auto align-items-center">
                <label class="input-group-text bg-transparent border-0 text-uppercase letter-spacing-093 pr-1 pl-3 py-0" for="inputGroupSelect01">
                  <i class="fas fa-align-left fs-16 pr-2"></i>Sort by:
                </label>
                <select
                  class="nice-select
                  form-control border-0 bg-transparent shadow-none p-0 m-0 h-auto" 
                  name="sortby"
                  onchange={handleSortChange}
                  bind:value={selectedSort}
                >
                  {#each sorts as sort}
                    <option value={sort.value}>{sort.title}</option>
                  {/each}
                </select>
              </div>
            </div>
          </div>
        </section>

        <div class="row">
          {#each properties as property (property.listingId)}
            <PropertyCard {property} />
          {/each}
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  </div>
</section>
<!-- END SECTION PROPERTIES LISTING -->
