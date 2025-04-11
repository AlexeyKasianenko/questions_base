"use client";

import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Question, Rank, Category } from "@/app/types";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { redirect, RedirectType } from "next/navigation";
import { Box } from "@mui/system";
import Pagination from "@mui/material/Pagination";
import ReactMarkdown from "react-markdown";
import { useSearchParams } from "next/navigation";
import { RankBadge } from "@/app/components/rank-badge";
import { CategoryBadge } from "@/app/components/category-badge";

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const orderBy = searchParams.get("order_by") || "id";
  const rank = searchParams.get("rank") || "all";
  const category = searchParams.get("category") || "all";

  async function fetchQuestions(page: number = 1) {
    const res = await fetch(
      `/api/questions?_page=${page}&order_by=${orderBy}&category=${category}&rank=${rank}`,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch questions");
    }
    return res.json();
  }

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }
    const res = await fetch(`/api/questions/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setQuestions(questions.filter((question) => question.id !== id));
    }
  };

  useEffect(() => {
    fetchQuestions(currentPage).then((response) => {
      setTotalPages(response.pages);
      setQuestions(response.data);
    });
  }, [currentPage, orderBy, category, rank]);

  const handlePageChanging = (event: BaseSyntheticEvent) => {
    redirect(
      `http://localhost:3000?page=${event.target.innerText}&order_by=${orderBy}&category=${category}&rank=${rank}`,
    );
  };

  const handleOrderByChanging = (event: BaseSyntheticEvent) => {
    redirect(
      `http://localhost:3000?page=${currentPage}&order_by=${event.target.value}&category=${category}&rank=${rank}`,
    );
  };

  const handleRankFilterChanging = (event: BaseSyntheticEvent) => {
    redirect(
      `http://localhost:3000?page=${1}&order_by=${orderBy}&category=${category}&rank=${event.target.value}`,
    );
  };

  const handleCategoryFilterChanging = (event: BaseSyntheticEvent) => {
    redirect(
      `http://localhost:3000?page=${1}&order_by=${orderBy}&category=${event.target.value}&rank=${rank}`,
    );
  };

  return (
    <div>
      <form className="container mx-auto mt-10 columns-3">
        <div>
          <label
            htmlFor="order_by"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Order by
          </label>
          <select
            id="order_by"
            name="order_by"
            value={orderBy}
            onChange={(e) => handleOrderByChanging(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="id">Order by</option>
            <option value="rank">Rank</option>
            <option value="category">Category</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="rank"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Rank filter
          </label>
          <select
            id="rank"
            name="rank"
            value={rank}
            onChange={(e) => handleRankFilterChanging(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="all">All</option>
            {Object.values(Rank).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="category"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Category filter
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => handleCategoryFilterChanging(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="all">All</option>
            {Object.values(Category).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </form>
      <div className="container mx-auto mt-10">
        {questions.map((question: Question) => (
          <Box
            key={question.id}
            sx={{ mb: 5 }}
            display="flex"
            alignItems="center"
          >
            <Accordion sx={{ width: "100%" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Box>
                  <div className="mb-5">
                    <RankBadge rank={question.rank} />
                    <CategoryBadge category={question.category} />
                  </div>
                  <Typography component="h2" sx={{ fontWeight: "bold" }}>
                    {question.title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <ReactMarkdown>{question.body}</ReactMarkdown>
              </AccordionDetails>
            </Accordion>
            <IconButton
              aria-label="edit"
              onClick={() =>
                redirect(`/question/${question.id}`, RedirectType.push)
              }
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => handleDeleteQuestion(question.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Pagination
          count={totalPages}
          page={currentPage}
          color="primary"
          onChange={handlePageChanging}
          sx={{
            display: "flex",
            "& .MuiPagination-ul": {
              margin: "0 auto",
            },
          }}
        />
      </div>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => redirect("/question/0", RedirectType.push)}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
