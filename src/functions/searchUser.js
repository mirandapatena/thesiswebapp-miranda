export default function searchUser(search){
    return function(x){
        var name = x.firstName + '' + x.lastName;
        return name.toLowerCase().includes(search.toLowerCase()) || !search;
    }
}