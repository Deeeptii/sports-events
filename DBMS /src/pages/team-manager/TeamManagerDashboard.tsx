import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Medal, CheckCircle, CreditCard, TrendingUp } from 'lucide-react';
import { mockTeams, mockTeamMembers, mockUsers, mockRegistrations, mockEvents, mockResults } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';

const TeamManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalMembers: 0,
    registeredEvents: 0,
    completedEvents: 0,
  });
  const [teams, setTeams] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Get manager's teams
      const managerTeams = mockTeams.filter(team => team.created_by === user.id);
      
      if (managerTeams.length > 0) {
        // Get team IDs
        const teamIds = managerTeams.map(team => team.id);
        
        // Get team members
        const membersCount = mockTeamMembers.filter(member => 
          teamIds.includes(member.team_id)
        ).length;
        
        // Get team registrations
        const teamRegistrations = mockRegistrations.filter(reg => 
          reg.team_id && teamIds.includes(reg.team_id)
        );
        
        // Get event details for registrations
        const now = new Date();
        const registeredEvents = teamRegistrations.map(reg => {
          const event = mockEvents.find(e => e.id === reg.event_id);
          const team = managerTeams.find(t => t.id === reg.team_id);
          
          return {
            ...reg,
            event,
            team,
            isCompleted: event && new Date(event.event_date) < now
          };
        });
        
        // Filter upcoming events
        const upcoming = registeredEvents
          .filter(reg => !reg.isCompleted)
          .sort((a, b) => new Date(a.event.event_date).getTime() - new Date(b.event.event_date).getTime());
        
        // Get team results
        const teamResults = mockResults.filter(result => 
          result.team_id && teamIds.includes(result.team_id)
        );
        
        // Enhance team data with members
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
            membersCount: members.length,
            event: teamEvent
          };
        });
        
        setTeams(enhancedTeams);
        setUpcomingEvents(upcoming);
        setStats({
          totalTeams: managerTeams.length,
          totalMembers: membersCount,
          registeredEvents: registeredEvents.length,
          completedEvents: registeredEvents.filter(reg => reg.isCompleted).length
        });
      }
      
      setIsLoading(false);
    }, 800);
    
  }, [user]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">
          Manage your teams, track event registrations, and view team performance from your dashboard.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-orange-100 p-3 mr-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Registered Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.registeredEvents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Medal className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedEvents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">My Teams</h3>
          <Link 
            to="/team-manager/teams" 
            className="text-sm text-orange-600 hover:text-orange-800 font-medium"
          >
            View All
          </Link>
        </div>
        
        {teams.length > 0 ? (
          <div className="space-y-4">
            {teams.slice(0, 3).map((team) => (
              <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">{team.team_name}</h4>
                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Event: {team.event?.name || 'Not assigned'}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{team.membersCount} members</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <Link
                      to={`/team-manager/teams/${team.id}`}
                      className="inline-block px-3 py-1 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition"
                    >
                      Manage Team
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 mb-4">You haven't created any teams yet</p>
            <Link
              to="/team-manager/teams/create"
              className="inline-block px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
            >
              Create a Team
            </Link>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Team Events</h3>
        
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.slice(0, 3).map((registration) => (
              <div key={registration.id} className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-orange-50 md:w-1/3 flex flex-col justify-center items-center">
                  <p className="text-sm text-gray-500">Event Date</p>
                  <p className="text-lg font-bold text-gray-900">{formatDate(registration.event.event_date)}</p>
                  <p className="text-sm text-orange-600 mt-1">{registration.team.team_name}</p>
                </div>
                <div className="p-4 md:w-2/3">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{registration.event.name}</h4>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    <span>Registration Status: {registration.registration_status}</span>
                  </div>
                  <Link
                    to={`/events/${registration.event.id}`}
                    className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                  >
                    View Event Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No upcoming team events found</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/team-manager/teams/create"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <Users className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-gray-800 font-medium">Create Team</span>
          </Link>
          <Link
            to="/"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <Calendar className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-gray-800 font-medium">Browse Events</span>
          </Link>
          <Link
            to="/team-manager/events"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <CreditCard className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-gray-800 font-medium">Registrations</span>
          </Link>
          <Link
            to="/team-manager/results"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <Medal className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-gray-800 font-medium">Team Results</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeamManagerDashboard;