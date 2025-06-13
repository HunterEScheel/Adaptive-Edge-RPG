import { all } from "redux-saga/effects";
import { presetSaga } from "./saga.constants";

export default function* rootSaga(): Generator<any, void, any> {
  yield all([
    presetSaga(),
    // Add other sagas here as needed
  ]);
}
