import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Container, Row, Col } from "react-bootstrap";
import { Input } from "reactstrap";
import { useHistory } from "react-router-dom";
import { deleteCoupon, getCoupons, addCoupon } from "../../utility/httpService";
import swal from "sweetalert";

const Coupon = () => {
  const [title, setTitle] = useState("Add Coupon");
  const [isEdit, setIdEdit] = useState(false);

  const [row, setRow] = useState([]);
  const [data, setData] = useState({
    id: "",
    title: "",
    code: "",
    startingDate: "",
    percentageOff: "",
    expiryDate: "",
    expired: "",
  });

  const router = useHistory();

  const handleChange = (event) => {
    setData({ ...data, active: !data.active });
  };
  const onChange = (e) => {
    setData({ ...data, categoryName: e.target.value });
  };

  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "title", headerName: "Title", width: 130 },
    { field: "code", headerName: "Code", width: 130 },
    { field: "percentageOff", headerName: "Discount %", width: 130 },
    { field: "startingDate", headerName: "Start date", width: 130 },
    { field: "expiryDate", headerName: "Expiry date", width: 130 },
    { field: "expired", headerName: "Status", width: 100 },

    {
      field: "",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <strong>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => onClickEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => onClickRemove(params.row)}
          >
            Remove
          </Button>
        </strong>
      ),
    },
  ]);

  useEffect(() => {
    getCoupons().then((res) => {
      if (res.data.statusCode == 1) {
        let array = res.data.data.map((m, i) => {
          let obj = {
            sNo: i + 1,
            ...m,
            expired: m.expired ? "Expired" : "Active",
          };
          return obj;
        });

        console.log(array);
        setRow(array);
      }
    });
  }, []);

  const onClickEdit = (value) => {
    console.log(value);
    router.push("coupon-add?id=" + value.id);
  };

  const onClickRemove = (value) => {
    deleteCoupon(value.id).then((res) => {
      if (res && res.data.statusCode == 1) {
        swal({
          title: "Remove successfully!",
          timer: 2000,
          icon: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        swal({
          title: res.data.message,
          timer: 3000,
          icon: "error",
        });
      }
    });
  };

  const addCategory = () => {
    addCoupon(data)
      .then((res) => {
        if (res && res.data.statuseCode == 1) {
          swal({
            title: res.data.message,
            timer: 2000,
            icon: "success",
          });
        } else {
          swal({
            title: res.data.message,
            timer: 2000,
            icon: "success",
          });
        }
      })
      .catch((e) => console.log(e));
  };
  return (
    <Container>
      {/* <Row className="row mb-3 shadow">
        <Col lg={6} md={6} sm={12} xs={12}>
          <Input
            id="standard-basic"
            label="Parent category"
            onChange={onChange}
            value={data.categoryName}
            name="categoryName"
          />
          <Checkbox
            className="mt-3"
            checked={data.active}
            onChange={handleChange}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <Button variant="contained" color="primary" onClick={addCategory}>
            {isEdit ? "Edit Parent Category" : "Add Parent Category"}
          </Button>
        </Col>
      </Row> */}

      <div style={{ height: 500, width: "100%", background: "white" }}>
        <DataGrid rows={row} columns={colomn} pageSize={10} />
      </div>
    </Container>
  );
};
export default Coupon;
