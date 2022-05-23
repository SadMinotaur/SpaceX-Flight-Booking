import { BookReqArg, LaunchesGetTypes, LaunchType } from "@store/launches/launchesTypes";

export const getLaunchesRequest = async (type: LaunchesGetTypes): Promise<LaunchType[]> => {
  const request = await fetch(`https://api.spacexdata.com/v4/launches/${type}`, {
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
