// In kM
const getDistanceFromLatLon = (p1,p2) => {
    const lat1 = p1.split(",")[0];
    const lon1 = p1.split(",")[1];
    const lat2 = p2.split(",")[0];
    const lon2 = p2.split(",")[1];
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return Math.round(d * 1000);
}
  
const deg2rad = (deg) => {
    return deg * (Math.PI/180)
}

const withDistance = (driverLoc, passengerPos) => {    
    let distance = null;
    if (driverLoc && passengerPos) {
        distance = getDistanceFromLatLon(driverLoc, passengerPos);
    }
    return distance
}

module.exports = withDistance