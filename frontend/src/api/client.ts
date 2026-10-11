/**
 * Centralized API client module with typed endpoints
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
  environment: string;
}

export interface Mentor {
  id: string;
  name: string;
  timezone: string;
  isActive: boolean;
}

export interface BookableSlot {
  startAt: string; // ISO 8601 UTC
  endAt: string; // ISO 8601 UTC
  parentLocalDate: string;
  parentLocalTime: string;
  parentDisplay: string;
  parentUtcOffset: string;
  mentorLocalDate: string;
  mentorLocalTime: string;
  availableMentorsCount: number;
}

export interface AvailabilityResponse {
  success: boolean;
  data: {
    requestedDate: string;
    requestedTimezone: string;
    durationMinutes: number;
    totalAvailableSlots: number;
    slots: BookableSlot[];
  };
}

export interface CreateBookingPayload {
  parentName: string;
  parentEmail: string;
  parentTimezone: string;
  startTime: string; // ISO 8601 UTC
  studentGrade?: string;
  notes?: string;
  studentName?: string;
  phoneNumber?: string;
  courseName?: string;
}

export interface BookingParticipant {
  id?: string;
  name: string;
  email?: string;
  timezone: string;
  localDate: string;
  localStartTime: string;
  localEndTime: string;
  formattedDisplay: string;
  utcOffset: string;
}

export interface BookingData {
  id: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  classLink: string;
  startAtUtc: string;
  endAtUtc: string;
  parentTimezone: string;
  mentorTimezone: string;
  parent: BookingParticipant;
  mentor: BookingParticipant;
  simulationNotice?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  data: BookingData;
}

export interface CancelBookingResponse {
  success: boolean;
  data: {
    id: string;
    status: 'CANCELLED';
    message: string;
    cancelledAt: string;
  };
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: { suggestedAlternatives?: BookableSlot[]; [key: string]: unknown }
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data?.error?.code || 'API_ERROR',
        data?.error?.message || `HTTP request failed with status ${response.status}`,
        data?.error?.details
      );
    }

    return data as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(500, 'NETWORK_ERROR', (err as Error).message || 'Failed to connect to backend server');
  }
}

export const api = {
  checkHealth: () => apiClient<HealthResponse>('/health'),

  getMentors: () => apiClient<{ success: boolean; data: Mentor[]; count: number }>('/mentors'),

  getAvailability: (params: { date: string; timezone: string; durationMinutes?: number }) => {
    const query = new URLSearchParams({
      date: params.date,
      timezone: params.timezone,
      ...(params.durationMinutes ? { durationMinutes: String(params.durationMinutes) } : {}),
    });
    return apiClient<AvailabilityResponse>(`/availability?${query.toString()}`);
  },

  createBooking: (payload: CreateBookingPayload) =>
    apiClient<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getBooking: (id: string) => apiClient<BookingResponse>(`/bookings/${id}`),

  cancelBooking: (id: string) =>
    apiClient<CancelBookingResponse>(`/bookings/${id}/cancel`, {
      method: 'POST',
    }),
};
