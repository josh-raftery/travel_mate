import { selectItineraries, updateItinerary } from "../models/itinerariesModel";

export default async function updateItineraryUsernames(oldUsername:any, newUsername:any){
    try{
        const itineraries = await(selectItineraries({username: oldUsername}))
        console.log(itineraries, ' itineraries')
        const updatedItineraries = itineraries.map((itinerary) => {
            itinerary.username = newUsername
            return itinerary
        })
        const updateItineraryPromises= updatedItineraries.map(newItinerary  => {
            const {itinerary_id} = newItinerary
            return updateItinerary(itinerary_id, newItinerary)
        })

        Promise.all(updateItineraryPromises)
    }
    catch(err){
        console.log(err, ' update itinerary utils')
    }
}