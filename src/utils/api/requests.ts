// No need for axios

import { LaunchType } from "@store/launches/launchesTypes";
import { LaunchesTypes } from "./requestTypes";

export const getLaunchesRequest = async (type: LaunchesTypes): Promise<LaunchType[]> => {
  const request = await fetch(`https://api.spacexdata.com/v4/launches/${type}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return request.json();
};

export const bookLaunchRequest = async (type: LaunchesTypes): Promise<LaunchType[]> => {
  return [];
};
