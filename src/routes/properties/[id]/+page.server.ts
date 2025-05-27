import { connectToDatabase } from '$lib/db/client.ts';
import { error } from '@sveltejs/kit';
import type { LoadEvent } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const load = async ({ params }: LoadEvent) => {
  const db = await connectToDatabase();
  const id = params.id ?? '';

  const property = await db.collection('properties').findOne({ _id: new ObjectId(id) });

  if (!property) {
    throw error(404, 'Property not found');
  }

  return {
    property: JSON.parse(JSON.stringify(property))
  };
};
