/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Context } from '@temporalio/activity';
import { createHash } from 'crypto';
import * as fs from 'fs/promises';

export function createNormalActivities(uniqueWorkerTaskQueue: string) {
  return {
    async getUniqueTaskQueue(): Promise<string> {
      return uniqueWorkerTaskQueue;
    },
  };
}

export function createActivitiesForSameWorker() {
  return {
    async downloadFileToWorkerFileSystem(url: string, path: string): Promise<void> {
      const { log } = Context.current();
      log.info('Downloading and saving', { url, path });
      // Here's where the real download code goes
      const body = Buffer.from('downloaded body');
      const context = Context.current();
      await context.sleep(3000);
      await fs.writeFile(path, body);
    },
    async workOnFileInWorkerFileSystem(path: string): Promise<void> {
      const { log } = Context.current();
      const content = await fs.readFile(path);
      const checksum = createHash('md5').update(content).digest('hex');
      const context = Context.current();
      await context.sleep(3000);
      log.info('Did some work', { path, checksum });
    },
    async cleanupFileFromWorkerFileSystem(path: string): Promise<void> {
      const { log } = Context.current();
      const context = Context.current();
      await context.sleep(3000);
      log.info('Cleaning up temp file', { path });
      await fs.rm(path);
    },
  };
}
