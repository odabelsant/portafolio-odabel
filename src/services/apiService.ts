function getAuthHeaders() {
  const token = sessionStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function saveContent(key: string, value: any): Promise<any> {
  const response = await fetch("/api/content", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
}

export async function deleteContent(key: string): Promise<any> {
  const response = await fetch(`/api/content?key=${encodeURIComponent(key)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
}

// Metrics REST endpoints
export async function createOrUpdateMetric(metric: {
  id: string;
  label: string;
  value: string;
  icon: string;
  labelKey?: string;
}): Promise<any> {
  // Try PUT first; if it returns 404 or fails, we can fall back to POST
  // In our backend, POST is create, PUT is update.
  // We can also check if it exists or use POST/PUT appropriately.
  const body = {
    id: metric.id,
    label: metric.label,
    value: metric.value,
    icon: metric.icon,
    labelKey: metric.labelKey || "",
  };

  const response = await fetch("/api/metrics", {
    method: "POST", // Create or upsert
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (response.status === 400 || response.status === 500) {
    // Attempt PUT as fallback
    const putResponse = await fetch("/api/metrics", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    const putData = await putResponse.json();
    if (!putResponse.ok) {
      throw new Error(putData.error || `HTTP error on PUT! status: ${putResponse.status}`);
    }
    return putData;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error on POST! status: ${response.status}`);
  }
  return data;
}

export async function deleteMetric(id: string): Promise<any> {
  const response = await fetch(`/api/metrics?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
}

// Certificates REST endpoints
export async function createCertificate(cert: {
  id: string;
  title: string;
  institution: string;
  year: string;
  fileUrl: string;
}): Promise<any> {
  const response = await fetch("/api/certificates", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(cert),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
}

export async function updateCertificate(cert: {
  id: string;
  title: string;
  institution: string;
  year: string;
  fileUrl: string;
}): Promise<any> {
  const response = await fetch("/api/certificates", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(cert),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
}

export async function deleteCertificate(id: string): Promise<any> {
  const response = await fetch(`/api/certificates?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
}
