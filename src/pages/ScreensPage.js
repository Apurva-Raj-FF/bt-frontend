/**
 * Screens Page Component Module
 * Provides a dashboard for managing and viewing trading screens
 * Includes screen creation, viewing, and results analysis functionality
 * Features pagination and responsive grid layout
 */

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Pagination,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header from "../components/Header";
import theme from "../styles/theme";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import useStrategy from "../hooks/useStrategy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IconButton } from "@mui/material";

/**
 * Mapping of operator signs to their display symbols
 * @type {Object.<string, string>}
 */
const signMap = {
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  eq: "=",
};

/**
 * Formats a query object into a human-readable string
 * @param {string} query - JSON string containing query parameters
 * @returns {string} Formatted query string
 */
const formatQuery = (query) => {
  try {
    const parsedQuery = JSON.parse(query);
    const filters = parsedQuery.filters.map((filter) => {
      const { Data, Operator } = filter;
      const { param, sign, threshold } = Data;
      const mappedSign = signMap[sign] || sign;
      return `${param.name} ${mappedSign} ${threshold} ${Operator}`;
    });
    return filters.join(" ").replace(/ AND$/, "");
  } catch (error) {
    console.error("Error parsing query:", error);
    return "Invalid query";
  }
};

/**
 * Screen Card Component
 * Displays individual screen information in a card format
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Screen title
 * @param {string} props.query - Screen query string
 * @param {Function} props.onViewResults - Callback for viewing results
 * @returns {React.ReactElement} Screen card component
 */
const ScreenCard = ({ title, query, onViewResults }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        color: "primary.contrastText",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 6px 16px rgba(0, 128, 0, 0.3)",
        },
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          color="primary.main"
          sx={{ textTransform: "capitalize", letterSpacing: "0.5px" }}
        >
          {title}
        </Typography>
        <Divider
          sx={{
            my: 1,
            width: "50%",
            mx: "auto",
            borderBottomWidth: 3,
            backgroundColor: "primary.light",
            borderRadius: 5,
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.9rem", fontStyle: "italic" }}
        >
          Query: {query}
        </Typography>
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
        <Button
          variant="outlined"
          color="success"
          size="medium"
          onClick={onViewResults}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            fontSize: "0.875rem",
            fontWeight: "bold",
            color: "primary.main",
            boxShadow: "0px 4px 10px rgba(0, 128, 0, 0.3)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0px 6px 14px rgba(0, 128, 0, 0.4)",
            },
          }}
        >
          View Results
        </Button>
      </Box>
    </Card>
  );
};

ScreenCard.propTypes = {
  title: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  onViewResults: PropTypes.func.isRequired,
};

export default function Screens() {
  const userId = localStorage.getItem("userName");
  const {
    strategies,
    allStrategies,
    savedPagination,
    publicPagination,
    fetchStrategies,
    fetchAllStrategies,
  } = useStrategy(userId);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [publicPage, setPublicPage] = useState(1);

  useEffect(() => {
    fetchStrategies(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchAllStrategies(publicPage);
  }, [publicPage]);

  // Update pagination handlers
  const handleSavedPageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handlePublicPageChange = (event, page) => {
    setPublicPage(page);
  };

  const handleViewResults = (query, id) => {
    navigate("/create-screens", {
      state: { initialQuery: query, strategyId: id, loadResults: true },
    });
  };

  const handleExecuteQuery = (query, id) => {
    navigate("/create-screens", {
      state: { initialQuery: query, strategyId: id, loadResults: false },
    });
  };

  // Remove the duplicate pagination calculations since we're using backend pagination
  const isLoggedIn = !!localStorage.getItem("userName");

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "rgba(96, 173, 94, 0.1)",
          px: { xs: 2, sm: 3, md: 2 }, // Added horizontal padding
          py: 2, // Added vertical padding
          overflowX: "hidden",
        }}
      >
        <Header />
        <Box sx={{ height: 120 }} />

        {/* Create Button with right alignment and margin */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            px: { xs: 2, sm: 3 }, // Added horizontal padding
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/create-screens")}
            sx={{
              borderRadius: 1,
              px: 3,
              py: 1.5,
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0, 128, 0, 0.3)",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 6px 14px rgba(0, 128, 0, 0.4)",
              },
            }}
          >
            <Box
              component="span"
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Create a New Screen
            </Box>
            <Box
              component="span"
              sx={{ display: { xs: "inline", sm: "none" } }}
            >
              Screen
            </Box>
          </Button>
        </Box>

        <Container
          maxWidth="xl"
          sx={{
            p: 2,
            mx: { xs: 2, sm: 3, md: 4 }, // Current
            my: 2,
            mr: { xs: 4, sm: 6, md: 8 }, // Add this to increase right margin
            pr: 2,
          }}
        >
          {isLoggedIn && strategies && strategies.length > 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 4,
                  pr: 2, // Add right padding
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    color="primary.main"
                  >
                    Saved Screens
                  </Typography>
                  <Typography variant="body1" color="black">
                    Manage and create new screening rules
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3} sx={{ pr: 2 }}>
                {strategies.map((strategy, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={strategy.strategy_id}>
                    <ScreenCard
                      title={strategy.name || `Screen ${index + 1}`}
                      query={strategy.formatted_query || "N/A"}
                      onViewResults={() =>
                        handleExecuteQuery(
                          strategy.formatted_query,
                          strategy.strategy_id
                        )
                      }
                    />
                  </Grid>
                ))}
              </Grid>
              {/* Pagination for Saved Screens */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  mb: 4,
                }}
              >
                <Pagination
                  count={savedPagination?.total_pages || 1}
                  page={currentPage}
                  onChange={handleSavedPageChange}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "primary.main",
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                    },
                  }}
                />
              </Box>
            </>
          )}

          <Box
            sx={{
              mt: 2,
              mb: 4,
              pr: 2, // Add right padding
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              color="primary.main"
            >
              Sample Investment Strategies
            </Typography>
            <Typography variant="body1" color="black">
              Explore the sample strategies we have created for you
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {allStrategies && allStrategies.length > 0 ? (
                allStrategies.map((strategy, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px", // Smaller radius
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Lighter shadow
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-3px)", // More subtle hover
                          boxShadow: "0px 4px 12px rgba(0, 128, 0, 0.2)",
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>{" "}
                        {/* Reduced padding */}
                        <Typography
                          variant="subtitle2" // Smaller variant
                          fontWeight="bold"
                          gutterBottom
                          color="primary.main"
                          sx={{
                            textTransform: "capitalize",
                            fontSize: "0.9rem", // Smaller font
                          }}
                        >
                          {strategy.name || `Strategy ${index + 1}`}
                        </Typography>
                        <Divider sx={{ my: 0.5, borderBottomWidth: 1 }} />{" "}
                        {/* Thinner divider */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.7rem", // Smaller font
                            mb: 1,
                            lineHeight: 1.3, // Tighter line height
                          }}
                        >
                          {strategy.formatted_query || "N/A"}
                        </Typography>
                      </CardContent>
                      <Box
                        sx={{
                          p: 1, // Reduced padding
                          pt: 0,
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "flex-end", // Align button to bottom
                        }}
                      >
                        <IconButton
                          color="success"
                          onClick={() =>
                            handleExecuteQuery(
                              strategy.formatted_query,
                              strategy.strategy_id
                            )
                          }
                          sx={{
                            border: "1px solid",
                            borderColor: "success.main",
                            borderRadius: 1.5,
                            p: 0.3,
                            "&:hover": {
                              backgroundColor: "rgba(0, 128, 0, 0.1)",
                            },
                          }}
                        >
                          <ArrowForwardIcon
                            fontSize="small"
                            sx={{ fontSize: "0.9rem" }}
                          />
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 4,
                      px: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      borderRadius: 2,
                      border: "1px dashed #ccc",
                    }}
                  >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Sample Strategies Available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sample investment strategies will appear here once they are created.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
          <Box
            sx={{
              mt: 2,
              mb: 4,
              pr: 2, // Add right padding
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              color="primary.main"
            >
              Popular Investment Strategies
            </Typography>
            <Typography variant="body1" color="black">
              Explore the interesting strategies others have created
            </Typography>

            <TableContainer
              component={Paper}
              sx={{
                mt: 3,
                mb: 3,
                boxShadow: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ color: "primary.main", fontWeight: "bold" }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.main", fontWeight: "bold" }}
                    >
                      Query
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allStrategies && allStrategies.length > 0 ? (
                    allStrategies.map((strategy, index) => (
                      <TableRow
                        key={strategy.strategy_id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      >
                        <TableCell
                          sx={{ fontSize: "0.9rem", fontStyle: "italic" }}
                        >
                          {strategy.name || `Public Screen ${index + 1}`}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "0.9rem", fontStyle: "italic" }}
                        >
                          {strategy.formatted_query || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() =>
                              handleViewResults(
                                strategy.formatted_query,
                                strategy.strategy_id
                              )
                            }
                            sx={{
                              borderRadius: 1,
                              px: 2,
                              py: 1,
                              fontSize: "0.875rem",
                              fontWeight: "bold",
                              color: "primary.main",
                              boxShadow: "0 4px 10px rgba(0, 128, 0, 0.3)",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0 6px 14px rgba(0, 128, 0, 0.4)",
                              },
                            }}
                          >
                            <Box
                              component="span"
                              sx={{ display: { xs: "none", sm: "inline" } }}
                            >
                              View Results
                            </Box>
                            <Box
                              component="span"
                              sx={{ display: { xs: "inline", sm: "none" } }}
                            >
                              View
                            </Box>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Box sx={{ py: 3 }}>
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Public Strategies Available
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Public investment strategies will appear here once users create and share them.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {/* Add pagination for public strategies */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <Pagination
                  count={publicPagination?.total_pages || 1}
                  page={publicPage}
                  onChange={handlePublicPageChange}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "primary.main",
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                    },
                  }}
                />
              </Box>
            </TableContainer>
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
