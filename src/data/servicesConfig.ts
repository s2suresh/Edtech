export interface ServiceCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  targetUrl: string;
  isExternal: boolean;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'education',
    title: 'Education',
    iconName: 'GraduationCap',
    description: 'Learning portal & courses',
    targetUrl: 'https://s2suresh.github.io/Edtech/',
    isExternal: true,
  },
  {
    id: 'agriculture',
    title: 'Agriculture',
    iconName: 'Sprout',
    description: 'Agri-tech solutions',
    targetUrl: '/services/agriculture',
    isExternal: false,
  },
  {
    id: 'drone',
    title: 'Drone',
    iconName: 'Plane',
    description: 'Aerial survey & services',
    targetUrl: '/services/drone',
    isExternal: false,
  },
  {
    id: 'car-rent',
    title: 'Car & Rent',
    iconName: 'Car',
    description: 'Vehicle rentals',
    targetUrl: '/services/car-rent',
    isExternal: false,
  },
  {
    id: 'services',
    title: 'Services',
    iconName: 'Briefcase',
    description: 'On-demand solutions',
    targetUrl: '/services/general',
    isExternal: false,
  },
];
