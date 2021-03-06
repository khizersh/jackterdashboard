import React, { useEffect, useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { DataGrid } from "@material-ui/data-grid";
import { addSectionCache, getProductSections } from "../../utility/httpService";
import { MainContext } from "../../context/MainContext";
import swal from "sweetalert";

const ProductSection = () => {
  const { setLoader } = useContext(MainContext);
  const history = useHistory();
  const [row, setRow] = useState([]);

  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "title", headerName: "Section title", width: 200 },
    { field: "size", headerName: "Product count", width: 200 },
    {
      field: "",
      headerName: "Actions",
      width: 300,
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

  const onClickEdit = (data) => {
    history.push("section-edit/" + data.id);
  };
  const onClickRemove = (data) => {};
  const OnRefreshCache = () => {
    setLoader(true);
    addSectionCache({})
      .then((res) => {
        setLoader(false);
        if (res.data.statusCode == 1) {
          swal({
            title: res.data.message,
            timer: 2000,
            icon: "success",
          });
        }else{
          swal({
            title: res.data.message,
            icon: "error",
            timer: 2000,
          });
        }
      })
      .catch((e) => {});
  };

  const onClickAdd = () => {
    history.push("section-add");
  };

  useEffect(() => {
    getProductSections()
      .then((res) => {
        if (res.data.statusCode == 1) {
          let array = res.data.data.map((m, i) => {
            return {
              id: m.id,
              sNo: i + 1,
              title: m.title,
              size: m.productList.length,
            };
          });
          setRow(array);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <Container>
      <h2>Product Section</h2>
      <div className="text-right">
        <Button variant="text" color="primary" onClick={onClickAdd}>
          ADD SECTION
        </Button>
        <Button variant="text" color="secondary" onClick={OnRefreshCache}>
          REFRESH CACHE
        </Button>
      </div>
      <Row>
        <Col md={12} sm={12}>
          <div style={{ height: 500, width: "100%", background: "white" }}>
            <DataGrid
              rows={row}
              columns={colomn}
              pageSize={10}
              disableExtendRowFullWidth={false}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductSection;
