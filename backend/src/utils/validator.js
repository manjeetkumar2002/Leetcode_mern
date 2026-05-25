// we use validator library to validate our fields
const validator =  require("validator")

//  this function validate the email,firstname ,password of the req.body
const validate = (data) =>{
    //step1 : check req.body ie data have all the mandatory fields 

    const mandatoryField = ["firstName","emailId","password"]

    const isAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k))  // Object.keys() return the all the keys in array then every check the k is present in the keys array of data
    // if any key is absent the isAllowed will become false

    if(!isAllowed){
        throw new Error("Some Field Missing")  // catch block handle this 
    }

    if(!validator.isEmail(data.emailId)){
        throw new Error("Invalid EmailId")
    }

    if(!validator.isStrongPassword(data.password)){
        throw new Error("Weak Password")
    }
}

module.exports = validate