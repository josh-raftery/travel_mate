export default interface Transportation {
    itinerary_id: number;
    transportation_type: string;
    start_destination: string;
    leaving_date: string;
    leaving_time: string;
    end_destination: string;
    arrival_date: string;
    arrival_time: string;
    transportation_order: number;
    cost: number;
    currency: string;
}