import { connectToDatabase } from '$lib/db/client.ts';
import { error } from '@sveltejs/kit';
import type { LoadEvent } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const load = async ({ params, url }: LoadEvent) => {
  const db = await connectToDatabase();
  const id = params.id ?? '';
  const instagramUrl = 'https://www.instagram.com/moruma.id/?igshid=YmMyMTA2M2Y=';
  const whatsappApiUrl = 'https://api.whatsapp.com/send?phone=628175175118&text='
  const message = `Saya tertarik dengan properti ini: ${url.href}`;
  const whatsappUrl = `${whatsappApiUrl}${encodeURIComponent(message)}`;

  const property = await db.collection('properties').findOne({ _id: new ObjectId(id) });

  if (!property) {
    throw error(404, 'Property not found');
  }

  return {
    property: JSON.parse(JSON.stringify(property)),
    instagramUrl,
    whatsappUrl
  };
};
