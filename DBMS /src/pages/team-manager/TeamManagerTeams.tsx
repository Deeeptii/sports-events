import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Edit, Trash2, Calendar, UserPlus, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockTeams, mockTeamMembers, mockUsers, mockEvents } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';

type Team = {
  id: number;
  team_name: string;
  event_id: number;
  created_by: number;
  event?: any;
  members?: { id: number; name: string }[];
};

const TeamManagerTeams: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    team_name: '',
    event_id: '',
  });
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Get manager's teams
      const managerTeams = mockTeams.filter(team => team.created_by === user.id);
      
      // Enhance team data with members and event
      const enhancedTeams = managerTeams.map(team => {
        const memberIds = mockTeamMembers
          .filter(m => m.team_id === team.id)
          .map(m => m.user_id);
        
        const members = mockUsers
          .filter(user => memberIds.includes(user.id))
          .map(user => ({ id: user.id, name: user.name }));
        
        const teamEvent = mockEvents.find(e => e.id === team.event_id);
        
        return {
          ...team,
          members,
          event: teamEvent
        };
      });
      
      setTeams(enhancedTeams);
      setFilteredTeams(enhancedTeams);
      setIsLoading(false);
    }, 800);
    
  }, [user]);

  useEffect(() => {
    // Filter teams based on search term
    const filtered = teams.filter(
      team => team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              team.event?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    });
    setCurrentTeam(null);
    setShowModal(true);
  };

  const openEditModal = (team: Team) => {
    setFormData({
      team_name: team.team_name,
      event_id: team.event_id.toString(),
    });
    setCurrentTeam(team);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentTeam(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.team_name) {
      toast.error('Please enter a team name');
      return;
    }

    const teamData: Team = {
      id: currentTeam ? currentTeam.id : Math.floor(Math.random() * 1000) + 10,
      team_name: formData.team_name,
      event_id: parseInt(formData.event_id) || 0,
      created_by: user?.id || 0,
    };

    // Add event data if available
    if (formData.event_id) {
      const event = mockEvents.find(e => e.id === parseInt(formData.event_id));
      if (event) {
        teamData.event = event;
      }
    }

    // Keep existing members for edited teams
    if (currentTeam && currentTeam.members) {
      teamData.members = currentTeam.members;
    } else {
      teamData.members = [];
    }

    if (currentTeam) {
      // Update existing team
      setTeams(teams.map(team => (team.id === currentTeam.id ? teamData : team)));
      toast.success('Team updated successfully');
    } else {
      // Add new team
      setTeams([...teams, teamData]);
      toast.success('Team created successfully');
    }

    closeModal();
  };

  const handleDeleteTeam = (teamId: number) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(team => team.id !== teamId));
      toast.success('Team deleted successfully');
    }
  };

  const openMembersModal = (team: Team) => {
    setCurrentTeam(team);
    
    // Get all potential team members (all participants)
    const potentialMembers = mockUsers.filter(user => 
      user.role === 'participant' && 
      (!team.members || !team.members.some(m => m.id === user.id))
    );
    
    setAvailableUsers(potentialMembers);
    setSelectedMembers([]);
    setShowMembersModal(true);
  };

  const closeMembersModal = () => {
    setShowMembersModal(false);
    setCurrentTeam(null);
    setAvailableUsers([]);
    setSelectedMembers([]);
  };

  const toggleMemberSelection = (userId: number) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const addMembers = () => {
    if (!currentTeam || selectedMembers.length === 0) return;
    
    // Get selected users
    const newMembers = mockUsers
      .filter(user => selectedMembers.includes(user.id))
      .map(user => ({ id: user.id, name: user.name }));
    
    // Update team with new members
    const updatedTeam = {
      ...currentTeam,
      members: [...(currentTeam.members || []), ...newMembers]
    };
    
    // Update teams state
    setTeams(teams.map(team => team.id === currentTeam.id ? updatedTeam : team));
    
    toast.success(`${selectedMembers.length} member(s) added to the team`);
    closeMembersModal();
  };

  const removeMember = (teamId: number, memberId: number) => {
    const team = teams.find(t => t.id === teamId);
    if (!team || !team.members) return;
    
    const updatedMembers = team.members.filter(member => member.id !== memberId);
    
    const updatedTeam = {
      ...team,
      members: updatedMembers
    };
    
    setTeams(teams.map(t => t.id === teamId ? updatedTeam : t));
    toast.success('Team member removed');
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not scheduled';
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">My Teams</h2>
          <button
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search teams..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredTeams.length > 0 ? (
          <div className="space-y-4">
            {filteredTeams.map((team) => (
              <div key={team.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="md:flex">
                  <div className="p-4 md:w-1/4 bg-orange-50 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{team.team_name}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {team.event ? team.event.name : 'No event assigned'}
                      </span>
                    </div>
                    {team.event && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(team.event.event_date)}
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:w-3/4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">Team Members ({team.members?.length || 0})</h4>
                      <button
                        onClick={() => openMembersModal(team)}
                        className="flex items-center text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        Add Members
                      </button>
                    </div>
                    
                    {team.members && team.members.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {team.members.map((member) => (
                          <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-gray-700">{member.name}</span>
                            <button
                              onClick={() => removeMember(team.id, member.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm mb-4">
                        No members added to this team yet
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(team)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No teams found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try changing your search criteria" 
                : "You haven't created any teams yet"}
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Team
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {currentTeam ? 'Edit Team' : 'Create New Team'}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event (Optional)
                </label>
                <select
                  name="event_id"
                  value={formData.event_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Event</option>
                  {mockEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} - {formatDate(event.event_date)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  You can assign an event now or later
                </p>
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
                  className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700"
                >
                  {currentTeam ? 'Update' : 'Create'} Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Team Members Modal */}
      {showMembersModal && currentTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Add Members to {currentTeam.team_name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select participants to add to this team:
            </p>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search participants..."
                  className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded-md">
              {availableUsers.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {availableUsers.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleMemberSelection(user.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(user.id)}
                        onChange={() => toggleMemberSelection(user.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-gray-700">{user.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500">
                  No available participants found
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeMembersModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addMembers}
                disabled={selectedMembers.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                Add {selectedMembers.length} Members
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagerTeams;