import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { getAllUser } from "../../utility/httpService";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import userLogo from "../../utility/images/user.png";

const User = () => {
  const router = useHistory();
  const [row, setRow] = useState([]);
  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "firstName", headerName: "First Name", width: 200 },
    { field: "lastName", headerName: "Last Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "enabled",
      headerName: "Verified",
      width: 120,
      renderCell: (params) => (
        <span
          className={`badge badge-${params.value ? "success" : "danger"} px-2`}
        >
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },
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
      width: 300,
      renderCell: (params) => (
        <strong>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => onClickCoupon(params.row)}
          >
            Coupon
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => onViewOrder(params.row)}
          >
            Order
          </Button>
        </strong>
      ),
    },
  ]);

  const onViewOrder = (data) => {
    router.push("/user-order/" + data.id);
  };

  const onClickCoupon = (data) => {
    router.push("/user-coupon/" + data.id);
  };

  useEffect(() => {
    getAllUser()
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          let array = res.data.data.map((m, i) => {
            return {
              sNo: i + 1,
              ...m,
              userImage: m.userImage || userLogo,
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
