import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Plus, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockTeams, mockEvents, mockUsers, mockTeamMembers } from '../../utils/mockData';

type Team = {
  id: number;
  team_name: string;
  event_id: number;
  created_by: number;
};

type TeamWithDetails = Team & {
  event_name?: string;
  creator_name?: string;
  members?: { id: number; name: string }[];
};

const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<TeamWithDetails[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<TeamWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTeamMembersModal, setShowTeamMembersModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<TeamWithDetails | null>(null);
  const [formData, setFormData] = useState({
    team_name: '',
    event_id: '',
    created_by: '',
  });

  useEffect(() => {
    // Simulate API call with enhanced team data
    setIsLoading(true);
    setTimeout(() => {
      const enhancedTeams = mockTeams.map(team => {
        const event = mockEvents.find(e => e.id === team.event_id);
        const creator = mockUsers.find(u => u.id === team.created_by);
        const teamMemberIds = mockTeamMembers
          .filter(tm => tm.team_id === team.id)
          .map(tm => tm.user_id);
        const members = mockUsers
          .filter(user => teamMemberIds.includes(user.id))
          .map(user => ({ id: user.id, name: user.name }));

        return {
          ...team,
          event_name: event?.name || 'Unknown Event',
          creator_name: creator?.name || 'Unknown User',
          members,
        };
      });
      
      setTeams(enhancedTeams);
      setFilteredTeams(enhancedTeams);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    const filtered = teams.filter(
      team => 
        team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.creator_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeams(filtered);
  }, [teams, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openAddModal = () => {
    setFormData({
      team_name: '',
      event_id: '',
      created_by: '',
    });
    setCurrentTeam(null);
    setShowModal(true);
  };

  const openEditModal = (team: TeamWithDetails) => {
    setFormData({
      team_name: team.team_name,
      event_id: team.event_id.toString(),
      created_by: team.created_by.toString(),
    });
    setCurrentTeam(team);
    setShowModal(true);
  };

  const viewTeamMembers = (team: TeamWithDetails) => {
    setCurrentTeam(team);
    setShowTeamMembersModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentTeam(null);
  };

  const closeTeamMembersModal = () => {
    setShowTeamMembersModal(false);
    setCurrentTeam(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.team_name || !formData.event_id || !formData.created_by) {
      toast.error('Please fill in all required fields');
      return;
    }

    const event = mockEvents.find(e => e.id === parseInt(formData.event_id));
    const creator = mockUsers.find(u => u.id === parseInt(formData.created_by));

    // Create team object
    const teamData: TeamWithDetails = {
      id: currentTeam ? currentTeam.id : Math.floor(Math.random() * 1000) + 10,
      team_name: formData.team_name,
      event_id: parseInt(formData.event_id),
      created_by: parseInt(formData.created_by),
      event_name: event?.name || 'Unknown Event',
      creator_name: creator?.name || 'Unknown User',
      members: [],
    };

    if (currentTeam) {
      // Update existing team
      setTeams(teams.map(team => (team.id === currentTeam.id ? teamData : team)));
      toast.success('Team updated successfully');
    } else {
      // Add new team
      setTeams([...teams, teamData]);
      toast.success('Team added successfully');
    }

    closeModal();
  };

  const handleDeleteTeam = (teamId: number) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(team => team.id !== teamId));
      toast.success('Team deleted successfully');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Teams Management</h2>
          <button
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search teams..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded mb-2"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{team.team_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">{team.event_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">{team.creator_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewTeamMembers(team)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        {team.members?.length || 0} Members
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(team)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTeams.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No teams found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {currentTeam ? 'Edit Team' : 'Add New Team'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="team_name"
                  value={formData.team_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event <span className="text-red-500">*</span>
                </label>
                <select
                  name="event_id"
                  value={formData.event_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Event</option>
                  {mockEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Manager <span className="text-red-500">*</span>
                </label>
                <select
                  name="created_by"
                  value={formData.created_by}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Manager</option>
                  {mockUsers
                    .filter(user => user.role === 'team_manager')
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  {currentTeam ? 'Update' : 'Add'} Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Members Modal */}
      {showTeamMembersModal && currentTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {currentTeam.team_name} - Team Members
              </h3>
              <button
                onClick={closeTeamMembersModal}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Event: <span className="font-medium text-gray-700">{currentTeam.event_name}</span>
              </p>
              <p className="text-sm text-gray-500">
                Manager: <span className="font-medium text-gray-700">{currentTeam.creator_name}</span>
              </p>
            </div>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Name
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTeam.members && currentTeam.members.length > 0 ? (
                    currentTeam.members.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{member.name}</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-4 text-center text-gray-500">
                        No members in this team
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeTeamMembersModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeams;