export function getRandom(options: Record<string, number>) {
  const pool = [];
  for (const key in options) {
    const weight = options[key];
    for (let i = 0; i < weight; i++) {
      pool.push(key);
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}
