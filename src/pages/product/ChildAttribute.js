import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import swal from "sweetalert";
import {
  addChildAttributeToProduct,
  deleteAttributeImage,
  getChildAttributeByParentId,
  removeSubAttribute,
} from "../../utility/httpService";
import AttributeImageModal from "./AttributeImageModal";

const ChildAttribute = ({ data, pid }) => {

  const [attribute, setAttribute] = useState([]);
  const [childAttribute, setChildAttribute] = useState([]);
  const [child, setChild] = useState(null);
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    childAttributeId: null,
    parentID: null,
  });

  const handleChangeSelect = (e) => {
    let id = e.target.value;
    let att = attribute.filter((f) => id == f.id)[0];
    setForm({ ...form, parentID: id });
    setChild(att);
    getChildAttributeByParentId(att.parentAttributeId)
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          setChildAttribute(res.data.data);
        } else {
          swal({
            title: res.data.message,
            icon: "error",
            timer: 2500,
          });
        }
      })
      .catch((e) => console.log(e));
    console.log("att: ", att);
  };
  const onChangeChild = (e) => {
    let id = e.target.value;
    setForm({ ...form, childAttributeId: id });
  };

  const onClickAdd = (e) => {
    if (!form.parentID || !form.childAttributeId) {
      return swal({ title: "Enter all fields!", timer: 2500, icon: "error" });
    }
    let body = {
      ...form,
      productId: pid,
    };
    addChildAttributeToProduct(body)
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          swal({
            title: res.data.message,
            icon: "success",
            timer: 2500,
          });
        } else {
          swal({
            title: res.data.message,
            icon: "error",
            timer: 2500,
          });
        }
      })
      .catch((e) => console.log(e));
  };

  const onClickAddImage = (e) => {
    let body = {
      attributeId: e.id,
      productId: pid,
    };
    setImage(body);
    setModal(!modal);
  };

  const onClickRemove = (e) => {
    let body = {
      childAttributeId: e.id,
      parentID: e.parentId,
      productId: pid,
    };
    removeSubAttribute(body)
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          swal({
            title: res.data.message,
            icon: "success",
            timer: 2500,
          });
        } else {
          swal({
            title: res.data.message,
            icon: "error",
            timer: 2500,
          });
        }
      })
      .catch((e) => console.log(e));
  };

  const onClickRemoveImage = (e) => {
    console.log(e);
    deleteAttributeImage(e.id)
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
    if (data && data.length) {
      setAttribute(data);
    }
  }, [data]);

  return (
    <div className="container mt-4">
      <AttributeImageModal
        toggle={onClickAddImage}
        modal={modal}
        data={image}
      />
      <div className="row">
        <div className="col-12">
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select parent attribute</Form.Label>
            <Form.Control as="select" onChange={handleChangeSelect}>
              <option value="">Select</option>
              {attribute.length
                ? attribute.map((m, i) => (
                    <option key={i} value={m.id}>
                      {m.parentTitle}
                    </option>
                  ))
                : ""}
            </Form.Control>
          </Form.Group>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-12">
          {child && !child.multi ? (
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Select parent attribute</Form.Label>
                  <Form.Control as="select" onChange={onChangeChild}>
                    <option value="">Select</option>
                    {childAttribute && childAttribute.length
                      ? childAttribute.map((m, i) => (
                          <option key={i} value={m.id}>
                            {m.title}
                          </option>
                        ))
                      : ""}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-6 text-right m-auto">
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={onClickAdd}
                >
                  Add Attribute
                </Button>
              </div>

              <div className="col-12">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Title</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {child.childAttributeList.length
                      ? child.childAttributeList.map((m, i) => (
                          <tr key={i}>
                            <th scope="row">{i + 1}</th>
                            <td>{m.title}</td>

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
          ) : (
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Select parent attribute</Form.Label>
                  <Form.Control as="select" onChange={onChangeChild}>
                    <option value="">Select</option>
                    {childAttribute && childAttribute.length
                      ? childAttribute.map((m, i) => (
                          <option key={i} value={m.id}>
                            {m.title}
                          </option>
                        ))
                      : ""}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-6 text-right m-auto">
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={onClickAdd}
                >
                  Add Attribute
                </Button>
              </div>

              {child && child.childAttributeList.length
                ? child.childAttributeList.map((m, i) => (
                    <div className="col-12" key={i}>
                      <div className="row">
                        <div className="col-6">
                          <h3>{m.title}</h3>
                        </div>
                        <div className="col-6 text-right">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="medium"
                            onClick={() => onClickAddImage(m)}
                          >
                            Add Image
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <table class="table table-sm">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Image</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {m.attributeImageFull.length
                              ? m.attributeImageFull.map((n, i) => (
                                  <tr>
                                    <th scope="row">{i + 1}</th>
                                    <td>
                                      <img
                                        src={n.image}
                                        width="60"
                                        height="60"
                                        alt={n.id}
                                      />
                                    </td>

                                    <td>
                                      <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="medium"
                                        onClick={() => onClickRemoveImage(n)}
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
                  ))
                : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildAttribute;
