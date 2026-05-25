# website for generating random jwt key
<!-- https://dev.to/tkirwa/generate-a-random-jwt-secret-key-39j4 -->

# command for jwt key
<!-- node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"-->
it is using crypto libray and generating random 32 bytes and converting it into string form hexagonal form



# register process
step1 : user send the details in request ie emailid,password,firstName
step2 : validate this fields ie they are present in request.body then validate the emailId and password using validator library
step3 : hash the password using bcrypt library
step4 : store the user into db
step5 : generate a token for user using jwt library and store it in cookie
Note : mark the user role as "user" always becasue it is user register route

# login process
step1 : user send its emailId ,password
step2 : check emailId,password present or not in request.body
step3 : fetch the user data from db using email
step4 : compare the passwords using bcrypt library
step5 : send the token to the user

# userMiddleware : we are using it for validating the token 

step1 : fetch the token from cookies
step2 : check the token is present in cookie or not
step3 : verify the token using jwt.verify(token,key) , it return payload
step4 : fetch the _id from payload so that we can fetch the user from db
step5 : check token is blocked or not using redis db
step6 : if not blocked then store the user data we have fetch into the req.body

# logout process
step1 : validate the user token using userMiddleware
step2 : store the token into redis db and mark it block
step3 : mark the token expire date that we store in redis using redisClient.expireAt , you get the expire date from payload , fetch the payload from jwt.decode(token)
step3 : send the null token value into cookies and expire it instantly


# user register karne me ek problem ye h ki user as a admin bhi register kar sakta h
# hame chahte h ki admin hi admin ko register karwaye
# we create the admin register route separately

# admin middleware 
<!-- same code as user Middleware add this extra line -->
if(payload.role != "admin")
  throw new Error("Invalid Token")


# problem creation steps (storing a dsa problem in database problem schema)
step1 : admin send the data of the problem ie its title ,description,visibleTestCases etc
step2 : before storing the problem into db we have to check it is correct or not ie its code , input,output
step3 : create a submission batch and send it to judge0 its return the tokens for each batch
<!-- submission batch is array of objects {language_id,source_code,stdin,expected_output} -->
step4 : submiting a batch is a two steps process first we submit the batch and its return the token

#  npm i @google/genai

# npm i cloudinary

# flow of video upload
1. frontend request for DigitalSignature from backend getDigitalSignature
2. frontend save to video to cloudinary
3. cloudinary send the meta data of video
4. frontend request to beckend to save the metadata