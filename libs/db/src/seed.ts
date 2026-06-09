import { connectToDatabase, disconnectFromDatabase, UserModel } from './index';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env variables from root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/job_hunter_db';

async function main() {
  console.log(`Connecting to MongoDB at: ${mongoUri}`);
  await connectToDatabase(mongoUri);

  const user = await UserModel.findOneAndUpdate(
    { id: 'user-uuid-123' },
    {
      id: 'user-uuid-123',
      name: 'Gerson Architect',
      email: 'gerson.architect@example.com',
      phone: '+5491123456789',
    },
    { upsert: true, new: true }
  );

  console.log(`✅ Test user successfully seeded in MongoDB:`, user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectFromDatabase();
  });
