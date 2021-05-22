import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { getAllUser } from "../../utility/httpService";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";

const User = () => {
  const router = useHistory();
  const [row, setRow] = useState([]);
  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 100 },
    { field: "email", headerName: "Email", width: 130 },
    { field: "enabled", headerName: "Verified", width: 130 },
    {
        field: "userImage",
        headerName: "Image",
        width: 100,
        renderCell: (params) => (
          <img src={params.value} alt="user avatar" width="45" />
        ),
      },
    {
      field: "",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <strong>
          {/* <span class={`p-2 badge badge-${params.row.statusColor}`}>
              {params.row.status}
            </span> */}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => onViewOrder(params.row)}
          >
            View Order
          </Button>
        </strong>
      ),
    },
  ]);

  const onViewOrder = () => {};

  useEffect(() => {
    getAllUser()
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          let array = res.data.data.map((m, i) => {
            return {
              sNo: i + 1,
              ...m,
            };
          });
          setRow(array);
        } else {
          swal({
            title: res.data.message,
            timer: 2500,
            icon: "error",
          });
        }
      })
      .catch((e) => console.log(e));
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div style={{ height: 500, width: "100%", background: "white" }}>
            <DataGrid rows={row} columns={colomn} pageSize={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
