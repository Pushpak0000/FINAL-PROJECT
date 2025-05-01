import User from '../models/User.model.js'
import jwt from 'jsonwebtoken';



const generateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error while genreate tokens:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async(req, res) =>{
  try {
    const { userName, email, password } = req.body;

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create a new user
    const newUser = new User({
      userName,
      email,
      password, // The password will be hashed in the User model before saving
    });

    // ✅ Save user to database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export const login = async(req,res) =>{
  try {
    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ Compare entered password with stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    };

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        user: loggedInUser,
        accessToken,
        refreshToken,
        message: "User logged In Successfully",
      });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export const logout = async (req,res) =>{
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    // console.log("Logging out user:", req.user._id);

    await User.findByIdAndUpdate(
      req.user._id,
      { $set: { refreshToken: null } }, // Use `null` instead of `undefined` for DB consistency
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None", // Required for cross-origin cookies
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out successfully" });

  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

export const getProfile = async (req, res) => {
  try {
    // ✅ Ensure user exists
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // ✅ Return user profile
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const refereshAccessToken = async (req,res) =>{
  const incomingRefereshToken = req.cookies.refreshToken || req.body.refreshToken;

  if(!incomingRefereshToken){
    return res.status(401)
    .json({message:'Unauthorized request'});
  }

  try {
    const decodedToken = jwt.verify(incomingRefereshToken, process.env.REFRESH_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken?._id);
    if(!user){
      return res.status(401)
      .json({message:'Invalid Referesh Token'});
    }
  
    if(incomingRefereshToken !== user?.refreshToken){
      return res.status(401)
      .json({message:'Refresh Token Invalid oe used'});
    }
  
    const options = {
      httpOnly:true,
      secure:true,
      sameSite: "None"
    }
  
    const { accessToken, refreshToken } =  await generateAccessAndRefereshToken(user._id);

    // Update refreshToken in the database
    user.refreshToken = refreshToken;
    await user.save();
  
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refereshToken", refreshToken, options)
    .json({accessToken, refreshToken, message:'Access Token Refreshed'});
  } catch (error) {
    console.log('Error while again generet refreshed Token: ',error.message);
    return res.status(500).json({message:'Internal servr error'});
    
  }
}
