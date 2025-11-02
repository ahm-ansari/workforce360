import { useRouter } from "next/router";
import { Box, Button, Typography, Container, Paper } from "@mui/material";

export default function HomePage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={6}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 5,
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Welcome to WorkForce360
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            A unified HR management platform for employees, payroll, leave, and performance analytics — all in one place.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 5 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => router.push("/register")}
            >
              Register
            </Button>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          sx={{ mt: 5, color: "text.secondary" }}
        >
          © {new Date().getFullYear()} WorkForce360. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
