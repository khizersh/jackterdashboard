import React, { useState, useEffect } from "react";
import { Container, Row, Col, Input, Button, Card, CardBody } from "reactstrap";
import swal from "sweetalert";
import ButtonR from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { addProductSection } from "../../utility/httpService";

const Add = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");

  const onChange = (e) => {
    setTitle(e.target.value);
  };

  const clearState = () => {
    setTitle("");
  };

  const onAdd = () => {
    if (!title) {
      return swal({
        title: "Please enter title!",
        timer: 2500,
        icon: "error",
      });
    }

    let body = {
      title: title,
    };
    addProductSection(body)
      .then((res) => {
        if (res.data.statusCode == 1) {
          swal({
            title: res.data.message,
            timer: 2500,
            icon: "success",
          }).then((resulty) => clearState());
        } else {
          swal({
            title: res.data.message,
            timer: 2500,
            icon: "error",
          }).then((resulty) => clearState());
        }
      })
      .catch((e) => console.log(e));
  };
  return (
    <Card>
      <Container fluid>
        <Row>
          <Col md={6} sm={12}>
            <h3 className="m-4">Add Section</h3>
          </Col>
          <Col md={6} sm={12}>
            <ButtonR
              variant="text"
              color="dprimary"
              className="mt-4 float-right"
              onClick={() => history.goBack()}
            >
              &#60;- Back
            </ButtonR>
          </Col>
        </Row>

        <CardBody>
          <Row>
            <Col md={6} sm={12}>
              <label>Enter title</label>
              <Input onChange={onChange} value={title} />
            </Col>
            <Col md={6} sm={12} className="m-auto ">
              <Button color="primary" className="mt-4" onClick={onAdd}>
                ADD SECTION
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Container>
    </Card>
  );
};

export default Add;
