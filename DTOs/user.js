
class UserDTO {
    constructor(username, email, phone, password, address){
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.address = address;
        this.gender = null;
        this.profile = null;
        this.family = null;
        this.residence = null;
        this.preference = null;
    }

    setUsername(username){
        this.username = username;
    }

    setEmail(email){
        this.email = email;
    }

    setPhone(phone){
        this.phone = phone;
    }

    setPassword(password){
        this.password = password;
    }

    setAddress(address){
        this.setAddress = address;
    }

    setGender(gender){
        this.gender = gender;
    }

    setProfile(profile){
        this.profile = profile;
    }
    
    setFamily(family){
        this.family = family;
    }

    setResidence(residence){
        this.residence = residence;
    }

    setPreference(preference){
        this.preference = preference;
    }
}

module.exports = UserDTO;