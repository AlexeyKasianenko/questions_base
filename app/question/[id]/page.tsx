'use client'

import { useState, use } from 'react';
import { redirect, RedirectType } from 'next/navigation'
import useOnMount from "@mui/utils/useOnMount";

export default function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const isNewQuestion = id === 'new';
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    async function fetchQuestion() {
        const res = await fetch(`http://localhost:4000/questions/${id}`);
        if (!res.ok) {
            throw new Error('Failed to fetch questions');
        }
        return res.json();
    }

    useOnMount(() => {
        if (!isNewQuestion) {
            fetchQuestion().then((data) => {
                setTitle(data.title);
                setBody(data.body);
            });
        }
    })

    const handleSaveQuestion = async () => {
        const method = isNewQuestion ? 'POST' : 'PUT';
        const id_param = isNewQuestion ? '' : id;
        const res = await fetch(`http://localhost:4000/questions/${id_param}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body }),
        });

        if (res.ok) {
            // redirect('/', RedirectType.push);
        }
    };

    const handleCancel = () => {
        redirect('/', RedirectType.push);
    }

    return(
        <form className="container mx-auto mt-10">
            <h2 className="text-base/7 font-semibold text-gray-900">Question</h2>
            <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">Title</label>
                <div className="mt-2">
                    <div
                        className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                        <input type="text" name="title" id="title"
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                               className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"/>
                    </div>
                </div>
            </div>

            <div className="col-span-full">
                <label htmlFor="body" className="block text-sm/6 font-medium text-gray-900">Body</label>
                <div className="mt-2">
                        <textarea name="body" id="body" rows={3}
                                  value={body}
                                  onChange={(e) => setBody(e.target.value)}
                                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></textarea>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button"
                        onClick={handleCancel}
                        className="text-sm/6 font-semibold text-gray-900">Cancel</button>
                <button type="submit" onClick={handleSaveQuestion}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save
                </button>
            </div>
        </form>
    );
}