const BASE_URL = "http://localhost:8080/api";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

// Basic paged calls (used by tables, etc.)
export async function getTransactions(page = 0, size = 20) {
  return fetchJson(`${BASE_URL}/transactions?page=${page}&size=${size}`);
}

export async function getMemoryGc(page = 0, size = 20) {
  return fetchJson(`${BASE_URL}/memory-gc?page=${page}&size=${size}`);
}

// NEW: Fetch *all* transactions (iterates through all pages)
export async function getAllTransactions() {
  let all = [];
  let page = 0;
  const size = 100;

  while (true) {
    const data = await getTransactions(page, size);
    const content = data.content || [];
    all = all.concat(content);

    if (data.last || page + 1 >= data.totalPages) {
      break;
    }
    page++;
  }

  return all;
}

// NEW: Fetch *all* memory GC logs (iterates through all pages)
export async function getAllMemoryGc() {
  let all = [];
  let page = 0;
  const size = 100;

  while (true) {
    const data = await getMemoryGc(page, size);
    const content = data.content || [];
    all = all.concat(content);

    if (data.last || page + 1 >= data.totalPages) {
      break;
    }
    page++;
  }

  return all;
}
