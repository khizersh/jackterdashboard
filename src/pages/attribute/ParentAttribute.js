import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@material-ui/data-grid";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Container, Row, Col } from "react-bootstrap";
import { Input } from "reactstrap";
import {
  addParentCategory,
  editParentCategory,
  getParentCategory,
  deleteParentCategory,
  getParentAttribute,
  deleteParentAttribute,
  editParentAttribute,
  addParentAttribute,
} from "../../utility/httpService";
import swal from "sweetalert";
import { reloadSetTime } from "../../utility/Service";

const ParentAttribute = () => {
  const [title, setTitle] = useState("Add Parent Category");
  const [isEdit, setIdEdit] = useState(false);

  const [row, setRow] = useState([]);
  const [data, setData] = useState({
    id: "",
    title: "",
    active: true,
  });

  const handleChange = (event) => {
    setData({ ...data, active: !data.active });
  };
  const onChange = (e) => {
    setData({ ...data, title: e.target.value });
  };

  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 300 },
    { field: "title", headerName: "Parent Attribute", width: 300 },
    { field: "active", headerName: "Active", width: 300 },
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

  useEffect(() => {
    getParentAttribute().then((res) => {
      console.log(res.data);
      if (res.data) {
        if (res.data.statusCode == 1) {
          let array = res.data.data.map((m, i) => {
            let obj = {
              ...m,
              active: m.active ? m.active : false,
              sNo: i + 1,
            };
            return obj;
          });
          console.log(array);
          setRow(array);
        }
      }
    }).catch(e => console.log(e))
  }, []);

  const onClickEdit = (value) => {
    setIdEdit(true);
    setTitle("Edit Parent attribute");

    setData({
      id: value.id,
      title: value.title,
      active: value.active,
    });
  };
  const onClickRemove = async (value) => {
    const data = await deleteParentAttribute(value.id);

    if (data && data.data.statusCode == 1) {
      swal({
        title: "Remove successfully!",
        timer: 2000,
        icon: "success",
      });
      reloadSetTime(2.2);
    } else {
      swal({
        title: "Cannot be deleted!",
        timer: 3000,
        icon: "error",
      });
    }
  };

  const addAttribute = () => {
    if (isEdit) {
      editParentAttribute(data.id, data).then((res) => {
        console.log();
        if (res && res.data.statusCode == 1) {
          swal({
            title: "Edit successfully!",
            timer: 3000,
            icon: "success",
          });
          reloadSetTime(2);
        }else{
            swal({
                title: res.data.message,
                timer: 3000,
                icon: "success",
              }); 
        }
      }).catch(e => console.log(e))
    } else {
      addParentAttribute(data).then((res) => {
        console.log("add: ", res.data);
        if (res.data.statusCode == 1) {
          swal({
            title: "Add successfully!",
            timer: 3000,
            icon: "success",
          });

          reloadSetTime(2);
        }
      }).catch(e => console.log(e))
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
            value={data.title}
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
          <Button variant="contained" color="primary" onClick={addAttribute}>
            {isEdit ? "Edit Parent Attribute" : "Add Parent Attribute"}
          </Button>
        </Col>
      </Row>

      <div
        style={{
          height: 500,
          width: "100%",
          background: "white",
          overflowX: "scroll",
        }}
      >
        <DataGrid rows={row} columns={colomn} pageSize={10} />
      </div>
    </Container>
  );
};
export default ParentAttribute;
