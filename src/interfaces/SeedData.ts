import Users from '@/interfaces/Users';
import Itineraries from '@/interfaces/Itineraries';
import Transportation from '@/interfaces/Transportation';
import Countries from '@/interfaces/Countries';
import Destinations from '@/interfaces/Destinations';
import Activities from '@/interfaces/Activities';
import Accomodation from './Accomodation';

export default interface SeedData {
    accomodationData: Accomodation[];
    activitiesData: Activities[];
    countriesData: Countries[];
    destinationsData: Destinations[];
    transportationData: Transportation[];
    usersData: Users[];
    itinerariesData: Itineraries[];
}