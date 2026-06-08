import { JobQueuePort } from '@job-hunter/domain/ports/job-queue.port';

export class ConsoleJobQueueAdapter implements JobQueuePort {
  async enqueueScraping(profileId: string, profession: string): Promise<void> {
    console.log(`[JobQueue] Enqueued scraping task for Profile: ${profileId} (${profession})`);
  }
}
