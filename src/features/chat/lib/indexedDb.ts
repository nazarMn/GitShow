import { openDB } from 'idb';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';
import type { ChatMessage } from '@/shared/types/domain';

const DB_NAME = 'ChatApp';
const STORE_NAME = 'Messages';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveMessages(chatId: string, messages: ChatMessage[]) {
  const db = await initDB();
  const compressed = compressToUTF16(JSON.stringify(messages));
  await db.put(STORE_NAME, compressed, chatId);
}

export async function loadMessages(chatId: string): Promise<ChatMessage[]> {
  const db = await initDB();
  const compressed = await db.get(STORE_NAME, chatId);
  if (compressed) {
    try {
      const decompressed = decompressFromUTF16(compressed);
      const messages = JSON.parse(decompressed) as ChatMessage[];
      return Array.isArray(messages) ? messages : [];
    } catch (e) {
      console.error('Error decompressing messages:', e);
    }
  }
  return [];
}
