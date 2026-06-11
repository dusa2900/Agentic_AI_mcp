import { github } from "./github.service";

async function run() {
  const repos =
    await github.repos.listForAuthenticatedUser();

  console.log(repos.data);
}

run();