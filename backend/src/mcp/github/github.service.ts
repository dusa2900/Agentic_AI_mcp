import { Octokit } from "@octokit/rest";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from backend directory
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

export const github = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});