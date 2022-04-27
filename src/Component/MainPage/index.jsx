import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getAuth } from "../../Utils/localStorage";
import { Navigate } from "react-router-dom";
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

function MainPage() {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState([]);
  const user = getAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  function handleIcreaseRangePhone(startPhone, endPhone) {
    const formatStartPhone = startPhone.substring(1);
    const formatEndPhone = endPhone.substring(1);
    return [formatStartPhone, formatEndPhone];
  }
  const onSubmit = async (data) => {
    const { startPhone, endPhone, client_id } = data;
    const [startPoint, endPoint] = handleIcreaseRangePhone(
      startPhone,
      endPhone
    );
    const arrAccount = [];
    for (let i = startPoint; i <= endPoint; i++) {
      arrAccount.push({
        client_id: client_id,
        phone: "0" + i.toString(),
        password: "123456",
      });
    }
    const rsApi = await axios.post("http://localhost:8080/crawl-account-fpt", {
      accounts: arrAccount,
    });
    if (rsApi && rsApi.data && rsApi.data.data) {
      setData(rsApi.data.data);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" sx={{ color: "#1976d2"}}> Crawl data </Typography>
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
          label="End phone"
          defaultValue=""
          {...register("endPhone", { required: true })}
        />
        <TextField
          required
          id="outlined-required"
          label="Client Id"
          defaultValue=""
          {...register("client_id", { required: true })}
        />
        <Button variant="contained" sx={{ m: 1 }} type="submit">
          Crawl
        </Button>
      </Box>
      <Box
        component="table"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        sx={{  m: 1}}
      >
        <TableHead>
          <TableRow sx={{ background: "#1976d2"}}>
            <TableCell sx={{ color: "white"}}>Phone (Account)</TableCell>
            <TableCell sx={{ color: "white"}} align="right">Password</TableCell>
            <TableCell sx={{ color: "white"}} align="right">Package</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((d, idx) => (
            <TableRow key={idx}>
              <TableCell sx={{ width: "150px",border: ".5px solid #1976d2"}} component="th" scope="row">
                {d.account.phone}
              </TableCell>
              <TableCell sx={{ width: "150px",border: ".5px solid #1976d2"}} align="right">{d.account.password}</TableCell>
              <TableCell sx={{ width: "300px", border: ".5px solid #1976d2"}} align="right">
                {(d.packages || []).map((pk, idex) => (
                  <>
                    {idex === 0 ? "" : <hr />}
                    <span key={idex}>
                      {/* -Tên gói: {pk.plan_name} <br />
                      -Số ngày còn lại: {pk.dateleft} <br />
                      -Ngày hết hạn: {pk.expired_date} <br />
                      -Ngày đăng ký: {pk.from_date} <br /> */}
                      - Tên gói: {pk.plan_name} - {pk.dateleft} ngày
                    </span>
                  </>
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
