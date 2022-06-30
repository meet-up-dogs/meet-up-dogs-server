import UserModel from "../models/user-model.js";

export const algorithm = async (req, res) => {
  console.log(req.userName);
  const loggedUser = req.userName;
  try {
    const loggedUserLocation = await UserModel.find({
      username: loggedUser,
    });

    const bottomLeft = loggedUserLocation[0].location.bottomLeft;
    const topRight = loggedUserLocation[0].location.topRight;

    const allUsers = await UserModel.find({
      username: { $nin: [loggedUser] },
    });

    const matchedUsers = allUsers.filter((user) => {
      let firstMatch = false;
      let secMatch = false;

      for (
        let i = user.location.bottomLeft[0];
        i <= user.location.topRight[0];
        i += 0.0001
      ) {
        if (i > bottomLeft[0] && i < topRight[0]) {
          firstMatch = true;
        }
      }
      if (firstMatch) {
        for (
          let i = user.location.bottomLeft[1];
          i <= user.location.topRight[1];
          i += 0.0001
        ) {
          if (i > bottomLeft[1] && i < topRight[1]) {
            secMatch = true;
          }
        }
      }

      if (firstMatch && secMatch) return user;
      return;
    });

    console.log(matchedUsers);
    res.send(matchedUsers);
  } catch (err) {
    console.log(err);
  }
};
