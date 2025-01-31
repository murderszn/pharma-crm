import { getSession } from 'next-auth/react';
import { connectToDatabase } from '@/utils/mongodb';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { db } = await connectToDatabase();

  switch (req.method) {
    case 'GET':
      const hcps = await db.collection('hcps').find().toArray();
      res.status(200).json(hcps);
      break;
    case 'POST':
      const newHcp = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        complianceStatus: 'Pending',
      };
      const result = await db.collection('hcps').insertOne(newHcp);
      res.status(201).json(result.ops[0]);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}