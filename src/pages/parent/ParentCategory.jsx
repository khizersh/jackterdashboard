import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Container, Row, Col } from "react-bootstrap";
import { Input } from "reactstrap";
import {
  addParentCategory,
  editParentCategory,
  getParentCategory,
  deleteParentCategory,
} from "../../utility/httpService";
import swal from "sweetalert";

const ParentCategory = () => {
  const [title, setTitle] = useState("Add Parent Category");
  const [isEdit, setIdEdit] = useState(false);

  const [row, setRow] = useState([]);
  const [data, setData] = useState({
    id: "",
    categoryName: "",
    active: true,
  });

  const handleChange = (event) => {
    setData({ ...data, active: !data.active });
  };
  const onChange = (e) => {
    setData({ ...data, categoryName: e.target.value });
  };

  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },

    { field: "categoryName", headerName: "Parent Category", width: 200 },
    { field: "active", headerName: "Active", width: 130 },
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
    getParentCategory().then((res) => {
      if (res.data.statusCode == 1) {
        let array = res.data.data.map((m, i) => {
          let obj = {
            ...m,
            sNo: i + 1,
          };
          return obj;
        });

     
        setRow(array);
      }

    });
  }, []);

  const onClickEdit = (value) => {
    setIdEdit(true);
    setTitle("Edit Parent category");

    setData({
      id: value.id,
      categoryName: value.categoryName,
      active: value.active,
    });
  };
  const onClickRemove = (value) => {
    deleteParentCategory(value.id).then((res) => {
      if (res && res.status == 200) {
        swal({
          title: "Remove successfully!",
          timer: 2000,
          icon: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        // setRow(filterArray);
      } else {
        swal({
          title: "Cannot be deleted!",
          timer: 3000,
          icon: "error",
        });
      }
    });
  };

  const addCategory = () => {
    if (isEdit) {
      editParentCategory(data.id, data).then((res) => {
        if (res.status == 200) {
          let array = row.map((r) => {
            let obj = {};
            if (r.id == data.id) {
              obj = {
                ...r,
                categoryName: data.categoryName,
                active: data.active,
              };
              return obj;
            } else {
              return r;
            }
          });

          swal({
            title: "Edit successfully!",
            timer: 3000,
            icon: "success",
          });
          window.location.reload();
        }
      });
    } else {
      addParentCategory(data).then((res) => {
        if (res.status == 200) {
          swal({
            title: "Add successfully!",
            timer: 3000,
            icon: "success",
          });

          window.location.reload();
        }
      });
    }
  };
  return (
    <Container>
      <Row className="row mb-3 shadow">
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
      </Row>

      <div style={{ height: 500, width: "100%", background: "white" }}>
        <DataGrid rows={row} columns={colomn} pageSize={10} />
      </div>
    </Container>
  );
};
export default ParentCategory;
