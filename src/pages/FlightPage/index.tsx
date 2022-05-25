import Suspense from "@components/suspense";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getLaunchActionRequest } from "@store/launches/launchesActions";
import { RootState } from "@store/store";
import convertDate from "@utils/convertDate";
import classNames from "classnames/bind";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

export default function CardPage(): React.ReactElement {
  const { loader, singleFlight } = useSelector((state: RootState) => state.launches);
  const { id } = useParams();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (id) dispatch(getLaunchActionRequest(id));
  }, [dispatch, id]);

  return (
    <div className={cnb("tableWrapper")}>
      {!singleFlight || loader.includes("single") ? (
        <div>
          <Suspense />
        </div>
      ) : (
        <TableContainer component={Paper} className={cnb("table")}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align='center'>Flight details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align='left'>{singleFlight.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Details</TableCell>
                <TableCell align='left'>{singleFlight?.details ?? ""}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align='left'>{convertDate(singleFlight.date_utc)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Wikipedia</TableCell>
                <TableCell align='left'>
                  {singleFlight.links.wikipedia && (
                    <Link href={singleFlight.links.wikipedia}>{singleFlight.links.wikipedia}</Link>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Patch</TableCell>
                <TableCell align='center'>
                  {singleFlight.links.patch.small && (
                    <img src={singleFlight.links.patch.small} alt='patch' />
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
