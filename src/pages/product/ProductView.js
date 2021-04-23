import React, { useState, useEffect } from "react";
import { deleteProductById, getProducts } from "../../utility/httpService";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Container, Row, Col } from "react-bootstrap";
import { Input } from "reactstrap";
import { useHistory } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import swal from "sweetalert";

const ProductView = () => {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [row, setRow] = useState([]);
  const [isEdit, setIdEdit] = useState(false);
  const [data, setData] = useState({
    id: null,
    title: "test product 1",
    description: "description",
    categoryId: 1,
  });
  const [imageList, setimageList] = useState([]);
  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "title", headerName: "Product name", width: 200 },
    { field: "description", headerName: "Description", width: 130 },
    { field: "categoryName", headerName: "Category", width: 130 },
    { field: "priceSet", headerName: "Active", width: 130 },
    {
      field: "image",
      headerName: "Image",
      width: 130,
      renderCell: (params) => (
        <img src={params.value} alt="art image" width="45" />
      ),
    },
    {
      field: "",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <strong>
          <Button
            color="primary"
            size="sm"
            onClick={() => onClickEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            color="secondary"
            size="sm"
            style={{ marginLeft: 10 }}
            onClick={() => onClickSetPrice(params.row)}
          >
            Set Price
          </Button>
          <Button
            color="danger"
            size="sm"
            style={{ marginLeft: 10 }}
            onClick={() => onClickRemove(params.row)}
          >
            Remove
          </Button>
        </strong>
      ),
    },
  ]);

  const onClickEdit = (value) => {
    console.log("value: ", value);
    history.push("/product-edit/" + value.id);
  };

  const onClickRemove = (value) => {
    deleteProductById(value.id).then((res) => {
      if (res && res.status == 200) {
        swal({
          title: "Remove successfully!",
          timer: 2000,
          icon: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        swal({
          title: "Cannot be deleted!",
          timer: 3000,
          icon: "error",
        });
      }
    });
  };

  const onClickAdd = () => {
    history.push("product-form");
  };

  const onClickSetPrice = (value) => {
    history.push("/product-price/" + value.id);
  };

  useEffect(() => {
    getProducts()
      .then((res) => {
        if (res.data.statusCode == 1) {
          let array = res.data.data.map((m, i) => {
            return {
              sNo: ++i,
              ...m,
              priceSet: m.priceSet ? m.priceSet : false,
              image:
                "data:" +
                m.imageList[0].type +
                ";base64," +
                m.imageList[0].picByte,
            };
          });
          console.log("arrayl; ", array);
          setRow(array);
        }
      })
      .catch((e) => console.log(e));
  }, []);
  return (
    <Container>
      <Row className="my-3">
        <Col md={12} sm={12}>
          <div className="text-right">
            <Button color="primary" onClick={onClickAdd}>
              Add Product
            </Button>
          </div>
        </Col>
      </Row>
      <div style={{ height: 500, width: "100%", background: "white" }}>
        <DataGrid rows={row} columns={colomn} pageSize={10} rowsPerPageOptions={[10,25,50,100,250]} />
      </div>
    </Container>
  );
};

export default ProductView;
