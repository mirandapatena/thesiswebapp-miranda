export default function searchUser(search){
    return function(x){
        var name = x.incidentID + ' ' + x.incidentLocation + ' ' + x.timeReceived;
        return name.toLowerCase().includes(search.toLowerCase()) || !search;
    }
}