import { useState } from 'react';
import client from '../api/client';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    // State for Upload
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error

    // State for Quiz Gen
    const [topic, setTopic] = useState('');
    const [limit, setLimit] = useState(5);
    const [quizStatus, setQuizStatus] = useState('idle'); // idle, generating, success, error
    const [quiz, setQuiz] = useState([]);

    // State for Taking Quiz
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false); // Validating answer

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUploadStatus('idle');
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploadStatus('uploading');
        const formData = new FormData();
        formData.append('file', file);

        try {
            await client.post('/rag/upload', formData);
            setUploadStatus('success');
        } catch (error) {
            console.error(error);
            setUploadStatus('error');
        }
    };

    const handleGenerate = async () => {
        if (!topic) return;
        setQuizStatus('generating');
        setQuiz([]);
        setCurrentQIndex(0);
        setSelectedOption(null);
        setShowResult(false);

        try {
            const res = await client.post('/rag/quiz', { topic, limit });
            setQuiz(res.data.quiz);
            setQuizStatus('success');
        } catch (error) {
            console.error(error);
            setQuizStatus('error');
        }
    };

    const checkAnswer = () => {
        setShowResult(true);
    };

    const nextQuestion = () => {
        setSelectedOption(null);
        setShowResult(false);
        setCurrentQIndex((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <header className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                        Agentic RAG Quiz Generator
                    </h1>
                    <p className="text-gray-400">Upload documents, generate quizzes, and master any topic.</p>
                </header>

                {/* Upload Section */}
                <section className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Upload className="text-blue-400" /> Upload Knowledge Base
                    </h2>
                    <div className="flex gap-4 items-center">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                        />
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploadStatus === 'uploading'}
                            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
                        >
                            {uploadStatus === 'uploading' ? <Loader2 className="animate-spin" /> : 'Upload'}
                        </button>
                    </div>
                    {uploadStatus === 'success' && <p className="text-green-400 mt-2 text-sm flex items-center gap-1"><CheckCircle size={16} /> Uploaded & Ingested Successfully!</p>}
                    {uploadStatus === 'error' && <p className="text-red-400 mt-2 text-sm flex items-center gap-1"><AlertCircle size={16} /> Upload Failed.</p>}
                </section>

                {/* Quiz Config Section */}
                <section className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FileText className="text-green-400" /> Generate Quiz
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Topic</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Ex: Capital Budgeting, Biology, History..."
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Number of Questions: <span className="text-green-400 font-bold">{limit}</span></label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={limit}
                                onChange={(e) => setLimit(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleGenerate}
                            disabled={!topic || quizStatus === 'generating'}
                            className="px-8 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 font-bold text-lg shadow-lg hover:shadow-green-500/20 transition-all flex items-center gap-2"
                        >
                            {quizStatus === 'generating' ? <><Loader2 className="animate-spin" /> Generating Agents...</> : 'Start Quiz'}
                        </button>
                    </div>
                </section>

                {/* Quiz Display Section */}
                {quiz.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex justify-between items-center text-gray-400 text-sm uppercase tracking-wider">
                            <span>Question {currentQIndex + 1} of {quiz.length}</span>
                            <span>Agentic Generated</span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl"
                            >
                                <h3 className="text-2xl font-bold mb-8 leading-relaxed">
                                    {quiz[currentQIndex].question}
                                </h3>

                                <div className="space-y-4">
                                    {quiz[currentQIndex].options.map((option, idx) => {
                                        const isSelected = selectedOption === option;
                                        const isCorrect = option === quiz[currentQIndex].answer;
                                        let optionClass = "w-full p-4 text-left rounded-xl border border-gray-700 hover:bg-gray-700 transition-all flex justify-between items-center";

                                        if (showResult) {
                                            if (isCorrect) optionClass = "w-full p-4 text-left rounded-xl border border-green-500 bg-green-500/20 text-white font-bold flex justify-between items-center";
                                            else if (isSelected) optionClass = "w-full p-4 text-left rounded-xl border border-red-500 bg-red-500/20 text-white flex justify-between items-center";
                                            else optionClass = "w-full p-4 text-left rounded-xl border border-gray-700 opacity-50 flex justify-between items-center";
                                        } else {
                                            if (isSelected) optionClass = "w-full p-4 text-left rounded-xl border border-blue-500 bg-blue-500/20 text-white flex justify-between items-center";
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                disabled={showResult}
                                                onClick={() => setSelectedOption(option)}
                                                className={optionClass}
                                            >
                                                <span className="flex-1">{option}</span>
                                                {showResult && isCorrect && <CheckCircle className="text-green-400" size={20} />}
                                                {showResult && isSelected && !isCorrect && <AlertCircle className="text-red-400" size={20} />}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    {!showResult ? (
                                        <button
                                            onClick={checkAnswer}
                                            disabled={!selectedOption}
                                            className="px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 font-bold shadow-lg transition-all"
                                        >
                                            Submit Answer
                                        </button>
                                    ) : (
                                        <button
                                            onClick={nextQuestion}
                                            disabled={currentQIndex === quiz.length - 1} // Could add 'Finish' button logic here
                                            className="px-8 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 font-bold shadow-lg transition-all"
                                        >
                                            {currentQIndex === quiz.length - 1 ? 'Quiz Completed' : 'Next Question'}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </section>
                )}
            </div>
        </div>
    );
}
