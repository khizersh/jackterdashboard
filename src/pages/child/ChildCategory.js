import React, { useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import { Container, Row, Col, Form } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import {
  deleteChildCategory,
  getParentCategory,
  getChildCategory,
  addChildCategory,
  editChildCategory,
} from "../../utility/httpService";
import { DataGrid } from "@material-ui/data-grid";
import swal from "sweetalert";

const ChildCategory = () => {
  const [row, setRow] = useState([]);
  const [parentCateory, setParentCateory] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState({
    id: null,
    parentId: null,
    categoryName: "",
    active: true,
  });

  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "categoryName", headerName: "Category", width: 200 },
    { field: "parentCategory", headerName: "Parent Category", width: 200 },
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
            size="sm"
            style={{ marginLeft: 16 }}
            onClick={() => onClickEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="danger"
            size="sm"
            style={{ marginLeft: 16 }}
            onClick={() => onClickRemove(params.row)}
          >
            Remove
          </Button>
        </strong>
      ),
    },
  ]);

  const onChange = (e) => {
    setData({ ...data, categoryName: e.target.value });
  };

  const handleChange = (event) => {
    setData({ ...data, active: !data.active });
  };
  const onClickEdit = (value) => {
    console.log("edit: ", value);
    setData({
      id: value.id,
      categoryName: value.categoryName,
      parentId: data.parentId,
      active: value.active,
    });
    setIsEdit(true);
  };
  const onClickRemove = (value) => {
    deleteChildCategory(value.id).then((res) => {
      if (res.status == 200) {
        swal({ title: "Remove succesfully!", timer: 2500, icon: "success" });
        setTimeout(() => {
          window.location.reload()
        }, 3000);
      }
    });
  };

  const handleChangeSelect = (e) => {
    setData({ ...data, parentId: e.target.value });
  };
  const addCategory = () => {
    console.log("Data: ", data);
    if (!data.categoryName) {
      return swal({
        title: "Category name is missing!",
        icon: "error",
        timer: 3000,
      });
    }

    if (isEdit) {
      editChildCategory(data.id, data).then((res) => {
        if (res && res.data && res.data.statusCodeValue == 200) {
          swal({
            title: "Edit Successfully!",
            icon: "success",
            timer: 3000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          return swal({
            title: "Select parent category!",
            icon: "error",
            timer: 3000,
          });
        }
      });
    } else {
      if (!data.parentId) {
        return swal({
          title: "Select parent category!",
          icon: "error",
          timer: 3000,
        });
      }
      addChildCategory(data).then((res) => {
        if (res.status == 200) {
          console.log("res: ", res);

          swal({ title: "Add successfully!", icon: "success", timer: 3000 });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      });
    }
  };

  useEffect(() => {
    getChildCategory().then((res) => {
      let array = res.data.map((m, i) => {
        let obj = {
          id: m.id,
          categoryName: m.categoryName,
          parentCategory: m.parentCategory.categoryName
            ? m.parentCategory.categoryName
            : "Not Found",
          active: m.active,
          sNo: i + 1,
        };
        return obj;
      });
      setRow(array);
    });

    getParentCategory().then((res) => {
      setParentCateory(res.data);
    });
  }, []);
  return (
    <Container className="card" fluid>
      <Row>
        <Col lg={3}>
          <TextField
            id="standard-basic"
            label="Enter title"
            onChange={onChange}
            value={data.categoryName}
            name="categoryName"
          />
        </Col>
        <Col lg={3}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select parent category</Form.Label>
            <Form.Control as="select" onChange={handleChangeSelect}>
              <option value="">Select</option>
              {parentCateory.length
                ? parentCateory.map((m, i) => (
                    <option value={m.id}>{m.categoryName}</option>
                  ))
                : ""}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col lg={1}>
          <Form.Label>Enable</Form.Label>
          <Checkbox
            checked={data.active}
            onChange={handleChange}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </Col>
        <Col lg={4}>
          <Button variant="contained" color="primary" onClick={addCategory}>
            {isEdit ? "Edit Category" : "Add Category"}
          </Button>
        </Col>
      </Row>
      <Row>
        <div style={{ height: 500, width: "100%", background: "white" }}>
          <DataGrid rows={row} columns={colomn} pageSize={10} />
        </div>
      </Row>
    </Container>
  );
};

export default ChildCategory;
