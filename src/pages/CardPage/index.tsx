import Suspense from "@components/suspense";
import { getLaunchActionRequest } from "@store/launches/launchesActions";
import { RootState } from "@store/store";
// import convertDate from "@utils/convertDate";
import classNames from "classnames/bind";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styles from "./styles.module.scss";

// const cnb = classNames.bind(styles);

export default function CardPage(): React.ReactElement {
  const { loader, singleFlight } = useSelector((state: RootState) => state.launches);
  const { id } = useParams();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (id) dispatch(getLaunchActionRequest(id));
  }, [dispatch, id]);

  return !singleFlight || loader.includes("single") ? (
    <div>
      <Suspense />
    </div>
  ) : (
    <div>
      {/* {singleFlight.name}
      {singleFlight.details} */}
      {/* {singleFlight.links.wikipedia} */}
      {/* {convertDate(singleFlight.date_utc)} */}
    </div>
  );
}
