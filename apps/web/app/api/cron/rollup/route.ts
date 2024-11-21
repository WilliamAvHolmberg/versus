import { rollupDailyStats } from '@/jobs/rollupStats'

export async function GET() {
  await rollupDailyStats()
  return new Response('OK')
} 