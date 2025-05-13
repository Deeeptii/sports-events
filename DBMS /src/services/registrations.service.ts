import api from '../utils/api';

export interface Registration {
  id: number;
  user_id?: number;
  team_id?: number;
  event_id: number;
  registration_status: string;
  registration_date: string;
}

export const registrationsService = {
  async registerForEvent(eventId: number, teamId?: number) {
    const response = await api.post('/registrations', {
      event_id: eventId,
      team_id: teamId,
    });
    return response.data;
  },

  async updateRegistrationStatus(registrationId: number, status: string) {
    const response = await api.put(`/registrations/${registrationId}`, {
      status,
    });
    return response.data;
  },
};