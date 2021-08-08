import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Input } from "reactstrap";
import { DropzoneArea } from "material-ui-dropzone";
import {
  editReview,
  getAllReviews,
  getProducts,
  getProductsCache,
  deleteReview,
  addReviewByAdmin,
} from "../../utility/httpService";
import swal from "sweetalert";

const Review = () => {
  const [title, setTitle] = useState("Add Review");
  const [isEdit, setIdEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [reviewImage, setReviewImage] = useState(null);

  const [row, setRow] = useState([]);
  const [product, setProduct] = useState([]);
  const [data, setData] = useState({
    id: "",
    productId: "",
    userId: "",
    review: "",
    reviewCount: 0,
    userName: "",
    date: null,
  });

  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "userName", headerName: "Customer name", width: 200 },
    { field: "reviewCount", headerName: "Stars", width: 200 },
    { field: "review", headerName: "Comment", width: 200 },
    // {
    //   field: "userImage",
    //   headerName: "User Image",
    //   width: 130,
    //   renderCell: (params) => (
    //     <img
    //       src={params.value}
    //       alt="product"
    //       width="50px"
    //       className="img-fluid"
    //     />
    //   ),
    // },
    {
      field: "productImage",
      headerName: "Product Image",
      width: 200,
      renderCell: (params) => (
        <img src={params.value} alt="product" width="50px" />
      ),
    },
    {
      field: "reviewImage",
      headerName: "Review Image",
      width: 200,
      renderCell: (params) => (
        <img src={params.value} alt="product" width="50px" />
      ),
    },
    { field: "productId", headerName: "Product id", width: 200 },
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
    getAllReviews().then((res) => {
      if (res.data.statusCode == 1) {
        let array = res.data.data.map((m, i) => {
          let obj = {
            ...m,
            date: m.date.split("T")[0],
            sNo: i + 1,
          };
          return obj;
        });

        setRow(array);
      }
    });
    getProductsCache().then((res) => {
      if (res.data.statusCode == 1) {
        setProduct(res.data.data);
      }
    });
  }, []);

  const onChange = (e, type) => {
    if (type == "count") {
      if (e.target.value >= 0 && e.target.value <= 5) {
        setData({ ...data, [e.target.name]: e.target.value });
      }
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };
  const onChangeDate = (e) => {
    setData({ ...data, date: new Date(e.target.value) });
  };
  const onClickImage = (e) => {
    setImage(e[0]);
  };
  const onChangeReviewImage = (e) => {
    setReviewImage(e.target.files[0]);
  };

  const onClickEdit = (value) => {
    setIdEdit(true);
    setTitle("Edit Review");
    let body = {
      id: value.id,
      productId: value.productId,
      userId: value.userId,
      review: value.review,
      reviewCount: value.reviewCount,
      userName : value.userName

    };
    setData(body);
  };
  const handleChangeSelect = (value) => {
    setData({ ...data, productId: value.target.value });
  };
  const onClickRemove = (value) => {
    deleteReview(value.id).then((res) => {
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

  const addReview = () => {
    if (isEdit) {
      editReview(data).then((res) => {
        if (res && res.data.statusCode == 1) {
          swal({
            title: "Edit successfully!",
            timer: 3000,
            icon: "success",
          });
          window.location.reload();
        } else {
          swal({
            title: res.data.message,
            timer: 3000,
            icon: "error",
          });
        }
      });
    } else {
      if (!image || !data.userName) {
        return swal({
          title: "Enter ell fields",
          timer: 2500,
          icon: "error",
        });
      }

      let form = new FormData();
      form.append("reviewString", JSON.stringify(data));
      form.append("image", image);
      form.append("file", reviewImage);
      addReviewByAdmin(form).then((res) => {
        if (res && res.data.statusCode == 1) {
          swal({
            title: "Add successfully!",
            timer: 3000,
            icon: "success",
          });

          window.location.reload();
        } else {
          swal({
            title: res.data.message,
            timer: 3000,
            icon: "success",
          });
        }
      });
    }
  };
  return (
    <Container>
      <Row className="row mb-3 shadow">
        <Col lg={6} md={6} sm={12} xs={12}>
          <label>Enter review</label>
          <Input
            id="standard-basic"
            label="Parent category"
            onChange={onChange}
            value={data.review}
            name="review"
          />
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <label>Enter stars </label>
          <Input
            type="number"
            id="standard-basic"
            label="Parent category"
            onChange={(e) => onChange(e , "count")}
            value={data.reviewCount}
            name="reviewCount"
          />
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <label>Enter date </label>
          <Input
            type="date"
            id="standard-basic"
            label="Parent category"
            onChange={onChangeDate}
            // value={data.date}
            name="date"
          />
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <label>Enter  review image</label>
          <Input
            type="file"
            id="standard-basic"
            label="Parent category"
            onChange={onChangeReviewImage}
            // value={data.date}
            name="date"
          />
        </Col>
        <Col lg={6} md={6} sm={12}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select product</Form.Label>
            <Form.Control as="select" onChange={handleChangeSelect}>
              <option value="">Select</option>
              {product.length
                ? product.map((m, i) => (
                    <option key={i} value={m.id}>
                      {m.title}
                    </option>
                  ))
                : ""}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6} sm={12}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>User Name</Form.Label>
            <Input
              type="test"
              id="standard-basic"
              label="Parent category"
              onChange={onChange}
              value={data.userName}
              name="userName"
            />
          </Form.Group>
        </Col>
        <Col sm={12}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select User image</Form.Label>
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
          </Form.Group>
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Button variant="contained" color="primary" onClick={addReview}>
            {title}
          </Button>
        </Col>
      </Row>

      <div style={{ height: 500, width: "100%", background: "white" }}>
        <DataGrid rows={row} columns={colomn} pageSize={10} />
      </div>
    </Container>
  );
};
export default Review;
