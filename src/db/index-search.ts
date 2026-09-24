import { indexSearchDocuments } from "../lib/search";

indexSearchDocuments()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
