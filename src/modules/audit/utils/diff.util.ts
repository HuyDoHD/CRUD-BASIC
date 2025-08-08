export function diffObjects(
  oldObj: any,
  newObj: any,
  opts?: { blacklist?: string[] },
) {
  const blacklist = new Set(opts?.blacklist || []);
  const changes: Record<string, { old: any; new: any }> = {};

  const keys = new Set([
    ...Object.keys(oldObj || {}),
    ...Object.keys(newObj || {}),
  ]);
  for (const key of keys) {
    if (blacklist.has(key)) continue;

    const oldVal = oldObj?.[key];
    const hasNew = Object.prototype.hasOwnProperty.call(newObj || {}, key);
    const newVal = hasNew ? newObj[key] : oldVal; // tránh null hóa khi không có

    if (oldVal !== newVal) {
      changes[key] = { old: oldVal, new: newVal };
    }
  }
  return changes;
}

function deepEqual(a: any, b: any): boolean {
  // quick checks
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a == null || b == null) return a === b;

  // primitives covered above, now arrays/objects
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }

  return false;
}
