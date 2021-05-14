import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import {
  getChildAttribute,
  deleteChildAttribute,
  editChildAttribute,
  getParentAttribute,
  addChildAttribute,
} from "../../utility/httpService";
import { DataGrid } from "@material-ui/data-grid";
import swal from "sweetalert";
import { Input } from "reactstrap";
import { reloadSetTime } from "../../utility/Service";

const ChildAttribute = () => {
  const [row, setRow] = useState([]);
  const [parentAttribute, setParentAttribute] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState({
    id: null,
    parentId: null,
    title: "",
  });

  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "title", headerName: "Attribute", width: 200 },
    { field: "parentName", headerName: "Parent Attribute", width: 200 },
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

  const onChange = (e) => {
    setData({ ...data, title: e.target.value });
  };

  const onClickEdit = (value) => {
    console.log("value: ", value);
    setData({
      id: value.id,
      title: value.title,
      parentId: value.parentId,
    });
    setIsEdit(true);
  };

  const onClickRemove = (value) => {
    deleteChildAttribute(value.id).then((res) => {
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

  const onClick = () => {
    if (!data.title) {
      return swal({
        title: "Attribute name is missing!",
        icon: "error",
        timer: 3000,
      });
    }
    if (!data.parentId) {
        return swal({
          title: "Select parent attribute!",
          icon: "error",
          timer: 3000,
        });
      }
    if (isEdit) {
      editChildAttribute(data.id, data).then((res) => {
        if (res && res.data && res.data.statusCodeValue == 1) {
          swal({
            title: "Edit Successfully!",
            icon: "success",
            timer: 2000,
          });
          reloadSetTime(2);
        } 
      });
    } else {
      addChildAttribute(data).then((res) => {
        if (res.status == 200) {
   
          swal({ title: "Add successfully!", icon: "success", timer: 3000 });
          reloadSetTime(3);
        }
      });
    }
  };

  useEffect(() => {
    getChildAttribute().then((res) => {
      if (res.data.statusCode == 1) {
       
        let array = res.data.data.map((m, i) => {
          let obj = {
            sNo: i + 1,
            id: m.id,
            title: m.title,
            parentName: m.parentAttributes
              ? m.parentAttributes.title
              : "Not Found",
            parentId: m.parentAttributes ? m.parentAttributes.id : null,
          };
          return obj;
        });
        setRow(array);
      }
    });

    getParentAttribute().then((res) => {
      if (res.data.statusCode == 1) {
        setParentAttribute(res.data.data);
      }
    });
  }, []);
  return (
    <Container className="card pt-2" fluid>
      <Row>
        <Col lg={3}>
          <label>Select parent attribute</label>
          <Input
            id="standard-basic"
            label="Enter title"
            onChange={onChange}
            value={data.title}
            name="categoryName"
          />
        </Col>
        <Col lg={3}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select parent attribute</Form.Label>
            <Form.Control as="select" onChange={handleChangeSelect}>
              <option value="">Select</option>
              {parentAttribute.length
                ? parentAttribute.map((m, i) => (
                    <option key={i} value={m.id}>
                      {m.title}
                    </option>
                  ))
                : ""}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col lg={4} className="m-auto">
          <Button variant="contained" color="primary" onClick={onClick}>
            {isEdit ? "Edit Attribute" : "Add Attribute"}
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

export default ChildAttribute;
