export interface JobQueuePort {
  enqueueScraping(profileId: string, profession: string): Promise<void>;
}
