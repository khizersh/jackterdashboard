import React, { useState, useEffect, useContext } from "react";
import {
  deleteProductById,
  getProducts,
  getProductsCache,
  addProductCache,
} from "../../utility/httpService";
import Button from "@material-ui/core/Button";
import { Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import swal from "sweetalert";
import { MainContext } from "../../context/MainContext";

const ProductView = () => {
  const { setLoader } = useContext(MainContext);
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
    { field: "title", headerName: "Product name", width: 130 },
    // { field: "description", headerName: "Description", width: 130 },
    { field: "categoryName", headerName: "Category", width: 90 },
    { field: "active", headerName: "Active", width: 90 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img src={params.value} alt="art image" width="45" />
      ),
    },
    {
      field: "",
      headerName: "Actions",
      width: 450,
      renderCell: (params) => (
        <strong>
          <Button
            color="primary"
            size="small"
            onClick={() => onClickEdit(params.row)}
          >
            Edit detail
          </Button>
          <Button
            color="secondary"
            size="small"
            style={{ marginLeft: 10 }}
            onClick={() => onClickSetPrice(params.row)}
          >
            Set Price
          </Button>
          <Button
            color="secondary"
            size="small"
            style={{ marginLeft: 10 }}
            onClick={() => onClickEditAttribute(params.row)}
          >
            Edit Attribute
          </Button>
          <Button
            color="secondary"
            size="small"
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
    history.push("/product-edit/" + value.id);
  };

  const onClickRemove = (value) => {
    setLoader(true);
    deleteProductById(value.id)
      .then((res) => {
        setLoader(false);
        if (res && res.data.statusCode == 1) {
          swal({
            title: res.data.message,
            timer: 2000,
            icon: "success",
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          swal({
            title: res.data.message,
            timer: 3000,
            icon: "error",
          });
        }
      })
      .catch((e) => setLoader(false));
  };

  const onClickAdd = () => {
    history.push("product-form");
  };
  const adCache = () => {
    setLoader(true);
    addProductCache()
      .then((res) => {
        setLoader(false);
        if (res.data.statusCode == 1) {
          swal({ title: res.data.message, timer: 2500, icon: "success" });
        } else {
          swal({ title: res.data.message, timer: 2500, icon: "error" });
        }
      })
      .catch((e) => {
        setLoader(false);
      });
  };

  const onClickSetPrice = (value) => {
    history.push("/product-price/" + value.id);
  };
  const onClickEditAttribute = (value) => {
    history.push("/product-attribute/" + value.id);
  };

  useEffect(() => {
    // getProducts()
    setLoader(true);
    getProductsCache()
      .then((res) => {
        setLoader(false);
        if (res.data.statusCode == 1) {
          console.log("res.data map: ",res.data);
          let array = res.data.data.map((m, i) => {
            return {
              sNo: ++i,
              ...m,
              priceSet: m.priceSet ? m.priceSet : false,
              image: m.imageList[0]?.image,
              active: m.range ? true : false,
            };
          });
          console.log("array: ", array);
          setRow(array);
        }
      })
      .catch((e) => {
        setLoader(false);
        console.log(e);
      });
  }, []);
  return (
    <Container>
      <Row className="my-3">
        <Col md={12} sm={12}>
          <div className="text-right">
            <Button color="primary" onClick={onClickAdd}>
              Add Product
            </Button>{" "}
            |
            <Button color="secondary" onClick={adCache}>
              Refresh cache
            </Button>
          </div>
        </Col>
      </Row>
      <div style={{ height: 500, width: "100%", background: "white" }}>
        <DataGrid
          rows={row}
          columns={colomn}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100, 250]}
        />
      </div>
    </Container>
  );
};

export default ProductView;
