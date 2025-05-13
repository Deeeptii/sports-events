// Mock Users
export const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin', phone: '+919876543210', age: 35, gender: 'male' },
  { id: 2, name: 'Event Organizer', email: 'organizer@example.com', password: 'password', role: 'organizer', phone: '+919876543211', age: 32, gender: 'female' },
  { id: 3, name: 'John Participant', email: 'john@example.com', password: 'password', role: 'participant', phone: '+919876543212', age: 25, gender: 'male' },
  { id: 4, name: 'Team Manager 1', email: 'manager1@example.com', password: 'password', role: 'team_manager', phone: '+919876543213', age: 30, gender: 'male' },
  { id: 5, name: 'Sarah Player', email: 'sarah@example.com', password: 'password', role: 'participant', phone: '+919876543214', age: 22, gender: 'female' },
  { id: 6, name: 'Mike Runner', email: 'mike@example.com', password: 'password', role: 'participant', phone: '+919876543215', age: 28, gender: 'male' },
  { id: 7, name: 'Team Manager 2', email: 'manager2@example.com', password: 'password', role: 'team_manager', phone: '+919876543216', age: 35, gender: 'female' }
];

// Events
export const mockEvents = [
  {
    id: 1,
    name: 'Mumbai Summer Marathon 2025',
    event_date: '2025-05-15',
    venue: 'Marine Drive, Mumbai',
    category: 'Running',
    description: 'Join the annual Mumbai marathon and race through the iconic Marine Drive. Open for both professional runners and amateurs. Experience the spirit of Mumbai while running along the Arabian Sea.',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
    status: 'upcoming',
    registration_deadline: '2025-05-01',
    fee: 1500,
    organizer_id: 2
  },
  {
    id: 2,
    name: 'National Basketball Championship',
    event_date: '2025-06-10',
    venue: 'Indira Gandhi Indoor Stadium, Delhi',
    category: 'Basketball',
    description: 'A prestigious 3-day basketball tournament featuring teams from across India. Multiple categories available from juniors to seniors.',
    image: 'https://images.pexels.com/photos/2891884/pexels-photo-2891884.jpeg',
    status: 'upcoming',
    registration_deadline: '2025-05-20',
    fee: 3000,
    organizer_id: 2
  },
  {
    id: 3,
    name: 'Goa Beach Triathlon',
    event_date: '2025-06-05',
    venue: 'Miramar Beach, Panaji, Goa',
    category: 'Triathlon',
    description: 'Challenge yourself in this scenic triathlon that includes swimming in the Arabian Sea, cycling through coastal roads, and running along the beautiful beaches of Goa.',
    image: 'https://images.pexels.com/photos/2524174/pexels-photo-2524174.jpeg',
    status: 'upcoming',
    registration_deadline: '2025-05-15',
    fee: 2500,
    organizer_id: 2
  },
  {
    id: 4,
    name: 'All India Football Tournament',
    event_date: '2025-07-20',
    venue: 'Salt Lake Stadium, Kolkata',
    category: 'Football',
    description: 'Experience the passion of Indian football in this prestigious tournament at the iconic Salt Lake Stadium. Teams from across the country compete for glory.',
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
    status: 'upcoming',
    registration_deadline: '2025-06-30',
    fee: 3500,
    organizer_id: 2
  },
  {
    id: 5,
    name: 'National Tennis Championship',
    event_date: '2025-05-12',
    venue: 'DLTA Complex, New Delhi',
    category: 'Tennis',
    description: 'Compete in India\'s premier tennis tournament featuring singles and doubles categories across different skill levels.',
    image: 'https://images.pexels.com/photos/5730997/pexels-photo-5730997.jpeg',
    status: 'upcoming',
    registration_deadline: '2025-04-30',
    fee: 2000,
    organizer_id: 2
  },
  {
    id: 6,
    name: 'Rishikesh Yoga Festival',
    event_date: '2025-06-25',
    venue: 'Parmarth Niketan, Rishikesh',
    category: 'Wellness',
    description: 'Immerse yourself in a transformative yoga and wellness retreat in the yoga capital of the world. Features expert instructors, meditation sessions, and ancient wellness practices.',
    image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg',
    status: 'upcoming',
    registration_deadline: '2025-06-10',
    fee: 5000,
    organizer_id: 2
  }
];

// Teams
export const mockTeams = [
  {
    id: 1,
    team_name: 'Mumbai Mavericks',
    event_id: 2,
    created_by: 4
  },
  {
    id: 2,
    team_name: 'Delhi Dashers',
    event_id: 1,
    created_by: 7
  },
  {
    id: 3,
    team_name: 'Chennai Challengers',
    event_id: 4,
    created_by: 4
  },
  {
    id: 4,
    team_name: 'Bangalore Blasters',
    event_id: 5,
    created_by: 7
  }
];

// Team Members
export const mockTeamMembers = [
  { team_id: 1, user_id: 4 },
  { team_id: 1, user_id: 3 },
  { team_id: 1, user_id: 6 },
  { team_id: 2, user_id: 7 },
  { team_id: 2, user_id: 5 },
  { team_id: 3, user_id: 4 },
  { team_id: 3, user_id: 3 },
  { team_id: 3, user_id: 6 },
  { team_id: 4, user_id: 7 },
  { team_id: 4, user_id: 5 }
];

// Registrations
export const mockRegistrations = [
  {
    id: 1,
    user_id: 3,
    event_id: 1,
    registration_status: 'confirmed',
    registration_date: '2025-02-10'
  },
  {
    id: 2,
    user_id: 5,
    event_id: 5,
    registration_status: 'confirmed',
    registration_date: '2025-03-15'
  },
  {
    id: 3,
    user_id: 6,
    event_id: 3,
    registration_status: 'pending',
    registration_date: '2025-03-20'
  },
  {
    id: 4,
    team_id: 1,
    event_id: 2,
    registration_status: 'confirmed',
    registration_date: '2025-02-28'
  },
  {
    id: 5,
    team_id: 3,
    event_id: 4,
    registration_status: 'confirmed',
    registration_date: '2025-03-10'
  }
];

// Payments
export const mockPayments = [
  {
    id: 1,
    registration_id: 1,
    amount: 1500,
    payment_status: 'completed',
    payment_date: '2025-02-10'
  },
  {
    id: 2,
    registration_id: 2,
    amount: 2000,
    payment_status: 'completed',
    payment_date: '2025-03-15'
  },
  {
    id: 3,
    registration_id: 4,
    amount: 3000,
    payment_status: 'completed',
    payment_date: '2025-02-28'
  },
  {
    id: 4,
    registration_id: 5,
    amount: 3500,
    payment_status: 'completed',
    payment_date: '2025-03-10'
  },
  {
    id: 5,
    registration_id: 3,
    amount: 2500,
    payment_status: 'pending',
    payment_date: null
  }
];

// Feedback
export const mockFeedback = [
  {
    id: 1,
    user_id: 3,
    event_id: 1,
    rating: 4,
    comments: 'Great organization and atmosphere. Would participate again!'
  },
  {
    id: 2,
    user_id: 5,
    event_id: 5,
    rating: 5,
    comments: 'Excellent tournament with perfect facilities and staff.'
  },
  {
    id: 3,
    user_id: 4,
    event_id: 2,
    rating: 3,
    comments: 'Good event but could use better scheduling between matches.'
  }
];

// Results
export const mockResults = [
  {
    id: 1,
    event_id: 1,
    user_id: 3,
    ranking: 12,
    score: '3:45:22'
  },
  {
    id: 2,
    event_id: 2,
    team_id: 1,
    ranking: 2,
    score: 'Silver Medal'
  },
  {
    id: 3,
    event_id: 4,
    team_id: 3,
    ranking: 1,
    score: 'Gold Medal'
  },
  {
    id: 4,
    event_id: 5,
    user_id: 5,
    ranking: 3,
    score: 'Bronze Medal'
  }
];

// Organizers
export const mockOrganizers = [
  {
    id: 1,
    name: 'Sports Authority of India',
    contact_email: 'info@sportsauthority.in',
    phone: '1800112323',
    permission_level: 'full',
    user_id: 2
  },
  {
    id: 2,
    name: 'Indian Sports Association',
    contact_email: 'association@indiansports.in',
    phone: '1800223434',
    permission_level: 'partial',
    user_id: 2
  }
];