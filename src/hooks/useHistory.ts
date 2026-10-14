import { getHistory } from '../services/history.service';
import { getSessionId } from '../services/session';
import { useApiResource } from './useApiResource';

/** Histórico persistido pelo backend; recarrega a cada vez que a página é aberta. */
export function useHistory() {
  const { status, data, error, reload } = useApiResource(
    () => getHistory(undefined, getSessionId() ?? undefined),
    []
  );
  return { status, items: data ?? [], error, reload };
}
