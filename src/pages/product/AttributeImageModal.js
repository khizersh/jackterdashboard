import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { DropzoneArea } from "material-ui-dropzone";
import { addAttributeImage } from "../../utility/httpService";
import swal from "sweetalert";

const AttributeImageModal = ({ toggle, modal, data }) => {
  const [images, setIamge] = useState([]);
  useEffect(() => {
    console.log("data in modal: ", data);
  }, [modal, data]);

  const onClickImage = (file) => {
    setIamge(file);
    console.log("file: ", file);
  };
  const onClickEdit = () => {
    if (!images.length) {
      return swal({
        title: "Please select image!",
        timer: 2500,
        icon: "danger",
      });
    }
    var formData = new FormData();
    images.map((m) => {
      formData.append("imageList", m);
    });
    formData.append("attribute", JSON.stringify(data));

    console.log(formData);

    addAttributeImage(formData)
      .then((res) => {
        if (res && res.data && res.data.statusCode == 1) {
          return swal({
            title: "Image updated!",
            timer: 2500,
            icon: "success",
          });
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
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Image</ModalHeader>
        <ModalBody>
          <DropzoneArea
            acceptedFiles={["image/*", "application/*"]}
            onChange={onClickImage}
            showFileNames={false}
            dropzoneText="Drag images here."
            showAlerts={false}
            filesLimit={7}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onClickEdit}>
            UPDATE
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            CANCEL
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AttributeImageModal;
