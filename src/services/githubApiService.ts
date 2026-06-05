// =============================================================================
// githubApiService.ts
// Handles all direct GitHub Contents API calls for the Admin Backoffice.
// Requires environment variables:
//   - VITE_GITHUB_TOKEN  : GitHub Personal Access Token (scope: repo)
//   - VITE_GITHUB_REPO   : Repository in "owner/repo" format (e.g. odabelsant/portafolio)
// =============================================================================

const GITHUB_API_BASE = "https://api.github.com";
const REPO = import.meta.env.VITE_GITHUB_REPO as string;
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;

if (!REPO || !TOKEN) {
  console.warn(
    "[GitHubAPI] VITE_GITHUB_REPO or VITE_GITHUB_TOKEN is not set. " +
    "Backoffice save operations will fail. Set these in .env.local or Vercel."
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface GitHubFileResponse {
  sha: string;
  content: string; // Base64 encoded
  download_url: string;
  path: string;
  name: string;
}

interface GitHubPutPayload {
  message: string;
  content: string; // Base64 encoded
  sha: string;     // Required for updates
  branch?: string;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Converts a UTF-8 string to Base64 (handles unicode safely) */
export function encodeToBase64(content: string): string {
  return btoa(unescape(encodeURIComponent(content)));
}

/** Convert a File object to Base64 string (without data: prefix) */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:*/*;base64," prefix
      const base64 = result.split(",")[1];
      if (!base64) reject(new Error("Could not convert file to base64"));
      else resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ─── Core API Calls ───────────────────────────────────────────────────────────

/**
 * Gets the current SHA of a file in the repository.
 * Required before any update operation.
 */
async function getFileSHA(path: string): Promise<{ sha: string; exists: boolean }> {
  const url = `${GITHUB_API_BASE}/repos/${REPO}/contents/${path}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (response.status === 404) {
    return { sha: "", exists: false };
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`[GitHubAPI] GET failed for ${path}: ${error.message ?? response.statusText}`);
  }

  const data: GitHubFileResponse = await response.json();
  return { sha: data.sha, exists: true };
}

/**
 * Creates or updates a text file in the repository with the given content.
 * @param filePath - Path relative to repo root (e.g. "src/content/siteContent.ts")
 * @param textContent - The full new content of the file as a UTF-8 string
 * @param commitMessage - Git commit message
 */
export async function updateTextFileInRepo(
  filePath: string,
  textContent: string,
  commitMessage: string
): Promise<void> {
  const { sha } = await getFileSHA(filePath);
  const encodedContent = encodeToBase64(textContent);

  const payload: GitHubPutPayload = {
    message: commitMessage,
    content: encodedContent,
    sha,
    branch: "main",
  };

  const url = `${GITHUB_API_BASE}/repos/${REPO}/contents/${filePath}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `[GitHubAPI] PUT failed for ${filePath}: ${error.message ?? response.statusText}`
    );
  }
}

/**
 * Uploads a binary file (image, PDF) to the repository.
 * @param filePath - Destination path relative to repo root (e.g. "public/recursos/foto-perfil.jpg")
 * @param file - The File object from an <input type="file">
 * @param commitMessage - Git commit message
 */
export async function uploadBinaryFileToRepo(
  filePath: string,
  file: File,
  commitMessage: string
): Promise<void> {
  const { sha } = await getFileSHA(filePath);
  const base64Content = await fileToBase64(file);

  const payload: GitHubPutPayload = {
    message: commitMessage,
    content: base64Content,
    sha,
    branch: "main",
  };

  const url = `${GITHUB_API_BASE}/repos/${REPO}/contents/${filePath}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `[GitHubAPI] Binary PUT failed for ${filePath}: ${error.message ?? response.statusText}`
    );
  }
}
