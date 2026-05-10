import type { ApiResponse } from '@/types'

export async function readApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const body = await response.text()

  let payload: ApiResponse<T> | null = null
  if (body) {
    try {
      payload = JSON.parse(body) as ApiResponse<T>
    } catch {
      const preview = body.length > 180 ? `${body.slice(0, 180)}...` : body
      return {
        success: false,
        data: null,
        error: `API returned ${response.status} ${response.statusText}: ${preview}`,
      }
    }
  }

  if (!response.ok) {
    return {
      success: false,
      data: payload?.data ?? null,
      error: payload?.error ?? `API request failed with ${response.status} ${response.statusText}`,
    }
  }

  return payload ?? {
    success: false,
    data: null,
    error: 'API returned an empty response',
  }
}
