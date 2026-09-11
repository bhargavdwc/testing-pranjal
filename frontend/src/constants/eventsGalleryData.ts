const event1 = '/events/Pranjal-Sarkar-Delivering-Session-01.webp';
const event2 = '/events/Pranjal-Sarkar-Delivering-Session-02.webp';
const event3 = '/events/Pranjal-Sarkar-Delivering-Session-03.webp';
const event4 = '/events/Pranjal-Sarkar-Delivering-Session-04.webp';
const event5 = '/events/Pranjal-Sarkar-Delivering-Session-05.webp';
const event6 = '/events/Pranjal-Sarkar-Delivering-Session-06.webp';
const event7 = '/events/Pranjal-Sarkar-Delivering-Session-07.webp';
const event8 = '/events/Pranjal-Sarkar-Delivering-Session-08.webp';
const event9 = '/events/Pranjal-Sarkar-Delivering-Session-09.webp';
const event10 = '/events/Pranjal-Sarkar-Delivering-Session-10.webp';
const event12 = '/events/Pranjal-Sarkar-Delivering-Session-11.webp';
const event13 = '/events/Pranjal-Sarkar-Delivering-Session-12.webp';
const event14 = '/events/Pranjal-Sarkar-Delivering-Session-13.webp';
const event15 = '/events/Pranjal-Sarkar-Delivering-Session-14.webp';

export interface EventImage {
  src: string;
  title: string;
  location: string;
  date: string;
  tag: 'Keynote' | 'Workshop' | 'Panel' | 'Bootcamp';
}

export const EVENT_IMAGES: EventImage[] = [
  {
    src: event1,
    title: 'AI Product Management Keynote',
    location: 'San Francisco, CA',
    date: 'July 2025',
    tag: 'Keynote',
  },
  {
    src: event2,
    title: 'Strategic Leadership Mindset Lecture',
    location: 'New York City, NY',
    date: 'July 2025',
    tag: 'Keynote',
  },
  {
    src: event3,
    title: 'Scaling ARR & Product Growth Panel',
    location: 'Chicago, IL',
    date: 'July 2025',
    tag: 'Panel',
  },
  {
    src: event4,
    title: 'Interactive Product Leadership Studio',
    location: 'Austin, TX',
    date: 'July 2025',
    tag: 'Workshop',
  },
  {
    src: event5,
    title: 'Differentiating AI Capabilities Workshop',
    location: 'Seattle, WA',
    date: 'July 2025',
    tag: 'Workshop',
  },
  {
    src: event6,
    title: 'Fostering Innovation Fireside Chat',
    location: 'Boston, MA',
    date: 'July 2025',
    tag: 'Panel',
  },
  {
    src: event7,
    title: 'Enterprise Strategy Roundtable',
    location: 'London, UK',
    date: 'July 2025',
    tag: 'Panel',
  },
  {
    src: event8,
    title: 'Navigating Startup Metrics & Growth Talk',
    location: 'Toronto, ON',
    date: 'July 2025',
    tag: 'Keynote',
  },
  {
    src: event9,
    title: 'Building Critical PM Judgment Session',
    location: 'Singapore',
    date: 'July 2025',
    tag: 'Workshop',
  },
  {
    src: event10,
    title: 'Product Vision Alignment Intensive',
    location: 'Bengaluru, India',
    date: 'November 2025',
    tag: 'Bootcamp',
  },
  {
    src: event12,
    title: 'Product Leadership Circle Meetup',
    location: 'Hyderabad, India',
    date: 'November 2025',
    tag: 'Panel',
  },
  {
    src: event13,
    title: 'Startups Ecosystem Scaling Session',
    location: 'New Delhi, India',
    date: 'November 2025',
    tag: 'Panel',
  },
  {
    src: event14,
    title: 'Product Strategy & ARR Execution Workshop',
    location: 'Pune, India',
    date: 'November 2025',
    tag: 'Workshop',
  },
  {
    src: event15,
    title: 'AI Product Leadership Studio Guest Lecture',
    location: 'Chennai, India',
    date: 'November 2025',
    tag: 'Keynote',
  },
];
