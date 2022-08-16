import UserModel from "../models/user-model.js";
export const algorithm = async (req, res) => {
  const loggedUser = req.userName;
  const loggedUserID = req.userId;
  // const loggedUser = "luna"
  try {
    // const loggedUserLocation = await UserModel.findById("62d66d3e1b998708e7b7c207");
    const loggedUserLocation = await UserModel.findById(loggedUserID);
    console.log(loggedUserLocation)
    const bottomLeft = loggedUserLocation.location.bottomLeft;
    const topRight = loggedUserLocation.location.topRight;

    console.log("LAT bottomLeft", bottomLeft[0])
    console.log("LAT topRight", topRight[0])
    console.log("LON bottomLeft", bottomLeft[1])
    console.log("LON topRight", topRight[1])

    // erklärung rectangle-intersection: https://silentmatt.com/rectangle-intersection/

    const allUsers = await UserModel.find(
      {
        username: { $nin: [loggedUser] },
        $and: [
          // LAT (=South North)                     
          { "location.bottomLeft.0": { $lte: topRight[0] } }, { "location.topRight.0": { $gte: bottomLeft[0] } },
          // LON (=West East)
          { "location.bottomLeft.1": { $lte: topRight[1] } }, { "location.topRight.1": { $gte: bottomLeft[1] } }
        ],
      }
    );

    console.log("new alogrithm: users found", allUsers.length)
    res.send(allUsers);
  } catch (err) {
    console.log(err);
  }
};

// learning: lat / lon in Array zu schreiben war verkomplizierung die nichts bringt!
// für Test Algorithm "compareAlgorithms" in auth-routes einkommentieren

export const compareAlgorithms = async (req, res) => {
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
        let i = user.location.bottomLeft[0]; i <= user.location.topRight[0]; i += 0.001) {
        if (i > bottomLeft[0] && i < topRight[0]) {
          firstMatch = true;
        }
      }
      if (firstMatch) {
        for (let i = user.location.bottomLeft[1]; i <= user.location.topRight[1]; i += 0.001) {
        if (i > bottomLeft[1] && i < topRight[1]) {
            secMatch = true;
          }
        }
      }

      if (firstMatch && secMatch) return user;
      console.log(user)
      return;
    });
    res.send(matchedUsers);
  } catch (err) {
    console.log(err);
  }
}
