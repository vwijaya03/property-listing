import { connectToDatabase } from '$lib/db/client.ts';
import type { Property, City, LotSize, Facing, PropertyPrice, Sort } from '$lib/types/property.ts';
import type { LoadEvent } from '@sveltejs/kit';
import type { Filter } from 'mongodb';

interface PageData {
  currentPage: number;
  properties: Property[];
  totalData: number;
  totalPages: number;
  cities: City[] | [];
  lotSizes: LotSize[];
  facings: Facing[];
  prices: PropertyPrice[];
  sorts: Sort[];
}

export const load = async ({ url }: LoadEvent): Promise<PageData> => {
  const ITEMS_PER_PAGE = 10;
  const page = parseInt(url.searchParams.get('page') || '1');
  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  // Get filters from query
  const q = url.searchParams.get('q') || '';
  const city = url.searchParams.get('city') || '';
  const lotSize = Number(url.searchParams.get('lot_size'));
  const facing = url.searchParams.get('facing') || '';
  const minPrice = Number(url.searchParams.get('min_price'));
  const maxPrice = Number(url.searchParams.get('max_price'));
  const sort = url.searchParams.get('sort') || 'updatedAt:desc';

  // Build query object
  const query: Filter<Property> = {
    ...(q && { title: { $regex: q, $options: 'i' } }),
    ...(city && !isNaN(Number(city)) && { cityId: Number(city) }),
    ...(lotSize && { lotSize: { $gte: Number(lotSize) } }),
    ...(facing && { facing }),
    ...(minPrice && maxPrice
      ? { price: { $gte: minPrice, $lte: maxPrice } }
      : minPrice
      ? { price: { $gte: minPrice } }
      : maxPrice
      ? { price: { $lte: maxPrice } }
      : {})
  };

  console.log('Query:', query);

  // Parse sort string
  const [sortField, sortDir] = sort.split(':');
  console.log(sortField, sortDir);

  const db = await connectToDatabase();

  const [properties, total, cities, lotSizes, facings, prices, sorts] = await Promise.all([
    db.collection<Property>('properties')
      .find(query)
      .sort({ 'updatedAt': -1 })
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .toArray(),
    db.collection<Property>('properties').countDocuments(query),
    db.collection<City>('cities').find({}).toArray(),
    db.collection<LotSize>('property_lot_sizes').find().toArray(),
    db.collection<Facing>('property_facings').find().toArray(),
    db.collection<PropertyPrice>('property_prices').find().toArray(),
    db.collection<Sort>('property_sorts').find().toArray()
  ]);

  return {
    currentPage: page,
    properties: JSON.parse(JSON.stringify(properties)),
    totalData: total,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    cities: JSON.parse(JSON.stringify(cities)),
    lotSizes: JSON.parse(JSON.stringify(lotSizes)),
    facings: JSON.parse(JSON.stringify(facings)),
    prices: JSON.parse(JSON.stringify(prices)),
    sorts: JSON.parse(JSON.stringify(sorts))
  };
};
