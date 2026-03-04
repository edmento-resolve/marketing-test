// lib/databaseService.ts
import { api } from './axios';

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined;
  }

  const response = (error as { response?: { status?: number } }).response;

  if (typeof response !== 'object' || response === null) {
    return undefined;
  }

  return response.status;
};

export interface DatabaseContentItem {
  id: string;
  title: string;
  stream: string;
  class: string;
  subject: string;
  links: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateContentPayload {
  title: string;
  stream: string;
  class: string;
  subject: string;
  links: string;
}

/**
 * Create new content in database
 */
export async function createContent(payload: CreateContentPayload): Promise<DatabaseContentItem> {
  try {
    const response = await api.post('/api/v1/superadmins/r2-links', payload);
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating content:', error);
    
    // If it's a 404 error, the endpoint doesn't exist
    if (getErrorStatus(error) === 404) {
      throw new Error('API endpoint not found. Please check your backend configuration.');
    }
    
    throw new Error('Failed to create content');
  }
}

/**
 * Get all content from database
 */
export async function getAllContent(): Promise<DatabaseContentItem[]> {
  try {
    const response = await api.get('/api/v1/superadmins/r2-links');
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching content:', error);
    
    // If it's an auth error, return empty array for now
    if (getErrorStatus(error) === 401) {
      console.log('Authentication required - returning empty content list');
      return [];
    }
    
    // If it's a 404 error, the endpoint doesn't exist
    if (getErrorStatus(error) === 404) {
      console.log('API endpoint not found - returning empty content list');
      return [];
    }
    
    // For any other error, also return empty array to prevent crashes
    console.log('API error - returning empty content list');
    return [];
  }
}

/**
 * Get content by ID
 */
export async function getContentById(id: string): Promise<DatabaseContentItem> {
  try {
    const response = await api.get(`/api/v1/superadmins/r2-links/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    throw new Error('Failed to fetch content');
  }
}

/**
 * Update content in database
 */
export async function updateContent(id: string, payload: Partial<CreateContentPayload>): Promise<DatabaseContentItem> {
  try {
    const response = await api.put(`/api/v1/superadmins/r2-links/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating content:', error);
    throw new Error('Failed to update content');
  }
}

/**
 * Delete content from database
 */
export async function deleteContent(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/v1/superadmins/r2-links/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting content:', error);
    throw new Error('Failed to delete content');
  }
}

/**
 * Get content statistics
 */
export async function getContentStats(): Promise<{
  total: number;
  byStream: Record<string, number>;
  byClass: Record<string, number>;
  bySubject: Record<string, number>;
}> {
  try {
    const allContent = await getAllContent();
    
    const stats = {
      total: allContent.length,
      byStream: {} as Record<string, number>,
      byClass: {} as Record<string, number>,
      bySubject: {} as Record<string, number>,
    };

    allContent.forEach(item => {
      // Count by stream
      stats.byStream[item.stream] = (stats.byStream[item.stream] || 0) + 1;
      
      // Count by class
      stats.byClass[item.class] = (stats.byClass[item.class] || 0) + 1;
      
      // Count by subject
      stats.bySubject[item.subject] = (stats.bySubject[item.subject] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error calculating content stats:', error);
    // Return empty stats if there's an error
    return {
      total: 0,
      byStream: {},
      byClass: {},
      bySubject: {},
    };
  }
}
