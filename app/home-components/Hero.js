"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

const StyledBox = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignSelf: "center",
  width: "100%",
  height: 400,
  gap: "20px",
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  backgroundSize: "contain",

  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(10),
    height: 600,
  },
  ...theme.applyStyles("dark", {}),
}));

export default function Hero() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      id="hero"
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              fontSize: "clamp(3rem, 10vw, 3.5rem)",
            }}
          >
            Welcome&nbsp;to&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: "inherit",
                color: "primary.main",
                ...theme.applyStyles("dark", {
                  color: "primary.light",
                }),
              })}
            >
              Foodopedia
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              width: { sm: "100%", md: "80%" },
            }}
          >
            Explore your go-to recipe-sharing platform where chefs, home cooks,
            and food lovers unite. Enjoy intuitive navigation, inspiring dishes,
            and a welcoming space that makes cooking and connecting easier than
            ever.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            useFlexGap
            sx={{ pt: 2, width: { xs: "100%", sm: "275px" } }}
          >
            <Button
              variant="outlined"
              size="small"
              sx={{
                minWidth: "fit-content",
                textTransform: "none",
                px: 2,
                py: 1,
                borderRadius: 1,
                backgroundColor: "transparent",
                borderColor: isDark ? "#4CAF50" : "#B0B0B0",
                color: isDark ? "#4CAF50" : "text.primary",

                "&:hover": {
                  borderColor: "#4CAF50",
                  color: "#4CAF50",
                  backgroundColor: "transparent",
                },
              }}
              onClick={() => {
                window.location.href = "/admin/login";
              }}
            >
              Join as Admin
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                minWidth: "fit-content",
                textTransform: "none",
                px: 2,
                py: 1,
                borderRadius: 1,
                ml: 2,
                backgroundColor: "transparent",
                borderColor: isDark ? "#FF9800" : "#B0B0B0",
                color: isDark ? "#FF9800" : "text.primary",

                "&:hover": {
                  borderColor: "#FF9800",
                  color: "#FF9800",
                  backgroundColor: "transparent",
                },
              }}
              onClick={() => {
                window.location.href = "/viewer/login";
              }}
            >
              Join as Viewer!
            </Button>
          </Stack>
        </Stack>
        <StyledBox>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              padding: "10px",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src="/chef.png"
                alt="Main Chef"
                style={{
                  width: "350px",
                  height: "350px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #4CAF50",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  position: "absolute",
                  top: 20,
                  left: 20,
                  zIndex: 10,
                }}
              />

              <img
                src="idk.png"
                alt="Chef 1"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #4CAF50",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  position: "absolute",
                  top: "50px",
                  left: "400px",
                  zIndex: 5,
                }}
              />

              <img
                src="sisig.png"
                alt="Chef 2"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #4CAF50",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  position: "absolute",
                  top: "250px",
                  right: "15px",
                  zIndex: 5,
                }}
              />

              <img
                src="sinigang.png"
                alt="Dish"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #4CAF50",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  position: "absolute",
                  bottom: "50px",
                  left: "20px",
                  zIndex: 5,
                }}
              />

              <img
                src="karekare.jpeg"
                alt="Chef 3"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #4CAF50",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  position: "absolute",
                  bottom: "40px",
                  left: "220px",
                  zIndex: 5,
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "16px",
              boxSizing: "border-box",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "40px",
                fontWeight: 600,
                marginBottom: "1rem",
                marginTop: "-3rem",
                width: "100%",
                maxWidth: "550px",
                textAlign: "left",
                marginLeft: "1rem",
                letterSpacing: "0.8px",
                lineHeight: "1.4",
              }}
            >
              A Better Way to Share Food Content
            </h1>

            <div
              style={{
                textAlign: "justify",
                fontSize: "13.5px",
                letterSpacing: "0.4px",
                marginLeft: "1rem",
                lineHeight: "1.75",
                paddingRight: "120px",
                fontWeight: 300,
              }}
            >
              <p>
                Our food-focused content management system makes it effortless
                to deliver mouthwatering content to your audience. Designed with
                a clear separation of roles, the platform features a robust
                admin dashboard—where content creators can manage, publish, and
                update food-related entries—and a sleek, user-friendly viewer
                side that showcases it all in real time.
              </p>
              <br></br>
              <p>
                Built with Express.js, Next.js, PostgreSQL, and a modern UI
                toolkit, it’s fast, scalable, and tailored for dynamic food
                content delivery. From kitchen stories to recipe databases, if
                it’s edible, it’s editable.
              </p>
            </div>
          </div>
        </StyledBox>
      </Container>
      <section id='feature'></section>
    </Box>
  );
}
