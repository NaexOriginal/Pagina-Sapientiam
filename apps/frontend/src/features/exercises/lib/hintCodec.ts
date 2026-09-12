// Las pistas se guardan en Base64 (UTF-8) para que no aparezcan en claro en el bundle ni en DevTools.
// No es cifrado: solo evita leerlas antes de tiempo con un Ctrl+F.

export function encodeHint(hint: string): string {
  let binary = ''
  for (const byte of new TextEncoder().encode(hint)) binary += String.fromCharCode(byte)
  return btoa(binary)
}

export function decodeHint(encoded: string): string {
  const binary = atob(encoded)
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))
}
