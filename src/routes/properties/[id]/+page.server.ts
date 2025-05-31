import { connectToDatabase } from '$lib/db/client.ts';
import { error } from '@sveltejs/kit';
import type { LoadEvent } from '@sveltejs/kit';
import { ObjectId, Long } from 'mongodb';
import { REVEAL_BASE_URL } from '$env/static/private';
import type { Property } from '$lib/types/property.ts';

export const load = async ({ params, url }: LoadEvent) => {
  const db = await connectToDatabase();
  const id = params.id ?? '';
  const instagramUrl = 'https://www.instagram.com/moruma.id/?igshid=YmMyMTA2M2Y=';
  // const whatsappApiUrl = 'https://api.whatsapp.com/send?phone=628175175118&text='
  // const message = `Saya tertarik dengan properti ini: ${url.href}`;
  // const whatsappUrl = `${whatsappApiUrl}${encodeURIComponent(message)}`;

  const property = await db.collection<Property>('properties').findOne({ _id: new ObjectId(id) });

  if (!property) {
    throw error(404, 'Property not found');
  }

  const modListingId = Long.fromBits(property.listingId.low, property.listingId.high, property.listingId.unsigned).toString();
  const apiUrl = {
    me: REVEAL_BASE_URL + '/api/me',
    auth: REVEAL_BASE_URL + '/api/auth',
    validate: REVEAL_BASE_URL + '/api/auth/validate',
    receipt: REVEAL_BASE_URL + '/api/receipt',
    receipts: REVEAL_BASE_URL + '/api/proxy/receipts',
    decrypt: REVEAL_BASE_URL + '/api/decrypt',
  };
  
  console.log('apiUrl', apiUrl);
  return {
    property: JSON.parse(JSON.stringify(property)),
    instagramUrl,
    apiUrl,
    modListingId
  };
};
