import data from "../data";
import seed from "./seed";
import db from "../connection"

const runSeed = () => {
    return seed(data).then(() => db.end());
}

runSeed()