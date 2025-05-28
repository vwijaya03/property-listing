<script lang="ts">
  import type { Property } from '$lib/types/property.ts';
  import { priceToFormattedString } from '$lib/utils/helpers.ts';
  
  const { data } = $props();
  // export let data: { property: Property };

  const p = data.property;
  const instagramUrl = data.instagramUrl;
  const whatsappUrl = data.whatsappUrl;

  let activeIndex = $state(0);

  function goTo(index: number) {
    activeIndex = index;
  }

  function prev(e: MouseEvent) {
    e.preventDefault();
    activeIndex = (activeIndex - 1 + p.pictureUrls.length) % p.pictureUrls.length;
  }

  function next(e: MouseEvent) {
    e.preventDefault();
    activeIndex = (activeIndex + 1) % p.pictureUrls.length;
  }
</script>

<style>
  .link-hover-grey {
    color: #6b7280; /* gray-500 */
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .link-hover-grey:hover {
    color: #FF385C;
  }
</style>

<!-- START SECTION PROPERTIES LISTING -->
<section class="single-proper blog details">
  <div class="container">
    <div class="row">
        <div class="col-lg-8 col-md-12 blog-pots">
          <div class="row">
            <div class="col-md-12">
              <section class="headings-2 pt-0">
                <div class="pro-wrapper">
                  <div class="detail-wrapper-body">
                    <div class="listing-title-bar">
                      <h3>{p.title}</h3>
                      <div class="mt-0">
                        <a href="#listing-location" class="listing-address">
                          <i class="fa fa-map-marker pr-2 ti-location-pin mrg-r-5"></i>{p.address}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div class="single detail-wrapper mr-2">
                    <div class="detail-wrapper-body">
                      <div class="listing-title-bar">
                        <h4>{priceToFormattedString(p.price)}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
                
              <div id="listingDetailsSlider" class="carousel listing-details-sliders slide mb-30">
                <h5 class="mb-4">Gallery</h5>

                <!-- Main Carousel Items -->
                <div class="carousel-inner">
                  {#each p.pictureUrls ?? [] as url, index}
                    <div class="carousel-item {activeIndex === index ? 'active' : ''}" data-slide-number={index}>
                      <img src={url} class="img-fluid" alt={`slider-${index}`} />
                    </div>
                  {/each}

                  <!-- Controls -->
                  <a class="carousel-control left" href="/#" onclick={(e) => prev(e)} aria-label="ctrl-left">
                    <i class="fa fa-angle-left"></i>
                  </a>
                  <a class="carousel-control right" href="/#" onclick={(e) => next(e)} aria-label="ctrl-right">
                    <i class="fa fa-angle-right"></i>
                  </a>
                </div>

                <!-- Carousel Indicators -->
                <ul class="carousel-indicators smail-listing list-inline mt-3">
                  {#each p.pictureUrls ?? [] as url, index}
                    <li class="list-inline-item {index === activeIndex ? 'active' : ''}">
                      <button
                        type="button"
                        onclick={() => goTo(index)}
                        class="{index === activeIndex ? 'selected' : ''} bg-transparent border-0 p-0"
                        aria-label={`Show slide ${index + 1}`}
                      >
                        <img src={url} class="img-fluid" alt={`thumb-${index}`} />
                      </button>
                    </li>
                  {/each}
                </ul>
              </div>

              <div class="blog-info details mb-30">
                <h5 class="mb-4">Deskripsi</h5>
                {#if p.description}
                  <p class="mb-3" style="white-space: pre-line;">{@html p.description}</p>
                {/if}
              </div>
            </div>
          </div>

          <div class="single homes-content details mb-30">
            <!-- title -->
            <h5 class="mb-4">Info Properti</h5>
            <ul class="homes-list clearfix">
              {#if p.price}
                <li>
                  <span class="font-weight-bold mr-1">Harga:</span>
                  <span class="det">{p.price}</span>
                </li>
              {/if}

              {#if p.bedroomCount}
                <li>
                  <span class="font-weight-bold mr-1">Kamar Tidur:</span>
                  <span class="det">{p.bedroomCount}</span>
                </li>
              {/if}

              {#if p.bathroomCount}
                <li>
                  <span class="font-weight-bold mr-1">Kamar Mandi:</span>
                  <span class="det">{p.bathroomCount}</span>
                </li>
              {/if}

              {#if p.carCount}
                <li>
                  <span class="font-weight-bold mr-1">Garasi:</span>
                  <span class="det">{p.carCount}</span>
                </li>
              {/if}

              {#if p.facing}
                <li>
                  <span class="font-weight-bold mr-1">Hadap:</span>
                  <span class="det">{p.facing}</span>
                </li>
              {/if}

              {#if p.ownership}
                <li>
                  <span class="font-weight-bold mr-1">Surat:</span>
                  <span class="det">{p.ownership}</span>
                </li>
              {/if}

            </ul>
          </div>
        </div>

        <aside class="col-lg-4 col-md-12">
          <div class="single widget">
            <!-- Start: Schedule a Tour -->
            <div class="schedule widget-boxed mt-33 mt-0">
              <div class="widget-boxed-header">
                <h4>Tertarik ?</h4>
              </div>
              <div class="widget-boxed-body">
                <div class="row">
                  <div class="col-lg-6 col-md-12">
                    <h4>Hubungi Kami</h4>
                  </div>
                  <div class="col-lg-12 col-md-12">
                    <a href="{whatsappUrl}" class="link-hover-grey">Whatsapp</a>
                  </div>
                  <div class="col-lg-12 col-md-12">
                    <a href="{instagramUrl}" class="link-hover-grey">Instagram</a>
                  </div>
                </div>
              </div>
            </div>
            <!-- End: Schedule a Tour -->
          </div>
        </aside>
    </div>
  </div>
</section>
