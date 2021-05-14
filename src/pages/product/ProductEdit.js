import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  editProduct,
  getProductDetailById,
  deleteProductImage,
} from "../../utility/httpService";
import { Row, Col, Input, Button as ButtonR, Label, Table } from "reactstrap";
import swal from "sweetalert";
import ImageEditModal from "./ImageEditModal";
import Button from "@material-ui/core/Button";
import "./product.style.css";
import { reloadSetTime } from "../../utility/Service";

const ProductEdit = () => {
  const { id } = useParams();
  const [modal, setModal] = useState(false);
  const [data, setData] = useState({
    id: null,
    title: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editImageId, setImageEditId] = useState(null);

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const onSubmit = () => {
    editProduct(data.id, data)
      .then((res) => {
        if (res && res.data) {
          swal({ title: "Edit successfully!", timer: 2500, icon: "success" });
        }
        console.log("res in edit: ", res);
      })
      .catch((e) => console.log(e));
  };
  const toggle = (id) => {
    setImageEditId(id);
    setEdit(true);
    setModal(!modal);
  };

  const onClickRemove = (id) => {
    console.log("id: ", id);
    deleteProductImage(id)
      .then((res) => {
        if (res && res.data && res.data.statusCode == 1) {
          swal({
            title: "Image removed!",
            timer: 2500,
            icon: "success",
          });
          reloadSetTime(2.5);
        } else {
          return swal({
            title: res.data.message,
            timer: 2500,
            icon: "error",
          });
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (id) {
      getProductDetailById(id)
        .then((res) => {
          if (res.data && res.data.statusCode == 1) {
            console.log("res ", res);
            setData({
              id: id,
              title: res.data.data.title,
              description: res.data.data.description,
            });

            let array = res.data.data.imageList.map((m) => {
              return {
                ...m,
                image:  m.image,
              };
            });
            setImages(array);
          }
        })
        .catch((e) => console.log(e));
    }
  }, [id]);

  return (
    <div className="card p-3">
      <ImageEditModal
        toggle={toggle}
        modal={modal}
        edit={isEdit}
        id={editImageId}
      />
      <Row>
        <Col md="6" sm="12">
          <Label>Enter title</Label>
          <Input
            label="Enter title"
            onChange={onChange}
            value={data.title}
            name="title"
            placeholder="Enter title"
          />
        </Col>
        <Col md="6" sm="12">
          <Label>Enter description</Label>
          <Input
            type="textarea"
            label="Enter title"
            onChange={onChange}
            value={data.description}
            name="description"
            placeholder="Enter title"
          />
        </Col>
        <Col md="6" sm="12">
          <ButtonR color="primary" onClick={onSubmit}>
            EDIT DETAIL
          </ButtonR>
        </Col>
      </Row>
      <Row className="mt-4 p-4">
        <Table bordered>
          <thead>
            <tr>
              <th>S#</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.length
              ? images.map((image, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>
                      <img src={image.image} alt={image.name} width="60" />
                    </td>
                    <td>
                      <Button
                        color="primary"
                        size="small"
                        onClick={() => toggle(image.id)}
                      >
                        UPDATE
                      </Button>
                      <Button
                        color="secondary"
                        size="small"
                        onClick={() => onClickRemove(image.id)}
                      >
                        REMOVE
                      </Button>
                    </td>
                  </tr>
                ))
              : ""}
          </tbody>
        </Table>
      </Row>
    </div>
  );
};

export default ProductEdit;
