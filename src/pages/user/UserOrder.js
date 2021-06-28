import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Button from "@material-ui/core/Button";
import { getOrderByUserId } from "../../utility/httpService";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

const UserOrder = () => {
  const router = useHistory();
  const [row, setRow] = useState([]);
  const { id } = useParams();
  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "orderDate", headerName: "Order Date", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "fullName", headerName: "Name", width: 130 },
    { field: "couponAmount", headerName: "Coupon", width: 130 },
    { field: "totalAmount", headerName: "Total Amount", width: 130 },
    { field: "netAmount", headerName: "Net Amount", width: 130 },
    {
      field: "orderStatus",
      headerName: "Order status",
      width: 100,
      renderCell: (params) => (
        <span className={`p-2 badge badge-${params.value.split("-")[1]}`}>
          {params.value.split("-")[0]}
        </span>
      ),
    },
    {
      field: "shipStatus",
      headerName: "Shipment status",
      width: 100,
      renderCell: (params) => (
        <span className={`p-2 badge badge-${params.value.split("-")[1]}`}>
          {params.value.split("-")[0]}
        </span>
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
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => onViewDetail(params.row)}
          >
            Detail
          </Button>
        </strong>
      ),
    },
  ]);
  const onViewDetail = (data) => {
    router.push("/order-detail/" + data.checkoutId);
  };

  function returnStatus(status) {
    let statusColor = "danger";
    if (status) {
      if (status == "Pending") {
        statusColor = "danger";
      }
      if (status == "Unpaid") {
        statusColor = "danger";
      }
      if (status == "Paid") {
        statusColor = "success";
      }
      if (status == "Shipped") {
        statusColor = "info";
      }
      if (status == "Arrived") {
        statusColor = "success";
      }
    }
    return statusColor;
  }

  useEffect(() => {
    if (id) {
      getOrderByUserId(id)
        .then((res) => {
          if (res?.data?.statusCode == 1) {
            let array = res.data.data.map((m, i) => {
              let orderColor = returnStatus(m.orderStatus);
              let shipStatus = returnStatus(m.shipStatus);
              return {
                ...m,
                id: i,
                sNo: i + 1,
                orderStatus: m.orderStatus + "-" + orderColor,
                shipStatus: m.shipStatus + "-" + shipStatus,
              };
            });
            setRow(array);
          } else {
            swal({ title: res.data.message, icon: "error", timer: 2500 });
          }
        })
        .catch((e) => console.log(e));
    }
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

export default UserOrder;
