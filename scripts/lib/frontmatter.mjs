export function parseFrontmatter(raw) {
  const source = String(raw).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  if (!source.startsWith("---\n")) {
    return { data: {}, body: source };
  }

  const end = source.indexOf("\n---", 4);
  if (end === -1) {
    throw new Error("Front matter opened with --- but was never closed");
  }

  const header = source.slice(4, end);
  let body = source.slice(end + 4);
  body = body.replace(/^\n/, "");

  const data = {};
  for (const rawLine of header.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, body };
}
