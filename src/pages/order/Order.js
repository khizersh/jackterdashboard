import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Button from "@material-ui/core/Button";
import { getAllCheckout } from "../../utility/httpService";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

const Order = () => {
  const router = useHistory();
  const [row, setRow] = useState([]);
  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "orderDate", headerName: "Order Date", width: 150 },
    { field: "coupon", headerName: "Coupon Applied", width: 100 },
    { field: "couponTitle", headerName: "Coupon Title", width: 130 },
    { field: "couponAmount", headerName: "Coupon Amount", width: 130 },
    { field: "totalAmount", headerName: "Total Amount", width: 130 },
    { field: "netAmount", headerName: "Net Amount", width: 130 },
    { field: "shipmentDate", headerName: "Shipment Date", width: 130 },
    // { field: "status", headerName: "Status", width: 130 },
    {
      field: "status",
      headerName: "Status",
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
    router.push("/order-detail/" + data.id);
  };

  useEffect(() => {
    getAllCheckout()
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          let array = res.data.data.map((m, i) => {
            let statusColor = "danger";
            if (m.status) {
              if (m.status == "Unpaid") {
                statusColor = "danger";
              }
              if (m.status == "Paid") {
                statusColor = "primary";
              }
              if (m.status == "Shipped") {
                statusColor = "info";
              }
              if (m.status == "Arrived") {
                statusColor = "success";
              }
            }
            return {
              sNo: i + 1,
              ...m,
              couponAmount: m.couponAmount || "-",
              couponTitle: m.couponTitle || "-",
              orderDate: m.orderDate || "-",
              shipmentDate: m.shipmentDate || "-",
              status: m.status + "-" + statusColor || "Unpaid-secondary",
            };
          });
          setRow(array);
        } else {
          swal({
            title: res.data.message,
            icon: "error",
            timer: 2500,
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

export default Order;
