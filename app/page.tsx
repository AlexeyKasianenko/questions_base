'use client';

import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Question } from "@/app/types";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { redirect, RedirectType } from 'next/navigation'
import { Box } from "@mui/system";
import Pagination from '@mui/material/Pagination';
import ReactMarkdown from 'react-markdown';
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || '1');

  async function fetchQuestions(page: number = 1) {
    const res = await fetch(`http://localhost:4000/questions?_page=${page}&_per_page=10`);
    if (!res.ok) {
      throw new Error('Failed to fetch questions');
    }
    return res.json();
  }

  const handleDeleteQuestion = async (id: number) => {
    if(!confirm('Are you sure you want to delete this question?')) {
        return;
    }
    const res = await fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setQuestions(questions.filter(question => question.id !== id));
    }
  };

  useEffect(() => {
    fetchQuestions(currentPage).then((response) => {
      setTotalPages(response.pages);
      setQuestions(response.data);
    });
  }, [currentPage]);

  const handlePageChanging = (event: BaseSyntheticEvent) => {
    redirect(`http://localhost:3000?page=${event.target.innerText}`);
  }

    return (
      <div>
      <div className="container mx-auto mt-10">
        { questions.map((question: Question) => (
            <Box key={ question.id } sx={{ mb: 5 }} display="flex" alignItems="center">
            <Accordion sx={{ width: '100%' }}>
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header">
                <Typography component="h2" sx={{ fontWeight: 'bold' }}>{ question.title }</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ReactMarkdown>
                { question.body }
                </ReactMarkdown>
              </AccordionDetails>
            </Accordion>
              <IconButton aria-label="edit" onClick={() => redirect(`/question/${question.id}`, RedirectType.push)}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete" onClick={() => handleDeleteQuestion(question.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
        )) }
        <Pagination count={totalPages} page={currentPage} color="primary" onChange={handlePageChanging} />
      </div>
          <Fab color="primary" aria-label="add"
               sx={{ position: 'fixed', bottom: 20, right: 20 }}
               onClick={() => redirect('/question/new', RedirectType.push)} >
              <AddIcon />
          </Fab>
      </div>
  );
}
