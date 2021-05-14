import React, { useEffect, useState } from "react";
import {
  getParentAttribute,
  removeParentAttributeOfProduct,
  updateProductAttribute,
} from "../../utility/httpService";
import { Form } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import swal from "sweetalert";

const ParentAttribute = ({ data, pid }) => {
  const [parentAttribute, setParentAttribute] = useState([]);
  const [form, setForm] = useState({
    pId: "",
    parentAttributeId: "",
    parentAttributeName: "",
    multiImage: false,
  });

  const handleChangeSelect = (e) => {
    let val = e.target.value;
    setForm({ ...form, parentAttributeId: e.target.value });
  };
  const onChangeMulti = () => {
    setForm({ ...form, multiImage: !data.multiImage });
  };

  const onClickRemove = (e) => {
    removeParentAttributeOfProduct(e.id)
      .then((res) => {if (res && res.data.statusCode == 1) {
        swal({
          title: res.data.message,
          timer: 2500,
          icon: "success",
        });
      } else {
        swal({
          title: res.data.message,
          timer: 2500,
          icon: "error",
        });
      }})
      .catch((e) => console.log());
  };
  const onClick = () => {
    console.log("form: ", form);

    updateProductAttribute(form)
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          swal({
            title: res.data.message,
            timer: 2500,
            icon: "success",
          });
        } else {
          swal({
            title: res.data.message,
            timer: 2500,
            icon: "error",
          });
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getParentAttribute().then((res) => {
      if (res.data.statusCode == 1) {
        setParentAttribute(res.data.data);
        console.log("data: ", res.data.data);
      }
    });
    setForm({ ...form, pId: pid });
  }, [pid]);
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
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
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Multi view"
              onChange={onChangeMulti}
            />
          </Form.Group>
        </div>
        <div className="col-12 text-center">
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={onClick}
          >
            Add Attribute
          </Button>
        </div>
      </div>
      <hr />
      <div className="row">
        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Multi Image</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length
              ? data.map((m, i) => (
                  <tr>
                    <th scope="row">{i + 1}</th>
                    <td>{m.parentTitle}</td>
                    <td>{m.multi ? "Yes" : "No"}</td>
                    <td>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        onClick={() => onClickRemove(m)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParentAttribute;
