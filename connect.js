import { connect } from "mongoose";

async function connectToMongoDB(url) {
  return connect(url);
}

export { connectToMongoDB };
