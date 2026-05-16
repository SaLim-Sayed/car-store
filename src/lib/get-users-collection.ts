import clientPromise from '@/lib/mongodb';

export async function getUsersCollection() {
 const client = await clientPromise;
 return client.db().collection('users');
}
