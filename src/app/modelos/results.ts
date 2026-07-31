export interface Results<T> {
  dato?: T | null;          // equivalente a 'public T? dato;'
  data?: T[] | null;        // equivalente a 'public List<T>? data;'
  totalPaginas: number;     // 'public int totalPaginas;'
  totalRegistros: number;   // 'public int totalRegistros;'
  code?: string | null;     // 'public string? code;'
  message?: string | null;  // 'public string? message;'
  error?: string | null;    // 'public string? error;'
}