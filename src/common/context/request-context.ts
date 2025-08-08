import { asyncLocalStorage, RequestContextData } from '../middleware/request-context.middleware';

export function getRequestContext(): RequestContextData {
  return asyncLocalStorage.getStore() || {};
}
