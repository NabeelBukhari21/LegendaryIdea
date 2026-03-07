import { config } from 'dotenv';
config({ path: '.env.local' });
import { getTeacherMasterThreadId } from './src/lib/backboard-service';

async function run() {
    try {
        console.log("Fetching Teacher Master Thread...");
        const id = await getTeacherMasterThreadId();
        console.log("Success! Thread ID:", id);
    } catch(err) {
        console.error("ERROR:", err);
    }
}
run();
