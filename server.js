import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/roblox-user", async (req, res) => {
  const { username } = req.body;

  try {
    const responseUserId = await axios.post(
      "https://users.roblox.com/v1/usernames/users",
      {
        usernames: [username],
        excludeBannedUsers: true
      }
    );

    if (!responseUserId.data.data.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = responseUserId.data.data[0].id;

    const userInfo = await axios.get(
      `https://users.roblox.com/v1/users/${userId}`
    );

    const avatar = await axios.get(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`
    );

    res.json({
      id: userId,
      username,
      display: userInfo.data.displayName,
      avatar: avatar.data.data[0].imageUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching Roblox user" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});