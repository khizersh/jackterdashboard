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
  getParentAttribute,
} from "../../utility/httpService";
import { DataGrid } from "@material-ui/data-grid";
import swal from "sweetalert";
import { Input } from "reactstrap";
import Select from "react-select";

const ChildCategory = () => {
  const [row, setRow] = useState([]);
  const [parentCateory, setParentCateory] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [parentAttributeEdit, setParentAttributeEdit] = useState([]);

  const [data, setData] = useState({
    id: null,
    parentId: null,
    categoryName: "",
    active: true,
    attributeList: [],
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
    let obj = [];
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
          window.location.reload();
        }, 3000);
      }
    });
  };

  const handleChangeSelect = (e) => {
    setData({ ...data, parentId: e.target.value });
  };

  const addCategory = () => {
    if (!data.categoryName) {
      return swal({
        title: "Category name is missing!",
        icon: "error",
        timer: 3000,
      });
    }

    if (isEdit) {
      editChildCategory(data.id, data).then((res) => {
        if (res && res.data && res.data.statusCodeValue == 1) {
          swal({
            title: "Edit Successfully!",
            icon: "success",
            timer: 3000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
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
    getChildCategory()
      .then((res) => {
        if (res.data.statusCode == 1) {
      
          let array = res.data.data.map((m, i) => {
            let obj = {
              id: m.id,
              categoryName: m.title,
              parentCategory: m.parentCategoryTitle
                ? m.parentCategoryTitle
                : "Not Found",
              active: m.active,
              sNo: i + 1,
            };
            return obj;
          });
          setRow(array);
        }
      })
      .catch((e) => console.log(e));

    getParentCategory()
      .then((res) => {
        if (res.data.statusCode == 1) {
          setParentCateory(res.data.data);
        }
      })
      .catch((e) => console.log(e));

   
  }, []);
  return (
    <Container className="card" fluid>
      <Row>
        <Col lg={6} md={6} sm={12}>
          <label>Enter title</label>
          <Input
            id="standard-basic"
            label="Enter title"
            onChange={onChange}
            value={data.categoryName}
            name="categoryName"
          />
        </Col>
        <Col lg={6} md={6} sm={12}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select parent category</Form.Label>
            <Form.Control as="select" onChange={handleChangeSelect}>
              <option value="">Select</option>
              {parentCateory.length
                ? parentCateory.map((m, i) => (
                    <option key={i} value={m.id}>
                      {m.categoryName}
                    </option>
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
        <Col lg={4} className="m-auto">
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
