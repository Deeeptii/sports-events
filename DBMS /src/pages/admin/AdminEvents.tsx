import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Plus, Filter, Calendar, MapPin, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockEvents } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatCurrency';

type Event = {
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
};

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    event_date: '',
    venue: '',
    category: '',
    description: '',
    image: '',
    registration_deadline: '',
    fee: '',
  });

  // Get unique categories from events
  const categories = [...new Set(mockEvents.map(event => event.category))];

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let result = [...events];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        event => 
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(event => event.category === categoryFilter);
    }
    
    setFilteredEvents(result);
  }, [events, searchTerm, categoryFilter]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      event_date: '',
      venue: '',
      category: '',
      description: '',
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
      registration_deadline: '',
      fee: '',
    });
    setEditingEvent(null);
    setShowModal(true);
  };

  const openEditModal = (event: Event) => {
    setFormData({
      name: event.name,
      event_date: event.event_date,
      venue: event.venue,
      category: event.category,
      description: event.description,
      image: event.image,
      registration_deadline: event.registration_deadline,
      fee: event.fee.toString(),
    });
    setEditingEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.event_date || !formData.venue || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create event object
    const eventData = {
      id: editingEvent ? editingEvent.id : Math.floor(Math.random() * 1000) + 10,
      name: formData.name,
      event_date: formData.event_date,
      venue: formData.venue,
      category: formData.category,
      description: formData.description,
      image: formData.image,
      status: 'upcoming',
      registration_deadline: formData.registration_deadline,
      fee: parseFloat(formData.fee) || 0,
      organizer_id: 2, // Default to the first organizer
    };

    if (editingEvent) {
      // Update existing event
      setEvents(events.map(event => (event.id === editingEvent.id ? eventData : event)));
      toast.success('Event updated successfully');
    } else {
      // Add new event
      setEvents([...events, eventData]);
      toast.success('Event added successfully');
    }

    closeModal();
  };

  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
      toast.success('Event deleted successfully');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Events Management</h2>
          <button
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="sm:w-64 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all duration-200"
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4 border border-gray-200 border-t-0 rounded-b-lg">
                  <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                  <div className="h-10 bg-gray-300 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                      {event.category}
                    </span>
                    <span className="text-gray-600 font-medium">{formatCurrency(event.fee)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{event.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(event)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
                <p className="text-gray-500">Try changing your search criteria</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="registration_deadline"
                    value={formData.registration_deadline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Fee (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="fee"
                    value={formData.fee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use default image. Use a valid image URL.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  {editingEvent ? 'Update' : 'Add'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;