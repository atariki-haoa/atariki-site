export function renderLoginPage(params: { txn: string; clientName?: string; error?: string }): string {
  const clientName = params.clientName ? escapeHtml(params.clientName) : 'un cliente MCP';

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Autorizar acceso</title>
<style>
  body { font-family: system-ui, sans-serif; background: #111; color: #eee; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  form { background: #1a1a1a; padding: 2rem; border-radius: 12px; width: 320px; box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
  h1 { font-size: 1.1rem; margin: 0 0 0.5rem; }
  p { font-size: 0.9rem; color: #aaa; margin: 0 0 1.5rem; }
  input[type="password"] { width: 100%; box-sizing: border-box; padding: 0.6rem; border-radius: 6px; border: 1px solid #333; background: #0d0d0d; color: #eee; font-size: 1rem; }
  button { margin-top: 1rem; width: 100%; padding: 0.6rem; border-radius: 6px; border: none; background: #4ade80; color: #0d0d0d; font-weight: 600; font-size: 1rem; cursor: pointer; }
  .error { color: #f87171; font-size: 0.85rem; margin: 0.75rem 0 0; }
</style>
</head>
<body>
<form method="POST" action="/authorize/login">
  <h1>Autorizar acceso</h1>
  <p>${clientName} quiere conectarse a atariki.dev como el administrador.</p>
  <input type="hidden" name="txn" value="${escapeHtml(params.txn)}" />
  <input type="password" name="password" placeholder="Contraseña de admin" autofocus required />
  ${params.error ? `<p class="error">${escapeHtml(params.error)}</p>` : ''}
  <button type="submit">Autorizar</button>
</form>
</body>
</html>`;
}

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] || char);
}
