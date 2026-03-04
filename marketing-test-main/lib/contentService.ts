// lib/contentService.ts
import { api } from './axios';

export interface ContentItem {
  id: string;
  title: string;
  stream: string;
  class: string;
  subject: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
  author: string;
  tags: string[];
}

export interface ContentFilters {
  stream?: string;
  class?: string;
  subject?: string;
  search?: string;
}

/**
 * Get all content items with optional filtering
 */
export async function getContentItems(filters?: ContentFilters): Promise<ContentItem[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.stream) params.append('stream', filters.stream);
    if (filters?.class) params.append('class', filters.class);
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/content?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw new Error('Failed to fetch content items');
  }
}

/**
 * Get content item by ID
 */
export async function getContentItem(id: string): Promise<ContentItem> {
  try {
    const response = await api.get(`/content/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching content item:', error);
    throw new Error('Failed to fetch content item');
  }
}

/**
 * Delete content item
 */
export async function deleteContentItem(id: string): Promise<boolean> {
  try {
    await api.delete(`/content/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting content item:', error);
    throw new Error('Failed to delete content item');
  }
}

/**
 * Update content item metadata
 */
export async function updateContentItem(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
  try {
    const response = await api.put(`/content/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating content item:', error);
    throw new Error('Failed to update content item');
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
    const response = await api.get('/content/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching content stats:', error);
    throw new Error('Failed to fetch content statistics');
  }
}
