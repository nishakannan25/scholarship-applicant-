export interface AuditEvent {
  id: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
  ipAddress: string;
  userAgent: string;
  location: string;
}

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'evt-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleString(),
    status: 'SUCCESS',
    ipAddress: '192.168.1.105',
    userAgent: 'Chrome 122.0.0 (macOS)',
    location: 'San Francisco, CA, US',
  },
  {
    id: 'evt-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString(),
    status: 'FAILED',
    ipAddress: '192.168.1.105',
    userAgent: 'Chrome 122.0.0 (macOS)',
    location: 'San Francisco, CA, US',
  },
  {
    id: 'evt-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString(),
    status: 'SUCCESS',
    ipAddress: '10.0.0.42',
    userAgent: 'Firefox 123.0 (Windows)',
    location: 'Austin, TX, US',
  },
  {
    id: 'evt-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toLocaleString(),
    status: 'SUCCESS',
    ipAddress: '10.0.0.42',
    userAgent: 'Mobile Safari 17.2 (iOS)',
    location: 'Austin, TX, US',
  },
  {
    id: 'evt-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toLocaleString(),
    status: 'FAILED',
    ipAddress: '198.51.100.14',
    userAgent: 'Edge 121.0.0 (Windows)',
    location: 'Chicago, IL, US',
  },
];
