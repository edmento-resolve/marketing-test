export type AudienceType = 'ALL' | 'TEACHERS' | 'STUDENTS' | 'PARENTS' | 'STAFF' | 'SPECIFIC_CLASSES';

export interface Announcement {
    id: string;
    title: string;
    message: string;
    attachments: { name: string; url: string; size: string; type: string }[];
    audience: AudienceType[];
    target_classes?: string[]; // IDs of classes if audience includes SPECIFIC_CLASSES
    status: 'DRAFT' | 'PUBLISHED';
    author_name: string;
    created_at: string;
    updated_at: string;
}

export interface CreateAnnouncementPayload {
    title: string;
    message: string;
    attachments?: { name: string; url: string; size: string; type: string }[];
    audience: AudienceType[];
    target_classes?: string[];
    status: 'DRAFT' | 'PUBLISHED';
}
