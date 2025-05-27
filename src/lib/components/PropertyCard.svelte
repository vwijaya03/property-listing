<script lang="ts">
  import type { Property } from '$lib/types/property.ts';
  import { priceToFormattedString } from '$lib/utils/helpers.ts';

  export let property: Property;

  $: mainImage = property.pictureUrls[0] || '/fallback.jpg';
</script>

<div class="item col-lg-6 col-md-6 col-xs-12 landscapes sale">
  <div class="project-single">
    <div class="project-inner project-head">
      <div class="homes">
        <a class="homes-img" href={`/properties/${property.listingId}`}>
          <div class="homes-price">
            {priceToFormattedString(property.price)}
          </div>
          <img src={mainImage} alt={property.title} style="width: 348px; height: 348px; object-fit: cover; border-radius: 8px" />
        </a>
      </div>
      <div class="button-effect">
        <a href={`/properties/${property._id}`} class="btn" aria-label="detail-page"><i class="fa fa-link"></i></a>
      </div>
    </div>
    <div class="homes-content">
      <h3><a href={`/properties/${property._id}`}>{property.title}</a></h3>
      <p class="homes-address mb-3">
        <i class="fa fa-map-marker"></i>
        <span>{property.address}</span>
      </p>
      <ul class="homes-list clearfix pb-3">
        <li class="the-icons"><i class="flaticon-bed mr-2"></i><span>{property.bedroomCount} Bedrooms</span></li>
        <li class="the-icons"><i class="flaticon-bathtub mr-2"></i><span>{property.bathroomCount} Bathrooms</span></li>
        <li class="the-icons"><i class="flaticon-square mr-2"></i><span>{property.buildingSize} m²</span></li>
        <li class="the-icons"><i class="flaticon-car mr-2"></i><span>{property.carCount} Garages</span></li>
      </ul>
    </div>
  </div>
</div>