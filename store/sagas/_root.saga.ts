import { all } from "redux-saga/effects";

export default function* rootSaga(): Generator<any, void, any> {
  yield all([
    // Add other sagas here as needed
  ]);
}
