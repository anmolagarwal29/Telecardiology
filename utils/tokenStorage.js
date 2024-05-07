import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN_DIR = path.join(__dirname, "..", "tokens");
const TOKEN_PATH = path.join(TOKEN_DIR, "refreshToken.json");

// Ensure the directory exists
if (!fs.existsSync(TOKEN_DIR)) {
  fs.mkdirSync(TOKEN_DIR, { recursive: true });
}

export const getStoredRefreshToken = () => {
  try {
    if (!fs.existsSync(TOKEN_PATH)) {
      console.log("Token file does not exist.");
      return null;
    }
    const fileContent = fs.readFileSync(TOKEN_PATH, { encoding: "utf-8" });
    const tokenData = JSON.parse(fileContent);
    return tokenData.refreshToken;
  } catch (err) {
    console.error("Error reading the refresh token from file:", err);
    return null;
  }
};

export const saveNewTokens = (tokens) => {
  try {
    const tokenData = { refreshToken: tokens.refresh_token };
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData), {
      encoding: "utf-8",
    });
    console.log("Refresh token saved to file system.");
  } catch (err) {
    console.error("Error saving the refresh token to file:", err);
  }
};
