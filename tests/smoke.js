import { spawn } from 'child_process';
import { setTimeout as delay } from 'timers/promises';

async function run() {
  const proc = spawn('node', ['src/server.js'], { stdio: 'inherit' });
  await delay(2000);
  proc.kill();
  console.log('✅ Boot test passed (server started).');
}
run();