/**
 * Triggers a browser download for a specific file by fetching a secure URL first.
 * * @param filePath - The path of the file in the storage bucket (e.g., 'plans/house-A1.pdf')
 * @param fileName - The name the file should be saved as (e.g., 'House-Plan-A1.pdf')
 */
export async function downloadFile(filePath: string, fileName: string): Promise<void> {
  try {
    // 1. Request a signed URL from our API
    const response = await fetch('/api/downloads/generate-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate download link');
    }

    const { signedUrl } = await response.json();

    // 2. Create a temporary anchor element to trigger the download
    // This method works for cross-origin files better than window.open
    const link = document.createElement('a');
    link.href = signedUrl;
    link.download = fileName; // Suggests the filename to the browser
    link.target = '_blank';   // fallback tab
    
    document.body.appendChild(link);
    link.click();
    
    // 3. Clean up
    document.body.removeChild(link);

  } catch (error) {
    console.error('Download failed:', error);
    throw error; // Re-throw so the UI component can show an error toast
  }
}
