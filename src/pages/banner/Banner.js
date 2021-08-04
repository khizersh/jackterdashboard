import React, { useState, useEffect , useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Input } from "reactstrap";
import { DataGrid } from "@material-ui/data-grid";
import { DropzoneArea } from "material-ui-dropzone";
import swal from "sweetalert";
import { getBanners, addBanner , editBanner, deleteBanner} from "../../utility/httpService";
import Button from "@material-ui/core/Button";
import { MainContext } from "../../context/MainContext";

const Banner = () => {
  const { setLoader } = useContext(MainContext);
  const [data, setData] = useState({
    id: "",
    title: "",
    description: "",
    url: "",
  });
  const [image, setImage] = useState(null);
  const [mImage, setMImage] = useState(null);
  const [row, setRow] = useState([]);
  const [edit, setEdit] = useState(false);
  const [colomn, setColomn] = useState([
    { field: "sNo", headerName: "S#", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "image",
      headerName: "Image",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="art image"
          width="45"
          className="img-fluid"
        />
      ),
    },
    {
      field: "mobileImage",
      headerName: "Mobile image",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="art image"
          width="45"
          className="img-fluid"
        />
      ),
    },
    { field: "description", headerName: "Description", width: 200 },
    { field: "url", headerName: "Product Link", width: 200 },
   
    {
      field: "",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <strong>
          <Button
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => onClickEdit(params.row)}
          >
            Edit
          </Button>
          <Button
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

  const onClickEdit = (e) => {
    setEdit(true)
    setData({
      id:e.id,
      title:e.title,
      description:e.description,
      url:e.url,
    })
  };
  const onClickRemove = (e) => {
    setLoader(true)
    deleteBanner(e.id)
    .then((res) => {
      setLoader(false)
      if (res && res.data.statusCode == 1) {
        swal({ title: res.data.data, icon: "success", timer: 2500 });
      } else {
        return swal({
          title: res.data.message,
          icon: "error",
          timer: 2500,
        });
      }
    })
    .catch((e) =>  setLoader(false));
  };
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const onClickImage = (e) => {
    setImage(e[0]);
  };
  const onClickMobileImage = (e) => {
    setMImage(e[0]);
  };
  const addBannerData = () => {
    setLoader(true)
    var form = new FormData();
    form.append("banner", JSON.stringify(data));

    if (edit) {
      if (image) {
        form.append("file", image);
      }
      if (mImage) {
        form.append("mobileFile", mImage);
      }
      editBanner(form)
      .then((res) => {
        setLoader(false)
        if (res && res.data.statusCode == 1) {
          swal({ title: res.data.message, icon: "success", timer: 2500 });
        } else {
          return swal({
            title: res.data.message,
            icon: "error",
            timer: 2500,
          });
        }
      })
      .catch((e) =>  setLoader(false));

    } else {
        
      if (!image) {
        return swal({ title: "Image not found!", icon: "error", timer: 2500 });
      }
      if (!mImage) {
        return swal({ title: "Mobile Image not found!", icon: "error", timer: 2500 });
      }
      form.append("file", image);
      form.append("mobileFile", mImage);

      addBanner(form)
        .then((res) => {
          setLoader(false)
          if (res && res.data.statusCode == 1) {
            swal({ title: res.data.message, icon: "success", timer: 2500 });
          } else {
            return swal({
              title: res.data.message,
              icon: "error",
              timer: 2500,
            });
          }
        })
        .catch((e) => setLoader(false));
    }
  };

  useEffect(() => {
    setLoader(true)
    getBanners()
      .then((res) => {
        setLoader(false)
        if (res && res.data.data) {
          let array = res.data.data.map((m, i) => {
            return {
              sNo: i + 1,
              ...m,
            };
          });
          setRow(array);
        }
      })
      .catch((e) =>  setLoader(false));
  }, []);
  return (
    <Container>
      <Row className="row mb-3 shadow">
        <Col lg={6} md={6} sm={12} xs={12}>
          <label>Banner Title</label>
          <Input
            id="standard-basic"
            placeholder="Enter Title"
            onChange={onChange}
            value={data.title}
            name="title"
          />
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <label>Banner Description</label>
          <Input
            id="standard-basic"
            placeholder="Enter Description"
            onChange={onChange}
            value={data.description}
            name="description"
          />
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <label>Banner URL</label>
          <Input
            id="standard-basic"
            placeholder="Enter url"
            onChange={onChange}
            value={data.url}
            name="url"
          />
        </Col>
        <Col lg={6} md={6} sm={12}>
          <label>Banner Image size: 1350x420</label>
          <DropzoneArea
            acceptedFiles={["image/*", "application/*"]}
            onChange={onClickImage}
            showFileNames
            dropzoneText="Drag Image here."
            showAlerts={false}
            filesLimit={1}
          />
        </Col>
        <Col lg={6} md={6} sm={12}>
          <label>Banner Image Mobile size:  360x250</label>
          <DropzoneArea
            acceptedFiles={["image/*", "application/*"]}
            onChange={onClickMobileImage}
            showFileNames
            dropzoneText="Drag Image here for mobile."
            showAlerts={false}
            filesLimit={1}
          />
        </Col>
        <Col lg={12} md={12} sm={12} xs={12} className="text-center my-3">
          <Button variant="contained" color="primary" onClick={addBannerData}>
            {edit ? "Edit Banner" : "Add Banner"}
          </Button>
        </Col>
      </Row>

      <div style={{ height: 500, width: "100%", background: "white" }}>
        <DataGrid rows={row} columns={colomn} pageSize={10} />
      </div>
    </Container>
  );
};

export default Banner;
