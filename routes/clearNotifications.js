import userModal from "../models/user-model.js";

export const clearNotifications = async (req, res) => {
  const myUser = await userModal.findOneAndUpdate(
    { username: req.body.username },
    {
      notifications: [],
    }
  );
  res.json({ msg: "Notifications cleared" });
};
