import { ObjectId, Long } from 'mongodb';

import { connectToDatabase } from '../db/client.ts';
import type { Property } from '../types/property.ts';

const imageUrls = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6'
];

const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
const ownershipTypes = ['Freehold', 'Leasehold', 'Strata'];
const facingDirections = ['North', 'South', 'East', 'West'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function seedDummyProperties() {
  const db = await connectToDatabase();
  const properties = db.collection<Property>('dummy-properties');
  
  await properties.deleteMany({}); // Clear existing data

  const dummyProperties: Property[] = [];
  const currentDate = new Date().toISOString();

  for (let i = 1; i <= 50; i++) {
    const isForRent = Math.random() > 0.7; // 30% chance of being for rent
    const cityId = i % 10 + 1; // Generate city IDs between 1-10

    dummyProperties.push({
      _id: new ObjectId(),
      listingId: new Long(),
      listingIdStr: `prop-${i}`,
      title: `Beautiful Property ${i}`,
      address: `${i}${getRandomElement([' Main St', ' Oak Ave', ' Pine Rd'])}`,
      description: `This is a wonderful property with ${i % 5 + 2} bedrooms in a great location.`,
      price: Math.floor(Math.random() * 2000000) + 500000,
      rentPrice: isForRent ? Math.floor(Math.random() * 5000) + 1000 : null,
      lotSize: Math.floor(Math.random() * 5000) + 1000,
      buildingSize: Math.floor(Math.random() * 3000) + 800,
      facing: getRandomElement(facingDirections),
      ownership: getRandomElement(ownershipTypes),
      bedroomCount: i % 5 + 1,
      bathroomCount: i % 4 + 1,
      carCount: i % 3,
      cityId: cityId,
      cityName: getRandomElement(cities),
      coordinate: {
        latitude: 34.0522 + (Math.random() - 0.5),
        longitude: -118.2437 + (Math.random() - 0.5)
      },
      electricPower: Math.random() > 0.3 ? Math.floor(Math.random() * 10000) + 2000 : null,
      floorCount: i % 4 + 1,
      isMultipleUnits: Math.random() > 0.8,
      isVerified: Math.random() > 0.5,
      listingForSale: !isForRent,
      listingForRent: isForRent,
      pictureUrls: Array.from({ length: 3 }, () => getRandomElement(imageUrls)),
      propertyType: getRandomElement(['House', 'Apartment', 'Villa', 'Townhouse']),
      registrant: {
        name: Math.random() > 0.2 ? `Agent ${i}` : null,
        phoneNumberEncrypted: `encrypted-phone-${i}`,
        phoneNumberHash: `phone-hash-${i}`,
        delegatePhoneHash: Math.random() > 0.7 ? `delegate-hash-${i}` : null,
        profilePictureURL: Math.random() > 0.5 ? `https://example.com/agent${i}.jpg` : null,
        company: Math.random() > 0.4 ? `Realty Co. ${i % 5}` : null
      },
      updatedAt: currentDate,
      createdAt: currentDate,
      withRewardAgreement: Math.random() > 0.7
    });
  }

  await properties.insertMany(dummyProperties);
  console.log('✅ Database seeded with 50 properties');
}

async function seedCities() {
  const db = await connectToDatabase();
  const citiesCollection = db.collection('cities');

  // Clear the collection first
  await citiesCollection.deleteMany({});

  // Extract unique cityId + cityName from properties collection
  const uniqueCities = await db.collection('properties').aggregate([
    {
      $group: {
        _id: {
          cityId: '$cityId',
          cityName: '$cityName'
        }
      }
    },
    {
      $project: {
        _id: 0,
        cityId: '$_id.cityId',
        cityName: '$_id.cityName'
      }
    }
  ]).toArray();

  if (uniqueCities.length > 0) {
    await citiesCollection.insertMany(uniqueCities);
    console.log(`✅ Database seeded with ${uniqueCities.length} unique cities`);
  } else {
    console.log('⚠️ No city data found in properties collection');
  }
}

async function seedLotSizes() {
  const db = await connectToDatabase();
  const lotSizesCollection = db.collection('property_lot_sizes');
  
  // Clear existing data
  await lotSizesCollection.deleteMany({});

  // Define the lot size options
  const lotSizes = [
    { title: "≥ 50 m²", value: "50", order: 1 },
    { title: "≥ 100 m²", value: "100", order: 2 },
    { title: "≥ 150 m²", value: "150", order: 3 },
    { title: "≥ 200 m²", value: "200", order: 4 },
    { title: "≥ 250 m²", value: "250", order: 5 },
    { title: "≥ 300 m²", value: "300", order: 6 },
    { title: "≥ 400 m²", value: "400", order: 7 },
    { title: "≥ 500 m²", value: "500", order: 8 },
    { title: "≥ 600 m²", value: "600", order: 9 },
    { title: "≥ 700 m²", value: "700", order: 10 },
    { title: "≥ 800 m²", value: "800", order: 11 },
    { title: "≥ 900 m²", value: "900", order: 12 }
  ];

  // Insert the lot sizes
  await lotSizesCollection.insertMany(lotSizes);
  
  // Create an index on the order field for efficient sorting
  await lotSizesCollection.createIndex({ order: 1 });

  console.log('✅ Database seeded with lot sizes');
}

async function seedSorts() {
  const db = await connectToDatabase();
  const propertySortsCollection = db.collection('property_sorts');
  
  // Clear existing data
  await propertySortsCollection.deleteMany({});

  // Define the property sort options
  const propertySorts = [
    { title: "Urutan", value: "updatedAt:desc", order: 1 },
    { title: "Harga Tertinggi", value: "price:desc", order: 2 },
    { title: "Harga Terendah", value: "price:asc", order: 3 },
    { title: "Luas Paling Besar", value: "lotSize:desc", order: 4 },
    { title: "Luas Paling Kecil", value: "lotSize:asc", order: 5 }
  ];

  // Insert the property sorts
  await propertySortsCollection.insertMany(propertySorts);
  
  // Create an index on the order field for efficient sorting
  await propertySortsCollection.createIndex({ order: 1 });

  console.log('✅ Database seeded with property sort options');
}

async function seedFacings() {
  const db = await connectToDatabase();
  const facingsCollection = db.collection('property_facings');
  
  // Clear existing data
  await facingsCollection.deleteMany({});

  // Define the facing options
  const facings = [
    { title: "Utara", value: "north", order: 1 },
    { title: "Timur", value: "east", order: 2 },
    { title: "Selatan", value: "south", order: 3 },
    { title: "Barat", value: "west", order: 4 }
  ];

  // Insert the facing options
  await facingsCollection.insertMany(facings);
  
  // Create an index on the order field for efficient sorting
  await facingsCollection.createIndex({ order: 1 });

  console.log('✅ Database seeded with property facing options');
}

async function seedPropertyPrices() {
  const db = await connectToDatabase();
  const propertyPriceCollection = db.collection('property_prices');
  
  // Clear existing data
  await propertyPriceCollection.deleteMany({});

  // Define the price options (without ≥ sign)
  const prices = [
    { title: "500 Juta", value: "500000000", order: 1, numericValue: 500000000 },
    { title: "1 Milyar", value: "1000000000", order: 2, numericValue: 1000000000 },
    { title: "2 Milyar", value: "2000000000", order: 3, numericValue: 2000000000 },
    { title: "3 Milyar", value: "3000000000", order: 4, numericValue: 3000000000 },
    { title: "4 Milyar", value: "4000000000", order: 5, numericValue: 4000000000 },
    { title: "5 Milyar", value: "5000000000", order: 6, numericValue: 5000000000 },
    { title: "10 Milyar", value: "10000000000", order: 7, numericValue: 10000000000 },
    { title: "20 Milyar", value: "20000000000", order: 8, numericValue: 20000000000 },
    { title: "50 Milyar", value: "50000000000", order: 9, numericValue: 50000000000 },
    { title: "100 Milyar", value: "100000000000", order: 10, numericValue: 100000000000 }
  ];

  // Insert the price options
  await propertyPriceCollection.insertMany(prices);
  
  // Create indexes for efficient querying
  await propertyPriceCollection.createIndex({ order: 1 });
  await propertyPriceCollection.createIndex({ numericValue: 1 });

  console.log('✅ Database seeded with property prices options');
}


// Correctly handle async errors
(async () => {
  try {
    await seedDummyProperties();
    await seedCities();
    await seedLotSizes();
    await seedSorts();
    await seedFacings();
    await seedPropertyPrices();
  } catch (error) {
    console.error('❌ Unexpected seed error:', error);
  }
})();
