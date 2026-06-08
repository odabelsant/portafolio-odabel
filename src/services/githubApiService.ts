const GITHUB_API_BASE = "https://api.github.com";
const REPO = import.meta.env.VITE_GITHUB_REPO as string;
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
const DEFAULT_BRANCH = "main";

if (!REPO || !TOKEN) {
  console.warn(
    "[GitHubAPI] VITE_GITHUB_REPO or VITE_GITHUB_TOKEN is not set. " +
    "Backoffice save operations will fail. Set these in .env.local or Vercel."
  );
}

interface GitHubFileResponse {
  sha: string;
  content: string;
  download_url: string;
  path: string;
  name: string;
}

interface GitHubPutPayload {
  message: string;
  content: string;
  branch: string;
  sha?: string;
}

interface GitHubDeletePayload {
  message: string;
  sha: string;
  branch: string;
}

function ensureGithubEnv() {
  if (!REPO || !TOKEN) {
    throw new Error(
      "[GitHubAPI] Missing VITE_GITHUB_REPO or VITE_GITHUB_TOKEN. Configure both variables before saving."
    );
  }
}

function getRequestHeaders() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function getContentsUrl(filePath: string): string {
  return `${GITHUB_API_BASE}/repos/${REPO}/contents/${filePath}`;
}

async function readGithubErrorMessage(response: Response): Promise<string> {
  const error = await response.json().catch(() => ({} as Record<string, unknown>));
  return typeof error.message === "string" ? error.message : response.statusText;
}

export function encodeToBase64(content: string): string {
  return btoa(unescape(encodeURIComponent(content)));
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("No se pudo convertir el archivo a base64."));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Error al leer el archivo."));
    reader.readAsDataURL(file);
  });
}

export async function getFileSHA(path: string): Promise<{ sha: string; exists: boolean }> {
  ensureGithubEnv();
  const response = await fetch(getContentsUrl(path), {
    headers: getRequestHeaders(),
  });

  if (response.status === 404) {
    return { sha: "", exists: false };
  }

  if (!response.ok) {
    const errorMessage = await readGithubErrorMessage(response);
    throw new Error(`[GitHubAPI] GET failed for ${path}: ${errorMessage}`);
  }

  const data: GitHubFileResponse = await response.json();
  return { sha: data.sha, exists: true };
}

async function putFileToRepo(
  filePath: string,
  base64Content: string,
  commitMessage: string
): Promise<void> {
  ensureGithubEnv();
  const { sha, exists } = await getFileSHA(filePath);

  const payload: GitHubPutPayload = {
    message: commitMessage,
    content: base64Content,
    branch: DEFAULT_BRANCH,
  };

  if (exists && sha) {
    payload.sha = sha;
  }

  const response = await fetch(getContentsUrl(filePath), {
    method: "PUT",
    headers: getRequestHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await readGithubErrorMessage(response);
    throw new Error(`[GitHubAPI] PUT failed for ${filePath}: ${errorMessage}`);
  }
}

export async function updateTextFileInRepo(
  filePath: string,
  textContent: string,
  commitMessage: string
): Promise<void> {
  const encodedContent = encodeToBase64(textContent);
  await putFileToRepo(filePath, encodedContent, commitMessage);
}

export async function uploadBase64FileToRepo(
  filePath: string,
  base64Content: string,
  commitMessage: string
): Promise<void> {
  await putFileToRepo(filePath, base64Content, commitMessage);
}

export async function uploadBinaryFileToRepo(
  filePath: string,
  file: File,
  commitMessage: string
): Promise<void> {
  const base64Content = await fileToBase64(file);
  await uploadBase64FileToRepo(filePath, base64Content, commitMessage);
}

export async function deleteFileFromRepo(filePath: string, commitMessage: string): Promise<void> {
  ensureGithubEnv();
  const { sha, exists } = await getFileSHA(filePath);
  if (!exists || !sha) {
    return;
  }

  const payload: GitHubDeletePayload = {
    message: commitMessage,
    sha,
    branch: DEFAULT_BRANCH,
  };

  const response = await fetch(getContentsUrl(filePath), {
    method: "DELETE",
    headers: getRequestHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await readGithubErrorMessage(response);
    throw new Error(`[GitHubAPI] DELETE failed for ${filePath}: ${errorMessage}`);
  }
}
