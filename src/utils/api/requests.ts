import { BookReqArg, LaunchesGetTypes, LaunchType } from "@store/launches/launchesTypes";

const launchesEndpoint = "https://api.spacexdata.com/v4/launches/";

export const getLaunchesRequest = async (type: LaunchesGetTypes): Promise<LaunchType[]> => {
  const request = await fetch(`${launchesEndpoint}${type}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return request.json();
};

export const bookLaunchRequest = async (arg: BookReqArg): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
};

export const getLaunchRequest = async (id: string): Promise<LaunchType> => {
  const request = await fetch(`${launchesEndpoint}${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return request.json();
};
