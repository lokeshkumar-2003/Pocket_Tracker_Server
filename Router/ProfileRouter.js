const router = require("express").Router();
const {
  AddProfileController,
  upload,
} = require("../Controller/ProfileControllers/addProfileControllers");
const {
  UpdateProfileController,
  uploadImage,
} = require("../Controller/ProfileControllers/updateProfileControllers");
const GetProfileControllers = require("../Controller/ProfileControllers/getProfileControllers");

router.get("/profile/:userId", GetProfileControllers);

router.post("/profile/:userId", AddProfileController);
router.put("/profile/:userId", UpdateProfileController);

module.exports = router;
