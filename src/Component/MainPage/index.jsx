import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { delay } from "../../Utils/localStorage";
import { toast } from "react-toast";

function MainPage() {
  const { register, handleSubmit, watch } = useForm();
  const [data, setData] = useState([]);
  const [dataCrawled, setDataCrawled] = useState(0);
  const [tenNextStartPhone, setTenNextStartPhone] = useState("");
  const [continueCrawl, setContinueCrawl] = useState(false);
  function handleIcreaseRangePhone(startPhone, client_id) {
    const arrPhone = [];
    const formatStartPhone = Number(startPhone.toString().substring(1));
    for (let i = formatStartPhone; i <= formatStartPhone + 9; i++) {
      const j = i;
      arrPhone.push({
        client_id: client_id,
        phone: "0" + j.toString(),
        password: "123456",
      });
    }
    return [...arrPhone];
  }

  async function exportExcel() {
    try {
      const res = await axios.get("http://localhost:8080/download-excel");
      if (res && res.data && res.data.status === "success") {
        toast.success("Export successfully!");
      } else {
        toast.error("Export failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Export failed");
    }
  }

  async function handleCallEveryApi(startPhone, client_id) {
    const requestData = handleIcreaseRangePhone(startPhone, client_id);
    try {
      const rsApi = await axios.post(
        "http://localhost:8080/crawl-account-fpt",
        {
          accounts: requestData,
        }
      );
      setTenNextStartPhone(
        "0" +
          (Number(requestData[9].phone.toString().substring(1)) + 1).toString()
      );
      if (rsApi && rsApi.data && rsApi.data.data) {
        return rsApi.data.data;
      }
      return null;
    } catch (err) {
      return null;
    }
  }
  const onSubmit = async (dataSubmit) => {
    const { startPhone, client_id } = dataSubmit;
    const apiData = await handleCallEveryApi(startPhone, client_id);
    if (apiData) {
      setData(apiData);
      setDataCrawled((oldValue) => oldValue + apiData.length);
    }
    setContinueCrawl(true);
  };

  useEffect(() => {
    if (continueCrawl && tenNextStartPhone) {
      delay(async function () {
        const apiData = await handleCallEveryApi(
          tenNextStartPhone,
          watch("client_id")
        );
        if (apiData) {
          setData((oldData) => [...oldData, ...apiData]);
          setDataCrawled((oldValue) => oldValue + apiData.length);
        }
      }, 1000);
    }
  }, [tenNextStartPhone, continueCrawl]);

  return (
    <Container maxWidth="md">
      <Typography variant="h2" sx={{ color: "#1976d2" }}>
        {" "}
        Crawl data{" "}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          "& .MuiTextField-root": { m: 1, width: "30ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id="outlined-required"
          label="Start phone"
          defaultValue=""
          {...register("startPhone", { required: true })}
        />
        <TextField
          required
          id="outlined-required"
          label="Client Id"
          defaultValue=""
          {...register("client_id", { required: true })}
        />
        <Button
          disabled={continueCrawl}
          variant="contained"
          sx={{ m: 1 }}
          type="submit"
        >
          {continueCrawl ? "Crawling" : "Crawl"}
        </Button>
        <Button
          disabled={!continueCrawl}
          variant="contained"
          sx={{ m: 1 }}
          onClick={() => setContinueCrawl(false)}
          type="button"
        >
          Stop Crawl
        </Button>
        <Button
          disabled={continueCrawl}
          variant="contained"
          sx={{ m: 1 }}
          onClick={exportExcel}
          type="button"
        >
          Export Excell
        </Button>
      </Box>
      <Typography sx={{ m: 1 }}>Số account đã crawl: {dataCrawled}</Typography>
      <Typography sx={{ m: 1 }}>
        Số phone bắt đầu crawl tiếp theo: {tenNextStartPhone}
      </Typography>
      <Box
        component="table"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        sx={{ m: 1 }}
      >
        <TableHead>
          <TableRow sx={{ background: "#1976d2" }}>
            <TableCell sx={{ color: "white" }}>Phone (Account)</TableCell>
            <TableCell sx={{ color: "white" }} align="right">
              Password
            </TableCell>
            <TableCell sx={{ color: "white" }} align="right">
              Package
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data || []).map((d, idx) => (
            <TableRow key={idx}>
              <TableCell
                sx={{ width: "150px", border: ".5px solid #1976d2" }}
                component="th"
                scope="row"
              >
                {d.account.phone}
              </TableCell>
              <TableCell
                sx={{ width: "150px", border: ".5px solid #1976d2" }}
                align="right"
              >
                {d.account.password}
              </TableCell>
              <TableCell
                sx={{ width: "300px", border: ".5px solid #1976d2" }}
                align="right"
              >
                {(d.packages || []).map((pk, idex) => (
                  <React.Fragment key={idex}>
                    {idex === 0 ? "" : <hr />}
                    <span>
                      {/* -Tên gói: {pk.plan_name} <br />
                      -Số ngày còn lại: {pk.dateleft} <br />
                      -Ngày hết hạn: {pk.expired_date} <br />
                      -Ngày đăng ký: {pk.from_date} <br /> */}
                      - Tên gói: {pk.plan_name} - {pk.dateleft} ngày
                    </span>
                  </React.Fragment>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Box>
    </Container>
  );
}

export default MainPage;
