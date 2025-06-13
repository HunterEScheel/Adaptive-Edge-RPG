export const updateGlobalState = (payload: any) => {
  return {
    type: "UPDATE_GLOBAL_STATE",
    payload,
  };
};
export const FETCH_PRESETS = "FETCH_PRESETS";
export const SAVE_PRESET = "SAVE_PRESET";
export const DELETE_PRESET = "DELETE_PRESET";
export const LOAD_PRESET = "LOAD_PRESET";
