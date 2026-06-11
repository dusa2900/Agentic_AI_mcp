import dotenv from "dotenv";
dotenv.config();

import { createBranch }
from "./github.tools";

async function run() {

 const result =
   await createBranch(
     "feature/login-page"
   );

 console.log(result);
}

run();