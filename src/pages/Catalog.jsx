import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Popconfirm,
  Modal,
  message,
} from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

import dayjs from "dayjs";

import "./style.css";
import {
  InsertRowBelowOutlined,
  EditOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import Navbar from "./Navbar.jsx";
import ButtonGroup from "antd/es/button/button-group.js";
import localeLV from "./localeLV.js"; // Import your translations
import * as XLSX from "xlsx";

function Catalog() {
  const [api, contextHolder] = message.useMessage();
  const gridStyle = useMemo(
    () => ({ height: "calc(100% - 152px)", width: "100%" }),
    []
  );

  const [isFormDirty, setIsFormDirty] = useState(false);

  const [gridOptions, setGridOptions] = useState({
    // Other grid options...
    localeText: localeLV, // Set the locale text with your translations
  });

  //AG-Grid kolonnas
  const [columnDefs] = useState([
    {
      field: "auto_nr",
      headerName: "Reģistrācijas numurs",
      cellDataType: "text",
      filter: true,
    },
    {
      field: "auto_gads",
      headerName: "Izlaiduma gads",
      cellStyle: { justifyContent: "flex-end" },
      filter: true,
    },
    {
      field: "marka_nosaukums",
      headerName: "Marka",
      cellStyle: { justifyContent: "center" },
      filter: true,
    },
    {
      field: "motors_nosaukums",
      headerName: "Motora tips",
      cellStyle: { justifyContent: "center" },
      filter: true,
    },
    {
      field: "motoratilpums",
      headerName: "Motora tilpums",
      headerClass: "ag-right-aligned-header",
      cellStyle: { justifyContent: "left" },
      filter: true,
    },
    {
      field: "pilnamasa",
      headerName: "Pilnā masa (kg)",
      filter: true,
    },
    {
      field: "pasmasa",
      headerName: "Pašmasa (kg)",
      filter: true,
    },
    {
      field: "piedzina_nosaukums",
      headerName: "Piedziņas tips",
      filter: true,
    },
  ]);

  // Noklusējuma atribūti visām kolonnām
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      resizable: true,
      sortable: true,
      maxWidth: 250,
      width: 125,
      minWidth: 100,
    };
  }, []);

  const gridRef = useRef();

  //fetcho visus datus no datubāzes
  const [rowData, setRowData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost/carsCatalog/src/phpscripts/fetch.php"
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setRowData(data); // Assuming setRowData updates AG-Grid's rowData
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally handle the error, e.g., by showing a message to the user
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //fetcho visus datus no markas tabula
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          "http://localhost/carsCatalog/src/phpscripts/brand-single.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Could not fetch brands data: ", error);
      }
    };

    // Call the fetch function
    fetchBrands();
  }, []); // The empty array causes this effect to only run on mount

  //fetcho visus datus no markas tabula
  const [engineType, setEngineType] = useState([]);
  useEffect(() => {
    const fetchEngineType = async () => {
      try {
        const response = await fetch(
          "http://localhost/carsCatalog/src/phpscripts/engineType-single.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEngineType(data);
      } catch (error) {
        console.error("Could not fetch engine type data: ", error);
      }
    };

    // Call the fetch function
    fetchEngineType();
  }, []); // The empty array causes this effect to only run on mount

  //fetcho visus datus no piedzinas tabula
  const [drivetrainType, setDrivetrainType] = useState([]);
  useEffect(() => {
    const fetchDrivetrain = async () => {
      try {
        const response = await fetch(
          "http://localhost/carsCatalog/src/phpscripts/drivetrain-single.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDrivetrainType(data);
      } catch (error) {
        console.error("Could not fetch engine type data: ", error);
      }
    };

    // Call the fetch function
    fetchDrivetrain();
  }, []); // The empty array causes this effect to only run on mount

  const [fullWeight, setFullWeight] = useState("");
  const [curbWeight, setCurbWeight] = useState("");

  const fullWeightFunc = (event) => {
    setFullWeight(event.target.value);
  };

  const curbWeightFunc = (event) => {
    setCurbWeight(event.target.value);
  };

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const handleFormSubmit = async (formData) => {
    let fullWeightNum = Number(fullWeight);
    let curbWeightNum = Number(curbWeight);

    if (formData.releaseYear && formData.releaseYear.$isDayjsObject) {
      formData.releaseYear = formData.releaseYear.year();
    }

    if (fullWeightNum > 0 && fullWeightNum >= curbWeightNum) {
      if (curbWeightNum > 0) {
        if (!isRegistrationNumberUnique) {
          api.open({
            type: "error",
            content: "Reģistrācijas numurs nav unikāls!",
          });
        } else {
          try {
            await fetch("http://localhost/carsCatalog/src/phpscripts/add.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
            // Handle any follow-up actions after successful submission

            handleCloseModal(); // Close the modal
            fetchData(); // Refresh the AG-Grid data
            setDeleteDisabled(true);
            api.open({
              type: "success",
              content: "Veiksmīgi ievietots jauns ieraksts katalogā!",
            });
          } catch (error) {
            console.error("Submission error:", error);
          }
        }
      } else {
        api.open({
          type: "error",
          content: "Pašmasa nedrīkst būt 0 vai negatīvs skaitlis!",
        });
      }
    } else {
      api.open({
        type: "error",
        content:
          "Pilnā masa nedrīkst būt negatīvs, vienāds vai mazāks par pašmasu!",
      });
    }
  };

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        handleFormSubmit(values);
      })
      .catch((error) => {
        console.error("Validation error:", error);
      });
  };

  const [isRegistrationNumberUnique, setIsRegistrationNumberUnique] =
    useState(true);

  const checkRegistrationNumberUnique = async (registrationNumber) => {
    try {
      const response = await fetch(
        "http://localhost/carsCatalog/src/phpscripts/checkUnique.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ registrationNumber }),
        }
      );
      const data = await response.json();
      setIsRegistrationNumberUnique(data.isUnique);
    } catch (error) {
      console.error("Error checking registration number uniqueness:", error);
    }
  };

  const [editData, setEditData] = useState(null);

  useEffect(() => {
    // This check ensures `editData` is not null and the form is available
    if (editData && Object.keys(editData).length > 0 && form) {
      const formValues = {
        registrationNumber: editData.auto_nr,
        releaseYear: dayjs(editData.auto_gads, "YYYY"), // Assuming `editData.auto_gads` is the year
        carBrand: editData.marka_nosaukums, // Make sure these match the actual property names in `editData`
        engineType: editData.motors_nosaukums,
        engineCapacity: editData.motoratilpums,
        fullWeight: editData.pilnamasa,
        curbWeight: editData.pasmasa,
        drivetrain: editData.piedzina_nosaukums,
      };
      editForm.setFieldsValue(formValues);
    }
  }, [editData, editForm]);

  const handleEdit = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 1) {
      setIsModalOpen2(true);
      setEditData(selectedRows[0]);
      setIsFormDirty(false); // Reset the form dirty status each time the modal is opened for editing
    }
  };

  const handleEditSubmit = async () => {
    if (!isFormDirty) {
      // Optionally notify the user no changes were made
      message.info("No changes detected.");
      return;
    }


  };

  const onRemoveSelected = async () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const autoNumbersToDelete = selectedNodes.map((node) => node.data.auto_nr); // Use auto_nr instead of id

    if (autoNumbersToDelete.length > 0) {
      try {
        const response = await fetch(
          "http://localhost/carsCatalog/src/phpscripts/delete.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ auto_nrs: autoNumbersToDelete }), // Send auto_nrs instead of ids
          }
        );

        const result = await response.json();
        if (result.success) {
          // Refresh the grid data after successful deletion
          fetchData();
          message.success("Ieraksti veiksmīgi dzēsti!");
        } else {
          message.error("Kļūda dzēšot ierakstus!");
        }
      } catch (error) {
        console.error("Failed to delete:", error);
        message.error("Kļūda dzēšot ierakstus, skatīt konsoli!");
      }
    } else {
      message.warning("Nav izvēlētas rindas priekš dzēšanas!");
    }
  };

  //Modal
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  //funkcija, kas aizver modal un atiestata visus Form datus
  const handleCloseModal = () => {
    setIsModalOpen1(false);
    setIsModalOpen2(false);

    form.resetFields();
  };

  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [editDisabled, setEditDisabled] = useState(true);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    const numberOfSelectedRows = selectedRows.length;

    // Enable the "Delete" button only when one row is selected
    setDeleteDisabled(numberOfSelectedRows === 0);

    // Enable the "Edit" button only when one row is selected
    setEditDisabled(numberOfSelectedRows !== 1);
  }, []);

  //DatePicker noteikumi par gada izvēli ( 1900 līdz tekošam gadam )
  const minYear = 1900;
  const maxYear = dayjs().year();

  const disabledDate = (current) => {
    return current && (current.year() < minYear || current.year() > maxYear);
  };

  //funkcija, kas ļauj rediģēt ierakstu caur dubult-klikšķa uz rindas
  const onRowDoubleClicked = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();

    if (selectedRows.length === 1 && selectedRows[0].status === "Available") {
      setIsModalOpen2(true);
    }
  };

  const exportToExcel = () => {
    // Access the grid API
    const api = gridRef.current.api;

    // Get the displayed rows after filtering, sorting, etc.
    const rowData = [];
    api.forEachNodeAfterFilterAndSort((node) => {
      rowData.push(node.data);
    });

    // Create an Excel worksheet
    const ws = XLSX.utils.json_to_sheet(rowData);

    // Create an Excel workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Correct the options for XLSX.write
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert string to array buffer
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    // Create a Blob from the workbook
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element and trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "auto_katalogs.xlsx";
    document.body.appendChild(a); // Append the link to the body
    a.click();
    document.body.removeChild(a); // Remove the link when done

    // Cleanup
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {contextHolder}
      <Navbar />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ButtonGroup>
          <Button
            icon={<InsertRowBelowOutlined />}
            onClick={() => setIsModalOpen1(true)}
          >
            Pievienot
          </Button>

          <Modal
            title="Pievienot autotransportu"
            maskClosable={false}
            keyboard={false}
            open={isModalOpen1}
            onOk={onFinish}
            okText="Pievienot"
            cancelText="Atcelt"
            onCancel={handleCloseModal}
          >
            <Form
              layout="vertical"
              className="form"
              name="basic"
              autoComplete="off"
              form={form}
            >
              <div>
                <Form.Item
                  label="Reģistrācijas numurs"
                  name="registrationNumber"
                  rules={[
                    {
                      required: true,
                      message: "Reģistrācijas numurs obligāts!",
                    },
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.resolve(); // Skip validation if value is not entered (handled by required rule)
                        }
                        const regex = /^[A-Z0-9]{1,20}$/; // Adjust the regex pattern to match your registration number format
                        if (regex.test(value)) {
                          checkRegistrationNumberUnique(value); // Check uniqueness when the value changes
                          return Promise.resolve(); // Validation success
                        } else {
                          return Promise.reject(
                            new Error("Reģistrācijas numuram jābūt unikālam!")
                          ); // Validation failed
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    maxLength="20"
                    onInput={(e) =>
                      (e.target.value = e.target.value.toUpperCase())
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Izlaiduma gads"
                  name="releaseYear"
                  rules={[
                    {
                      required: true,
                      message: "Izlaiduma gads obligāts!",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder=""
                    picker="year"
                    disabledDate={disabledDate}
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Marka"
                  name="carBrand"
                  rules={[
                    {
                      required: true,
                      message: "Markas ievade obligāta!",
                    },
                  ]}
                >
                  <Select>
                    {brands.map((brand, index) => (
                      <Select.Option key={index + 1} value={brand.ID}>
                        {brand.nosaukums}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Motora tips"
                  name="engineType"
                  rules={[
                    {
                      required: true,
                      message: "Motora tips obligāts!",
                    },
                  ]}
                >
                  <Select>
                    {engineType.map((engine, index) => (
                      <Select.Option key={index + 1} value={engine.ID}>
                        {engine.nosaukums}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  label="Motora tilpums"
                  name="engineCapacity"
                  rules={[
                    {
                      required: true,
                      message: "Motora tilpums obligāts!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1} // Optional: sets a minimum value
                    max={9999} // Optional: sets a maximum value, adjust according to your requirements
                    style={{
                      width: "100%",
                    }}
                    controls={false}
                    // Optional: if you want to ensure no decimals
                    step={1}
                    // You can remove the formatter and parser if you do not wish to format the input display
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>

                <Form.Item
                  label="Pilnā masa (kg)"
                  name="fullWeight"
                  onChange={fullWeightFunc}
                  rules={[
                    {
                      required: true,
                      message: "Pilnās masas ievade obligāta!",
                    },
                  ]}
                >
                  <Input maxLength="4" />
                </Form.Item>

                <Form.Item
                  label="Pašmasa (kg)"
                  name="curbWeight"
                  onChange={curbWeightFunc}
                  rules={[
                    {
                      required: true,
                      message: "Pašmasas ievade obligāta!",
                    },
                  ]}
                >
                  <Input maxLength="4" />
                </Form.Item>

                <Form.Item
                  label="Piedziņas tips"
                  name="drivetrain"
                  rules={[
                    {
                      required: true,
                      message: "Piedziņas tips obligāts!",
                    },
                  ]}
                >
                  <Select>
                    {drivetrainType.map((drivetrain, index) => (
                      <Select.Option key={index + 1} value={drivetrain.ID}>
                        {drivetrain.nosaukums}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Form>
          </Modal>

          <Button
            icon={<EditOutlined />}
            disabled={editDisabled}
            onClick={handleEdit}
          >
            Rediģēt
          </Button>

          <Popconfirm
            title="Dzēst ierakstu"
            description="Esiet pārliecināts dzēst ierakstu/s?"
            okText="Jā"
            cancelText="Nē"
            onConfirm={onRemoveSelected}
          >
            <Button danger disabled={deleteDisabled}>
              Dzēst
            </Button>
          </Popconfirm>
        </ButtonGroup>

        <Modal
          keyboard={false}
          maskClosable={false}
          title="Rediģēt autotransportu"
          open={isModalOpen2}
          okText={"Saglabāt"}
          cancelText={"Atcelt"}
          onOk={() => {
            if (isFormDirty) {
              handleEditSubmit();
            }
          }}
          onCancel={handleCloseModal}
          okButtonProps={{ disabled: !isFormDirty }} // Disable the "Save" button if the form is not dirty
        >
          <Form
            layout="vertical"
            className="form"
            name="edit"
            autoComplete="off"
            form={editForm}
            onValuesChange={() => setIsFormDirty(true)}
            >
            <div>
              <Form.Item
                label="Reģistrācijas numurs"
                name="registrationNumber"
                rules={[
                  {
                    required: true,
                    message: "Reģistrācijas numurs obligāts!",
                  },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve(); // Skip validation if value is not entered (handled by required rule)
                      }
                      const regex = /^[A-Z0-9]{1,20}$/; // Adjust the regex pattern to match your registration number format
                      if (regex.test(value)) {
                        checkRegistrationNumberUnique(value); // Check uniqueness when the value changes
                        return Promise.resolve(); // Validation success
                      } else {
                        return Promise.reject(
                          new Error("Reģistrācijas numuram jābūt unikālam!")
                        ); // Validation failed
                      }
                    },
                  },
                ]}
              >
                <Input
                  maxLength="20"
                  onInput={(e) =>
                    (e.target.value = e.target.value.toUpperCase())
                  }
                />
              </Form.Item>

              <Form.Item
                label="Izlaiduma gads"
                name="releaseYear"
                rules={[
                  {
                    required: true,
                    message: "Izlaiduma gads obligāts!",
                  },
                ]}
              >
                <DatePicker
                  placeholder=""
                  picker="year"
                  disabledDate={disabledDate}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Marka"
                name="carBrand"
                rules={[
                  {
                    required: true,
                    message: "Markas ievade obligāta!",
                  },
                ]}
              >
                <Select>
                  {brands.map((brand, index) => (
                    <Select.Option key={index + 1} value={brand.ID}>
                      {brand.nosaukums}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Motora tips"
                name="engineType"
                rules={[
                  {
                    required: true,
                    message: "Motora tips obligāts!",
                  },
                ]}
              >
                <Select>
                  {engineType.map((engine, index) => (
                    <Select.Option key={index + 1} value={engine.ID}>
                      {engine.nosaukums}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div>
              <Form.Item
                label="Motora tilpums"
                name="engineCapacity"
                rules={[
                  {
                    required: true,
                    message: "Motora tilpums obligāts!",
                  },
                ]}
              >
                <Input
                  maxLength={4}
                  minLength={4}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Pilnā masa (kg)"
                name="fullWeight"
                onChange={fullWeightFunc}
                rules={[
                  {
                    required: true,
                    message: "Pilnās masas ievade obligāta!",
                  },
                ]}
              >
                <Input maxLength="4" />
              </Form.Item>

              <Form.Item
                label="Pašmasa (kg)"
                name="curbWeight"
                onChange={curbWeightFunc}
                rules={[
                  {
                    required: true,
                    message: "Pašmasas ievade obligāta!",
                  },
                ]}
              >
                <Input maxLength="4" />
              </Form.Item>

              <Form.Item
                label="Piedziņas tips"
                name="drivetrain"
                rules={[
                  {
                    required: true,
                    message: "Piedziņas tips obligāts!",
                  },
                ]}
              >
                <Select>
                  {drivetrainType.map((drivetrain, index) => (
                    <Select.Option key={index + 1} value={drivetrain.ID}>
                      {drivetrain.nosaukums}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form>
        </Modal>

        <Button icon={<FileExcelOutlined />} onClick={() => exportToExcel()}>
          Eksportēt
        </Button>
      </div>

      <div className="ag-theme-balham" style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          gridOptions={gridOptions}
          rowSelection={"multiple"}
          pagination={true}
          paginationPageSize={30}
          onSelectionChanged={onSelectionChanged}
          onRowDoubleClicked={onRowDoubleClicked}
          animateRows={true}
          rowHeight={35}
          alwaysShowVerticalScroll={true}
        ></AgGridReact>
      </div>
    </>
  );
}

export default Catalog;
