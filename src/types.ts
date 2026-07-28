/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DocSection {
  id: string;
  title: string;
  category: string;
  content: string;
  iconName: string;
}

export interface StakeholderRole {
  code: string;
  name: string;
  description: string;
  targetUsers: string;
  permissions: string[];
}

export interface MasterDataItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  isSystem: boolean;
}

export interface MasterDataCategory {
  key: string;
  name: string;
  description: string;
  items: MasterDataItem[];
}

export interface SystemConfig {
  key: string;
  value: string;
  description: string;
  type: 'boolean' | 'string' | 'number';
  category: 'Security' | 'Storage' | 'Logging' | 'System';
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'scanning' | 'success' | 'failed';
  url: string;
  uploadedAt: string;
  md5: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: string;
  entity: string;
  entityId: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  details: string;
  ipAddress: string;
  chainHash: string;
}

export interface SystemNotification {
  id: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  recipient: string;
  content: string;
  status: 'sent' | 'failed' | 'queued';
  timestamp: string;
}

export interface DevTask {
  id: string;
  title: string;
  owner: string;
  estimate: string;
  status: 'Todo' | 'In Progress' | 'Completed';
  category: string;
}

export interface TestCase {
  id: string;
  title: string;
  precondition: string;
  steps: string[];
  expected: string;
  status: 'Passed' | 'Untested' | 'Failed';
}

export interface MeetingAttachment {
  name: string;
  size: string;
}

export interface CalendarMeeting {
  id: string;
  title: string;
  meetingType:
    | 'Business Meeting'
    | 'Sales Meeting'
    | 'Client Discussion'
    | 'Vendor Meeting'
    | 'Supplier Meeting'
    | 'RFQ Discussion'
    | 'Marketplace Product Demo'
    | 'Opportunity Discussion'
    | 'Partnership Meeting'
    | 'Networking Meeting'
    | 'Site Visit'
    | 'Online Meeting';
  relatedCompany: string;
  companyId?: string;
  contactPerson: string;
  organizer: string;
  participants: string[];
  relatedLeadId?: string;
  relatedRfqId?: string;
  relatedOpportunityId?: string;
  relatedProductId?: string;
  meetingDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  meetingMode: 'In Person' | 'Video Call' | 'Voice Call';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  status: 'Scheduled' | 'Confirmed' | 'Rescheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  agenda: string;
  notes: string;
  discussionPoints: string[];
  actionItems: string[];
  followUpTasks: string[];
  reminderTime: '15 Minutes Before' | '30 Minutes Before' | '1 Hour Before' | '1 Day Before' | 'None';
  attachments: MeetingAttachment[];
}

