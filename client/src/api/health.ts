const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000"
).replace(/\/+$/, "");

export interface HealthResponse {
  status: "ok";
}

function isHealthResponse(value: unknown): value is HealthResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    value.status === "ok"
  );
}

export async function fetchHealth(
  signal?: AbortSignal,
): Promise<HealthResponse> {
  const response = await fetch(`${apiBaseUrl}/api/health`, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Health request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!isHealthResponse(data)) {
    throw new Error("Health response had an unexpected format");
  }

  return data;
}