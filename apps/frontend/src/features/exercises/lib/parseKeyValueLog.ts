// Pares clave=valor de una línea de log (formato de FortiGate y similares), en su orden original.
// Los valores pueden ir entre comillas con espacios; el prefijo de prioridad syslog (<189>) se ignora.
export function parseKeyValueLog(line: string): Array<[string, string]> {
  return [...line.matchAll(/(\w+)=(?:"([^"]*)"|(\S+))/g)].map((match) => [match[1], match[2] ?? match[3]])
}
