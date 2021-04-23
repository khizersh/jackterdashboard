import React, { useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import { Container, Row, Col, Form } from "react-bootstrap";
import { DropzoneArea } from "material-ui-dropzone";
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
  const [data, setData] = useState({
    id: null,
    parentId: null,
    categoryName: "",
    active: true,
  });
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);

  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "categoryName", headerName: "Category", width: 200 },
    { field: "parentCategory", headerName: "Parent Category", width: 200 },
    {
      field: "image",
      headerName: "Image",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="art image"
          width="45"
          className="img-fluid"
        />
      ),
    },
    {
      field: "banner",
      headerName: "Banner",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="art image"
          width="45"
          className="img-fluid"
        />
      ),
    },
    { field: "active", headerName: "Active", width: 130 },
    {
      field: "",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <strong>
          <Button
            color="primary"
            size="sm"
            style={{ marginLeft: 16 }}
            onClick={() => onClickEdit(params.row)}
          >
            Edit
          </Button>
          <Button
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
        swal({
          title: "Remove succesfully!",
          timer: 2500,
          icon: "success",
        }).then((r) => {
          window.location.reload();
        });
      }
    });
  };

  const onClickImage = (e) => {
    setImage(e[0]);
  };
  const onClickBanner = (e) => {
    setBanner(e[0]);
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

    var form = new FormData();
    form.append("category", JSON.stringify(data));
    form.append("image", image);
    form.append("banner", banner);
    if (isEdit) {
      editChildCategory(form).then((res) => {
        console.log(res);
        if (res && res.data && res.data.statusCode == 1) {
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
      if (!data.parentId || !image || !banner) {
        return swal({
          title: "Select all fields!",
          icon: "error",
          timer: 3000,
        });
      }
      console.log(data);
      addChildCategory(form).then((res) => {
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
              image:
                m.image &&
                "data:" + m.image.type + ";base64," + m.image.picByte,
              banner:
                m.banner &&
                "data:" + m.banner.type + ";base64," + m.banner.picByte,
            };
            return obj;
          });
          console.log("array: ", array);
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
        <Col lg={6} md={6} sm={12}>
          <DropzoneArea
            acceptedFiles={["image/*", "application/*"]}
            onChange={onClickImage}
            showFileNames
            dropzoneText="Drag Image here."
            showAlerts={false}
            filesLimit={1}
          />
        </Col>
        <Col lg={6} md={6} sm={12}>
          <DropzoneArea
            acceptedFiles={["image/*", "application/*"]}
            onChange={onClickBanner}
            showFileNames
            dropzoneText="Drag Banner here."
            showAlerts={false}
            filesLimit={1}
          />
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
