import { getHistory } from '../services/history.service';
import { useApiResource } from './useApiResource';

/** Histórico persistido pelo backend; recarrega a cada vez que a página é aberta. */
export function useHistory() {
  const { status, data, error, reload } = useApiResource(() => getHistory(), []);
  return { status, items: data ?? [], error, reload };
}
