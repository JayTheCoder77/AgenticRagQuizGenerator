import { useState, useContext } from 'react';
import client from '../api/client';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, LogOut, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
        <div className="min-h-screen bg-[#F9F9F9] text-gray-800 font-sans relative overflow-hidden">

            {/* Header */}
            <header className="absolute top-0 w-full p-8 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Quizify.</span>
                </div>
                <div className="flex gap-4 items-center">
                    <a href="https://github.com/JayTheCoder77/AgenticRagQuizGenerator" target="_blank" rel="noopener noreferrer" className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition">
                        <Github size={20} />
                    </a>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-100 transition text-sm font-bold">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </header>


            <div className="max-w-5xl mx-auto pt-32 pb-12 px-8 space-y-12 relative z-20">

                {/* Intro */}
                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">Dashboard</h1>
                    <p className="text-gray-500 text-lg">Upload your docs, and let our agents quiz you.</p>
                    <p className="text-gray-500 text-lg">Note: If topics are entered out of context, the agent might get confused while creating the quiz</p>
                    <p className="text-gray-500 text-lg">Please try to enter topics related to the uploaded documents</p>
                </div>

                {/* Action Grid */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Upload Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                        {/* Decorative Circle */}
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-100 rounded-full group-hover:scale-110 transition-transform"></div>

                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Upload size={24} /></div>
                            Upload PDF
                        </h2>

                        <div className="space-y-4 relative z-10">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-200 rounded-xl"
                                />
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={!file || uploadStatus === 'uploading'}
                                className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex justify-center items-center gap-2"
                            >
                                {uploadStatus === 'uploading' ? <Loader2 className="animate-spin" /> : 'Upload & Process'}
                            </button>

                            {uploadStatus === 'success' && <p className="text-green-600 font-medium text-sm flex justify-center items-center gap-1"><CheckCircle size={16} /> Success!</p>}
                            {uploadStatus === 'error' && <p className="text-red-500 font-medium text-sm flex justify-center items-center gap-1"><AlertCircle size={16} /> Failed.</p>}
                        </div>
                    </div>

                    {/* Quiz Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                        {/* Decorative Circle */}
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-100 rounded-full group-hover:scale-110 transition-transform"></div>

                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><FileText size={24} /></div>
                            Create Quiz
                        </h2>

                        <div className="space-y-4 relative z-10">
                            <div>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Enter Topic (e.g., Biology)"
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all font-medium"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-500">How many questions?</label>
                                    <span className="font-bold text-orange-500">{limit}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={limit}
                                    onChange={(e) => setLimit(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!topic || quizStatus === 'generating'}
                                className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition flex justify-center items-center gap-2"
                            >
                                {quizStatus === 'generating' ? <><Loader2 className="animate-spin" /> Generating...</> : 'Start Quiz'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quiz Display Section */}
                {quiz.length > 0 && (
                    <section className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center text-gray-400 text-sm uppercase tracking-wider mb-6">
                            <span>Question {currentQIndex + 1} of {quiz.length}</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">Agentic Mode</span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white p-10 rounded-3xl shadow-2xl relative border border-gray-100"
                            >
                                <h3 className="text-2xl font-bold mb-8 leading-relaxed text-gray-800">
                                    {quiz[currentQIndex].question}
                                </h3>

                                <div className="space-y-4">
                                    {quiz[currentQIndex].options.map((option, idx) => {
                                        const isSelected = selectedOption === option;
                                        const isCorrect = option === quiz[currentQIndex].answer;

                                        // Base styles
                                        let optionClass = "w-full p-5 text-left rounded-2xl border-2 transition-all flex justify-between items-center font-medium ";

                                        if (showResult) {
                                            if (isCorrect) optionClass += "border-green-500 bg-green-50 text-green-700 font-bold";
                                            else if (isSelected) optionClass += "border-red-500 bg-red-50 text-red-700";
                                            else optionClass += "border-gray-100 text-gray-400 opacity-50";
                                        } else {
                                            if (isSelected) optionClass += "border-orange-500 bg-orange-50 text-orange-700 shadow-md";
                                            else optionClass += "border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-600";
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                disabled={showResult}
                                                onClick={() => setSelectedOption(option)}
                                                className={optionClass}
                                            >
                                                <span className="flex-1">{option}</span>
                                                {showResult && isCorrect && <CheckCircle className="text-green-500" size={20} />}
                                                {showResult && isSelected && !isCorrect && <AlertCircle className="text-red-500" size={20} />}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-10 flex justify-end">
                                    {!showResult ? (
                                        <button
                                            onClick={checkAnswer}
                                            disabled={!selectedOption}
                                            className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 shadow-lg transition-all"
                                        >
                                            Submit Answer
                                        </button>
                                    ) : (
                                        <button
                                            onClick={nextQuestion}
                                            disabled={currentQIndex === quiz.length - 1}
                                            className="px-8 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition-all"
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

            {/* Background Decor */}
            <div className="hidden lg:block absolute left-[-100px] bottom-[-100px] w-96 h-96 bg-orange-100 rounded-full opacity-50 blur-3xl -z-10"></div>
        </div>
    );
}
