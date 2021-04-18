import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import swal from "sweetalert";
import {
  addImage,
  deleteImageById,
  getChildCategory,
  getImages,
  updateImages,
} from "../../utility/httpService";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { DropzoneArea } from "material-ui-dropzone";
import "./image.style.css";

const ImageComponent = () => {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const [data, setData] = useState({
    id: "",
    title: "",
    categoryId: null,
    imageFile: null,
  });

  const [childCategory, setchildCategory] = useState("");
  const [category, setCategory] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [row, setRow] = useState([]);

  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "category", headerName: "Category", width: 200 },
    {
      field: "picByte",
      headerName: "Image",
      width: 130,
      renderCell: (params) => (
        <img src={params.value} alt="art image" width="60" />
      ),
    },
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

  const onClickEdit = (value) => {
    setchildCategory(value.category);
    setData({
      id: value.id,
      title: value.title,
      categoryId: null,
      description: value.description,
      imageFile: null,
    });
    setIsEdit(true);
  };

  const onClickRemove = (value) => {
    deleteImageById(value.id).then((res) => {
      if (res.status == 200) {
        swal({
          title: "Remove Successfully!",
          icon: "success",
          timer: 2500,
        });
        window.location.reload();
      } else {
        swal({
          title: "Something went wrong!",
          icon: "error",
          timer: 2500,
        });
      }
    });
  };

  const onSubmit = () => {
    var formData = new FormData();

    if (isEdit) {
      formData.append("id", data.id);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("categoryId", data.categoryId ? data.categoryId : 0);
      formData.append("imageFile", data.imageFile);

      updateImages(formData).then((res) => {
        if (res && res.status == 200) {
          swal({
            title: "Edit successfully!",
            icon: "success",
            timer: 2500,
          });
          window.location.reload();
        } else {
          swal({
            title: "something went wrong!",
            icon: "success",
            timer: 2500,
          });
        }
      });
    } else {
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("categoryId", data.categoryId);
      formData.append("imageFile", data.imageFile);

      addImage(formData).then((res) => {
        if (res && res.status == 200) {
          swal({
            title: "Add succesfully!",
            icon: "success",
            timer: 2500,
          });
          window.location.reload();
        } else {
          swal({
            title: "Something went wrong!",
            icon: "success",
            timer: 2500,
          });
        }
      });
    }
  };

  const onClick = (file) => {
    setData({ ...data, imageFile: file[0] });
  };

  const handleChangeSelect = (e) => {
    let categoryId = e.target.value;
    setData({ ...data, categoryId: categoryId });
  };

  const onChangeTitle = (e) => {
    let title = e.target.value;
    setData({ ...data, title: title });
  };

  const test = () => {
    console.log("====================================");
    console.log(editorState.getCurrentContent());
    console.log("====================================");
  };
  useEffect(() => {
    getChildCategory().then((res) => {
      if (res.status == 200) {
        setCategory(res.data);
      }
    });
    getImages().then((res) => {
      if (res && res.status && res.status == 200) {
        console.log(res);
        let array = res.data.map((m, i) => {
          return {
            id: m.id,
            sNo: ++i,
            title: m.title,
            picByte: "data:" + m.type + ";base64," + m.picByte,
            description: m.description,
            category: m.category.categoryName,
            name: m.name,
          };
        });
        setRow(array);
        console.log("data in image: ", array);
      }
    });
  }, []);

  return (
    <Container>
      <Row>
        <Col md={4} sm={12}>
          <TextField
            id="standard-basic"
            label="Enter title"
            onChange={onChangeTitle}
            value={data.title}
          />
        </Col>
        <Col md={4} sm={12}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select parent category</Form.Label>
            <Form.Control as="select" onChange={handleChangeSelect}>
              <option value="">Select</option>
              {category.length
                ? category.map((m, i) => (
                    <option key={i} value={m.id}>
                      {m.categoryName}
                    </option>
                  ))
                : ""}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4} sm={12}>
          <DropzoneArea
            acceptedFiles={["image/*", "application/*"]}
            onChange={onClick}
            showFileNames
            dropzoneText="Drag the image here."
            showAlerts={false}
            filesLimit={20}
          />
        </Col>
        <Col md={12} sm={12}>
          <Editor
            editorState={editorState}
            wrapperClassName="bg-white"
            editorClassName="bg-white"
            onEditorStateChange={setEditorState}
          />
        </Col>
        <Col md={12} sm={12} className="text-center">
          <Button color="primary" onClick={test}>
            {isEdit ? "Edit Category" : "Add Category"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ImageComponent;
