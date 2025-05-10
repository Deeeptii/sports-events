import api from '../utils/api';

export interface Event {
  id: number;
  name: string;
  event_date: string;
  venue: string;
  category: string;
  description: string;
  image: string;
  status: string;
  registration_deadline: string;
  fee: number;
  organizer_id: number;
}

export const eventsService = {
  async getAllEvents() {
    const response = await api.get('/events');
    return response.data;
  },

  async getEventById(id: number) {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  async createEvent(eventData: Partial<Event>) {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  async updateEvent(id: number, eventData: Partial<Event>) {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  async deleteEvent(id: number) {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};